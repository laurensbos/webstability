// ===========================================
// WEBSTABILITY SERVER - v4.1.0 WITH SQLITE
// Production-ready with environment variables
// ===========================================

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Configuration and logging
const config = require('./config');
const logger = require('./logger');

// Database module
const database = require('./database');

// Email templates
const emailTemplates = require('./emailTemplates');

// Initialize logger
logger.init({
  level: config.logging.level,
  toFile: config.logging.toFile,
  logPath: config.logging.path
});

// Validate config in production
if (config.isProduction()) {
  const validation = config.validate();
  if (!validation.valid) {
    logger.error('Configuratie fouten gevonden:');
    validation.errors.forEach(err => logger.error(`  - ${err}`));
    process.exit(1);
  }
}

logger.info('Server starting...');
logger.info(`Node version: ${process.version}`);
logger.info(`Environment: ${config.env}`);
logger.debug('Config:', config.print());

// Initialize database
database.initDatabase();

// Migrate existing JSON data to SQLite (only runs once)
try {
  database.migrateFromJSON();
  const stats = database.getStats();
  logger.info('Database stats:', stats);
} catch (err) {
  logger.debug('Migration skipped or completed:', err.message);
}

// Mollie client (lazy loaded)
let mollieClient = null;
function getMollieClient() {
  if (!mollieClient) {
    try {
      const { createMollieClient } = require('@mollie/api-client');
      mollieClient = createMollieClient({
        apiKey: config.mollie.apiKey,
      });
      logger.info('Mollie client initialized');
    } catch (error) {
      logger.error('Mollie init error:', error.message);
    }
  }
  return mollieClient;
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Request logging middleware
app.use(logger.requestLogger());

// Data directory (voor backwards compatibility met oude code)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Legacy JSON file paths (voor migratie referentie)
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const ONBOARDING_FILE = path.join(DATA_DIR, 'onboarding.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Helper functies voor backwards compatibility - nu proxies naar database
function loadData(filePath) {
  // Legacy functie - retourneer lege object
  return {};
}

function saveData(filePath, data) {
  // Legacy functie - doe niets, database wordt direct gebruikt
  return true;
}

// Legacy variabelen voor backwards compatibility (worden niet meer gebruikt)
const projects = {};
const onboardingSubmissions = {};
const submissions = {};

// Service requests storage (drone & logo)
const serviceRequests = {
  drone: [],
  logo: []
};

// Password reset tokens storage (token -> { projectId, email, expiresAt })
const passwordResetTokens = {};

logger.info('Database ready with SQLite storage');

// Email helper functions
function isEmailInUse(email, excludeProjectId = null) {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const allProjects = database.projects.getAll();
  return allProjects.some(p => {
    if (excludeProjectId && p.projectId === excludeProjectId) return false;
    return (p.contactEmail || '').toLowerCase() === normalizedEmail;
  });
}

function findProjectsByEmail(email) {
  if (!email) return [];
  return database.projects.getByEmail(email.toLowerCase().trim());
}

// Magic link token generator (simple hash)
function generateMagicToken(projectId) {
  const secret = config.security.magicLinkSecret;
  const data = projectId + secret;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function verifyMagicToken(projectId, token) {
  return generateMagicToken(projectId) === token;
}

// Send phase change notification email
async function sendPhaseChangeEmail(project, oldPhase, newPhase) {
  if (!project.contactEmail) return false;
  
  const token = generateMagicToken(project.projectId);
  const magicLink = `https://webstability.nl/project/${project.projectId}?t=${token}`;
  
  try {
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: project.contactEmail,
      subject: emailTemplates.phaseUpdate.subject(newPhase),
      html: emailTemplates.phaseUpdate.html({
        name: project.contactName || 'daar',
        businessName: project.businessName,
        phase: newPhase,
        magicLink
      })
    });
    logger.info(`Phase change email sent to ${project.contactEmail} for ${project.projectId}`);
    return true;
  } catch (error) {
    logger.error('Phase change email error:', error);
    return false;
  }
}

// Email transporter - configured via environment variables
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Admin password from config
const ADMIN_PASSWORD = config.security.adminPassword;

// ===========================================
// HEALTH & DEBUG ENDPOINTS
// ===========================================

app.get('/api/health', (req, res) => {
  const stats = database.getStats();
  res.json({ 
    status: 'ok', 
    version: '4.1.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
    projects: stats.projects,
    onboardings: stats.onboarding_submissions
  });
});

app.get('/api/debug', (req, res) => {
  // Only show full debug info in development
  if (!config.isDevelopment()) {
    return res.json({ version: '4.1.0', environment: config.env });
  }
  
  const stats = database.getStats();
  res.json({
    version: '4.1.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
    stats,
    config: config.print()
  });
});

app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: config.email.from,
      to: config.email.admin,
      subject: 'Test Email - ' + new Date().toISOString(),
      html: '<h1>Test Email</h1><p>Email werkt!</p>',
    });
    logger.info('Test email sent successfully');
    res.json({ success: true, message: 'Test email verzonden' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===========================================
// DATABASE STATS ENDPOINT
// ===========================================

app.get('/api/stats', (req, res) => {
  try {
    const stats = database.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Stats ophalen mislukt' });
  }
});

// ===========================================
// PROJECT ENDPOINTS
// ===========================================

app.get('/api/project/:projectId', (req, res) => {
  const { projectId } = req.params;
  let project = database.projects.getById(projectId);
  
  if (!project) {
    // Maak nieuw project aan als het niet bestaat
    const newProject = {
      projectId,
      businessName: '',
      contactName: '',
      contactEmail: '',
      status: 'onboarding',
      statusMessage: 'Vul de onboarding checklist in om te starten.',
      updates: [],
      createdAt: new Date().toISOString()
    };
    database.projects.create(newProject);
    project = database.projects.getById(projectId);
  }
  
  // Voeg magic link toe
  const token = generateMagicToken(projectId);
  project.magicLink = `https://webstability.nl/project/${projectId}?t=${token}`;
  
  res.json(project);
});

// Find project by email or ID
app.get('/api/project-lookup', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Voer minimaal 3 karakters in' });
  }
  
  const trimmedQuery = q.trim();
  
  // Check if it's a project ID (starts with WS-)
  if (trimmedQuery.toUpperCase().startsWith('WS-')) {
    const project = database.projects.getById(trimmedQuery.toUpperCase());
    if (project) {
      return res.json({ 
        success: true, 
        projects: [{ 
          projectId: project.projectId, 
          businessName: project.businessName,
          status: project.status
        }]
      });
    }
  }
  
  // Check if it's an email
  if (trimmedQuery.includes('@')) {
    const matchingProjects = database.projects.getByEmail(trimmedQuery.toLowerCase());
    if (matchingProjects.length > 0) {
      return res.json({ 
        success: true, 
        projects: matchingProjects.map(p => ({
          projectId: p.projectId,
          businessName: p.businessName,
          status: p.status
        }))
      });
    }
  }
  
  // Try search
  const searchResults = database.projects.search(trimmedQuery);
  if (searchResults.length > 0) {
    return res.json({ 
      success: true, 
      projects: searchResults.map(p => ({
        projectId: p.projectId,
        businessName: p.businessName,
        status: p.status
      }))
    });
  }
  
  res.json({ success: false, projects: [] });
});

// Also support POST for backwards compatibility
app.post('/api/project-lookup', (req, res) => {
  const { query } = req.body;
  req.query.q = query;
  // Forward to GET handler logic
  const trimmedQuery = (query || '').trim();
  
  if (trimmedQuery.length < 3) {
    return res.status(400).json({ found: false, error: 'Voer minimaal 3 karakters in' });
  }
  
  // Check if it's a project ID
  if (trimmedQuery.toUpperCase().startsWith('WS-')) {
    const project = database.projects.getById(trimmedQuery.toUpperCase());
    if (project) {
      return res.json({ 
        found: true, 
        projects: [{ 
          projectId: project.projectId, 
          businessName: project.businessName,
          status: project.status
        }]
      });
    }
  }
  
  // Check if it's an email
  if (trimmedQuery.includes('@')) {
    const matchingProjects = database.projects.getByEmail(trimmedQuery.toLowerCase());
    if (matchingProjects.length > 0) {
      return res.json({ 
        found: true, 
        projects: matchingProjects.map(p => ({
          projectId: p.projectId,
          businessName: p.businessName,
          status: p.status
        }))
      });
    }
  }
  
  res.json({ found: false, projects: [] });
});

app.post('/api/project/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const existingProject = database.projects.getById(projectId);
  const oldPhase = existingProject?.status;
  
  // Hash password if provided
  let projectData = { ...req.body };
  if (projectData.password) {
    projectData.passwordHash = await bcrypt.hash(projectData.password, 10);
    delete projectData.password; // Don't store plain text password
  }
  
  // Update of create project
  if (existingProject) {
    database.projects.update(projectId, {
      ...projectData,
      updatedAt: new Date().toISOString()
    });
  } else {
    database.projects.create({
      ...projectData,
      projectId,
      createdAt: new Date().toISOString()
    });
  }
  
  const updatedProject = database.projects.getById(projectId);
  
  // Send email notification if phase changed
  const newPhase = updatedProject?.status;
  if (oldPhase && newPhase && oldPhase !== newPhase) {
    // Don't await - send async
    sendPhaseChangeEmail(updatedProject, oldPhase, newPhase);
  }
  
  res.json({ success: true, project: updatedProject });
});

app.get('/api/projects', (req, res) => {
  res.json(database.projects.getAll());
});

function handleDeleteProject(req, res) {
  try {
    const { projectId } = req.params;
    const { password } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Verwijder project (cascade delete voor messages, updates, etc)
    database.projects.delete(projectId);
    
    // Verwijder onboarding als die bestaat
    database.onboardingSubmissions.delete(projectId);
    
    logger.info(`[Admin] Project deleted: ${projectId}`);
    res.json({ success: true, message: `Project ${projectId} verwijderd`, deletedProject: project });
  } catch (error) {
    logger.error('Error deleting project:', error);
    res.status(500).json({ error: 'Fout bij verwijderen project' });
  }
}

app.delete('/api/project/:projectId', handleDeleteProject);
app.post('/api/project/:projectId/delete', handleDeleteProject);

// ===========================================
// ONBOARDING ENDPOINTS
// ===========================================

app.post('/api/onboarding', async (req, res) => {
  try {
    const data = req.body;
    const { projectId } = data;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is vereist' });
    }
    
    // Sla onboarding op in database
    const onboardingData = { 
      ...data, 
      submittedAt: new Date().toISOString() 
    };
    
    // Check of er al een onboarding bestaat
    const existing = database.onboardingSubmissions.getByProjectId(projectId);
    if (existing) {
      // Update bestaande - voor nu: delete en create nieuw
      database.onboardingSubmissions.delete(projectId);
    }
    database.onboardingSubmissions.create(onboardingData);
    
    // Update project status
    const project = database.projects.getById(projectId);
    if (project) {
      database.projects.update(projectId, {
        status: 'design',
        statusMessage: 'Onboarding ontvangen! We gaan aan de slag.'
      });
      
      // Voeg update toe
      database.projectUpdates.create(projectId, {
        title: 'Onboarding ontvangen',
        message: 'We hebben je gegevens ontvangen en gaan aan de slag!',
        date: new Date().toISOString()
      });
    }
    
    // Email naar developer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `📋 Nieuwe onboarding: ${data.businessName || projectId}`,
      html: `
        <h2>Nieuwe Onboarding Ontvangen</h2>
        <p><strong>Project ID:</strong> ${projectId}</p>
        <p><strong>Bedrijf:</strong> ${data.businessName || '-'}</p>
        <p><strong>Contact:</strong> ${data.contactName || '-'} (${data.contactEmail || '-'})</p>
        <p><strong>Pakket:</strong> ${data.package || '-'}</p>
        <hr>
        <p><a href="https://webstability.nl/dashboard">Bekijk in dashboard →</a></p>
      `,
    });
    
    // Bevestigingsmail naar klant
    if (data.contactEmail) {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: data.contactEmail,
        subject: `✅ Onboarding ontvangen - We gaan aan de slag!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✅ Onboarding Ontvangen!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
                Hoi ${data.contactName || 'daar'}! 👋
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Super! We hebben je onboarding gegevens ontvangen voor <strong>${data.businessName}</strong>. 
                We gaan direct aan de slag met je website!
              </p>

              <!-- Project ID Box -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px 0; font-size: 14px;">Jouw Project ID:</p>
                <p style="color: white; font-size: 24px; font-weight: bold; font-family: monospace; margin: 0; letter-spacing: 2px;">${projectId}</p>
              </div>
              
              <!-- What's Next -->
              <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin: 24px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">📅 Wat gebeurt er nu?</h3>
                <ol style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 2;">
                  <li>We bekijken je materialen en wensen</li>
                  <li>Je ontvangt binnen 5 dagen het eerste ontwerp</li>
                  <li>Je krijgt een preview om feedback te geven</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://webstability.nl/project/${projectId}" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                  📊 Volg je project voortgang
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
                Vragen? Reageer direct op deze email of stuur een WhatsApp.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Met vriendelijke groet,<br>
                <strong style="color: #4b5563;">Team Webstability</strong>
              </p>
            </div>
          </div>
        `,
      });
    }
    
    res.json({ success: true, message: 'Onboarding ontvangen!' });
  } catch (error) {
    logger.error('Onboarding error:', error);
    res.status(500).json({ error: 'Onboarding verzenden mislukt', details: error.message });
  }
});

app.get('/api/onboarding/:projectId', (req, res) => {
  const { projectId } = req.params;
  const onboarding = database.onboardingSubmissions.getByProjectId(projectId);
  if (onboarding) {
    res.json(onboarding);
  } else {
    res.status(404).json({ error: 'Onboarding niet gevonden' });
  }
});

app.get('/api/onboarding-submissions', (req, res) => {
  res.json(database.onboardingSubmissions.getAll());
});

function handleDeleteOnboarding(req, res) {
  try {
    const { projectId } = req.params;
    const { password } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Ongeldig wachtwoord' });
    }
    
    const onboarding = database.onboardingSubmissions.getByProjectId(projectId);
    if (!onboarding) {
      return res.status(404).json({ error: 'Onboarding niet gevonden' });
    }
    
    database.onboardingSubmissions.delete(projectId);
    
    logger.info(`[Admin] Onboarding deleted: ${projectId}`);
    res.json({ success: true, message: `Onboarding ${projectId} verwijderd`, deletedOnboarding: onboarding });
  } catch (error) {
    logger.error('Error deleting onboarding:', error);
    res.status(500).json({ error: 'Fout bij verwijderen onboarding' });
  }
}

app.delete('/api/onboarding/:projectId', handleDeleteOnboarding);
app.post('/api/onboarding/:projectId/delete', handleDeleteOnboarding);

// ===========================================
// SEND MESSAGE / NOTIFICATION TO CLIENT
// ===========================================

app.post('/api/send-client-message', async (req, res) => {
  try {
    const { projectId, template, customMessage, customSubject } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project || !project.contactEmail) {
      return res.status(400).json({ error: 'Project niet gevonden of geen email adres' });
    }
    
    // Message templates
    const templates = {
      'materials_received': {
        subject: '✅ Materialen ontvangen!',
        message: `We hebben je materialen ontvangen voor ${project.businessName}. We gaan direct aan de slag!`
      },
      'design_ready': {
        subject: '🎨 Je design preview is klaar!',
        message: `Goed nieuws! Het eerste ontwerp voor ${project.businessName} staat klaar. Bekijk het via onderstaande link en geef je feedback.`
      },
      'feedback_processed': {
        subject: '✅ Feedback verwerkt',
        message: `Je feedback is verwerkt! Bekijk de aangepaste versie via je project pagina.`
      },
      'reminder_materials': {
        subject: '📋 Herinnering: Materialen nodig',
        message: `We wachten nog op je materialen om verder te kunnen met ${project.businessName}. Upload je logo, teksten en foto's via de onboarding pagina.`
      },
      'reminder_feedback': {
        subject: '👀 Herinnering: Feedback gevraagd',
        message: `We wachten nog op je feedback voor ${project.businessName}. Bekijk de preview en laat weten wat je ervan vindt!`
      },
      'website_live': {
        subject: '🚀 Je website is LIVE!',
        message: `Gefeliciteerd! Je website voor ${project.businessName} is live! Bekijk hem op ${project.liveUrl || 'je nieuwe domein'}.`
      },
      'custom': {
        subject: customSubject || 'Update over je project',
        message: customMessage || ''
      }
    };
    
    const selectedTemplate = templates[template] || templates['custom'];
    
    if (!selectedTemplate.message) {
      return res.status(400).json({ error: 'Geen bericht opgegeven' });
    }
    
    const token = generateMagicToken(projectId);
    const magicLink = `https://webstability.nl/project/${projectId}?t=${token}`;
    
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: project.contactEmail,
      subject: selectedTemplate.subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${selectedTemplate.subject}</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
              Hoi ${project.contactName || 'daar'}! 👋
            </p>
            
            <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
              ${selectedTemplate.message}
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                📊 Bekijk je project
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
              Vragen? Reageer direct op deze email of stuur een WhatsApp naar 06-44712573.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px 30px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              Met vriendelijke groet,<br>
              <strong style="color: #4b5563;">Team Webstability</strong>
            </p>
          </div>
        </div>
      `,
    });
    
    // Add to project messages
    if (!projects[projectId].messages) {
      projects[projectId].messages = [];
    }
    projects[projectId].messages.push({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      from: 'developer',
      message: selectedTemplate.message,
      read: false
    });
    saveData(PROJECTS_FILE, projects);
    
    logger.info(`Client message sent to ${project.contactEmail} (${template})`);
    res.json({ success: true, message: 'Bericht verstuurd!' });
  } catch (error) {
    logger.error('Send client message error:', error);
    res.status(500).json({ error: 'Verzenden mislukt', details: error.message });
  }
});

// ===========================================
// EMAIL CHECK & RECOVERY
// ===========================================

app.get('/api/check-email', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is vereist' });
  }
  const inUse = isEmailInUse(email);
  const existingProjects = inUse ? findProjectsByEmail(email) : [];
  res.json({ 
    inUse, 
    projectCount: existingProjects.length,
    message: inUse ? 'Email is al in gebruik bij een project.' : 'Email is beschikbaar.'
  });
});

app.post('/api/recover-project', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'invalid_email' });
    }
    
    const matchingProjects = findProjectsByEmail(normalizedEmail);
    
    if (matchingProjects.length > 0) {
      const projectList = matchingProjects.map(p => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <strong>${p.projectId}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            ${p.businessName || 'Onbekend'}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <a href="https://webstability.nl/project/${p.projectId}" style="color: #3b82f6;">
              Bekijk →
            </a>
          </td>
        </tr>
      `).join('');
      
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: normalizedEmail,
        subject: '🔑 Je Webstability project-ID(s)',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">🔑 Je Project-ID(s)</h2>
            <p>Je hebt een project-ID herstel aangevraagd. Hier zijn de projecten gekoppeld aan dit e-mailadres:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 12px; text-align: left;">Project ID</th>
                  <th style="padding: 12px; text-align: left;">Bedrijf</th>
                  <th style="padding: 12px; text-align: left;">Link</th>
                </tr>
              </thead>
              <tbody>
                ${projectList}
              </tbody>
            </table>
            <p>Met vriendelijke groet,<br>Team Webstability</p>
          </div>
        `,
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Als dit e-mailadres bij ons bekend is, ontvang je een e-mail met je project-ID(s).'
    });
  } catch (error) {
    logger.error('Recovery error:', error);
    res.status(500).json({ success: false, error: 'server_error' });
  }
});

// ===========================================
// VERIFY PROJECT PASSWORD
// ===========================================

app.post('/api/verify-project', async (req, res) => {
  try {
    const { projectId, password } = req.body;
    
    if (!projectId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en wachtwoord zijn verplicht.' 
      });
    }
    
    const normalizedId = projectId.toUpperCase().trim();
    
    // Check in projects
    if (projects[normalizedId]) {
      const project = projects[normalizedId];
      
      // If project has no password hash (old project), deny access
      if (!project.passwordHash) {
        return res.status(401).json({ 
          success: false, 
          message: 'Dit project heeft geen wachtwoord. Neem contact op met info@webstability.nl.' 
        });
      }
      
      const isValid = await bcrypt.compare(password, project.passwordHash);
      
      if (isValid) {
        return res.json({ 
          success: true, 
          projectId: normalizedId,
          type: 'website'
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Onjuist wachtwoord.' 
        });
      }
    }
    
    // Check in submissions (service requests)
    if (submissions[normalizedId]) {
      const submission = submissions[normalizedId];
      
      if (!submission.passwordHash) {
        return res.status(401).json({ 
          success: false, 
          message: 'Dit project heeft geen wachtwoord. Neem contact op met info@webstability.nl.' 
        });
      }
      
      const isValid = await bcrypt.compare(password, submission.passwordHash);
      
      if (isValid) {
        return res.json({ 
          success: true, 
          projectId: normalizedId,
          type: submission.serviceType || 'service'
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Onjuist wachtwoord.' 
        });
      }
    }
    
    // Check in drone requests
    const droneRequest = serviceRequests.drone.find(r => r.requestId === normalizedId);
    if (droneRequest) {
      if (!droneRequest.passwordHash) {
        return res.status(401).json({ 
          success: false, 
          message: 'Dit project heeft geen wachtwoord. Neem contact op met info@webstability.nl.' 
        });
      }
      
      const isValid = await bcrypt.compare(password, droneRequest.passwordHash);
      
      if (isValid) {
        return res.json({ 
          success: true, 
          projectId: normalizedId,
          type: 'drone'
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Onjuist wachtwoord.' 
        });
      }
    }
    
    // Check in logo requests
    const logoRequest = serviceRequests.logo.find(r => r.requestId === normalizedId);
    if (logoRequest) {
      if (!logoRequest.passwordHash) {
        return res.status(401).json({ 
          success: false, 
          message: 'Dit project heeft geen wachtwoord. Neem contact op met info@webstability.nl.' 
        });
      }
      
      const isValid = await bcrypt.compare(password, logoRequest.passwordHash);
      
      if (isValid) {
        return res.json({ 
          success: true, 
          projectId: normalizedId,
          type: 'logo'
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Onjuist wachtwoord.' 
        });
      }
    }
    
    // Project not found
    return res.status(404).json({ 
      success: false, 
      message: 'Project niet gevonden.' 
    });
    
  } catch (error) {
    logger.error('Verify project error:', error);
    res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
  }
});

// ===========================================
// PASSWORD RESET
// ===========================================

app.post('/api/reset-password', async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();
    const normalizedId = (projectId || '').toUpperCase().trim();
    
    if (!normalizedEmail || !normalizedId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project-ID en e-mailadres zijn verplicht.' 
      });
    }
    
    // Find project in database
    const project = database.projects.getById(normalizedId);
    
    if (project && project.contactEmail?.toLowerCase() === normalizedEmail) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      // Store token
      passwordResetTokens[resetToken] = {
        projectId: normalizedId,
        email: normalizedEmail,
        expiresAt
      };
      
      // Send reset email
      const resetLink = `https://webstability.nl/reset-password?token=${resetToken}`;
      
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: normalizedEmail,
        subject: '🔐 Wachtwoord opnieuw instellen - Webstability',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <svg width="48" height="48" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <rect width="500" height="500" rx="80" fill="#3b82f6"/>
                <text x="250" y="330" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="220" fill="white" text-anchor="middle">web.</text>
              </svg>
            </div>
            
            <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">
              Wachtwoord opnieuw instellen
            </h1>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Je hebt gevraagd om het wachtwoord van je project <strong>${project.businessName || normalizedId}</strong> opnieuw in te stellen.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Nieuw wachtwoord instellen
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0;">
              Of kopieer deze link:<br>
              <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                <strong>Let op:</strong> Deze link is 24 uur geldig. Heb je dit niet aangevraagd? Dan kun je deze email negeren.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              Met vriendelijke groet,<br>
              <strong style="color: #374151;">Team Webstability</strong>
            </p>
          </div>
        `,
      });
    }
    
    // Always return success to prevent email enumeration
    res.json({ 
      success: true, 
      message: 'Als dit e-mailadres gekoppeld is aan dit project, ontvang je een reset link.'
    });
    
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
  }
});

// Endpoint to actually reset the password with token
app.post('/api/reset-password/confirm', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token en nieuw wachtwoord zijn verplicht.' 
      });
    }
    
    if (newPassword.length < 4) {
      return res.status(400).json({ 
        success: false, 
        message: 'Wachtwoord moet minimaal 4 tekens zijn.' 
      });
    }
    
    // Check if token exists and is valid
    const tokenData = passwordResetTokens[token];
    
    if (!tokenData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ongeldige of verlopen reset link.' 
      });
    }
    
    if (Date.now() > tokenData.expiresAt) {
      delete passwordResetTokens[token];
      return res.status(400).json({ 
        success: false, 
        message: 'Deze reset link is verlopen. Vraag een nieuwe aan.' 
      });
    }
    
    // Hash new password and update project
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    // Update in database
    database.projects.update(tokenData.projectId, { passwordHash });
    
    // Delete used token
    delete passwordResetTokens[token];
    
    // Send confirmation email
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: tokenData.email,
      subject: '✅ Wachtwoord gewijzigd - Webstability',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; background: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px;">✅</span>
            </div>
          </div>
          
          <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">
            Wachtwoord succesvol gewijzigd
          </h1>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Het wachtwoord van je project <strong>${tokenData.projectId}</strong> is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord.
          </p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://webstability.nl" style="display: inline-block; padding: 16px 32px; background: #22c55e; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Naar Webstability
            </a>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              Heb je dit niet gedaan? Neem dan direct contact met ons op via info@webstability.nl
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
            Met vriendelijke groet,<br>
            <strong style="color: #374151;">Team Webstability</strong>
          </p>
        </div>
      `,
    });
    
    res.json({ 
      success: true, 
      message: 'Wachtwoord succesvol gewijzigd!'
    });
    
  } catch (error) {
    logger.error('Confirm reset password error:', error);
    res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
  }
});

// ===========================================
// CONTACT FORM
// ===========================================

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message, package: pkg } = req.body;
    
    // Admin notification email
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      replyTo: email,
      subject: `📬 Nieuwe aanvraag: ${name}${company ? ` - ${company}` : ''}`,
      html: emailTemplates.contactForm.html({
        name,
        email,
        phone,
        company,
        packageType: pkg,
        message
      })
    });
    
    // Confirmation to customer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: email,
      subject: `✅ Bedankt voor je bericht, ${name}!`,
      html: emailTemplates.contactConfirmation.html({ name })
    });
    
    res.json({ success: true, message: 'Bericht verzonden!' });
  } catch (error) {
    logger.error('Contact error:', error);
    res.status(500).json({ error: 'Verzenden mislukt', details: error.message });
  }
});

// ===========================================
// PROJECT REQUEST (NEW PROJECT)
// ===========================================

app.post('/api/project-request', async (req, res) => {
  try {
    const data = req.body;
    const projectId = `WS-${Date.now().toString(36).toUpperCase()}`;
    
    logger.info(`📝 Nieuw project: ${projectId} voor ${data.businessName}`);
    
    // Bepaal revisies op basis van pakket
    const packageRevisions = {
      starter: 2,
      professional: 3,
      business: 5,
      webshop: 3
    };
    
    // Hash het wachtwoord (simpele hash voor demo - gebruik bcrypt in productie)
    const projectPassword = data.projectPassword || '';
    
    projects[projectId] = {
      projectId,
      businessName: data.businessName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || '',
      package: data.package,
      projectPassword: projectPassword, // Store password
      status: 'onboarding',
      statusMessage: 'Welkom! Vul de onboarding checklist in om te starten.',
      updates: [{
        date: new Date().toLocaleDateString('nl-NL'),
        title: 'Project aangemaakt',
        message: 'Je aanvraag is ontvangen. Vul de onboarding in om te starten!'
      }],
      createdAt: new Date().toISOString(),
      // Intake data van StartProject wizard
      intakeData: data.intakeData || {
        websiteType: data.websiteType,
        industry: data.industry,
        domain: data.domain,
        domainStatus: data.domainStatus,
        description: data.description,
        primaryColor: data.primaryColor,
        style: data.style,
        exampleSites: data.exampleSites,
        pages: data.pages,
        content: data.content,
        remarks: data.remarks,
        callScheduled: data.callScheduled,
        callDate: data.callDate,
        callTime: data.callTime,
        callTopics: data.callTopics,
      },
      // Revisie tracking
      revisionsUsed: 0,
      revisionsTotal: packageRevisions[data.package] || 2,
      // Initialiseer lege arrays
      messages: [],
      changeRequests: []
    };
    
    // Sla project altijd op VOORDAT we emails versturen
    const saved = saveData(PROJECTS_FILE, projects);
    logger.info(`💾 Project ${projectId} opgeslagen: ${saved}`);
    
    // Stuur emails - maar laat niet de hele request falen als mail niet werkt
    let emailsSent = { admin: false, customer: false };
    
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: 'info@webstability.nl',
        subject: `🎉 Nieuwe projectaanvraag: ${data.businessName}`,
        html: `
          <h2>Nieuwe Projectaanvraag!</h2>
          <p><strong>Project ID:</strong> ${projectId}</p>
          <p><strong>Bedrijf:</strong> ${data.businessName}</p>
          <p><strong>Contact:</strong> ${data.contactName} (${data.contactEmail})</p>
          <p><strong>Pakket:</strong> ${data.package}</p>
          <hr>
          <p><a href="https://webstability.nl/dashboard">Bekijk in dashboard →</a></p>
        `,
      });
      emailsSent.admin = true;
      logger.info(`📧 Admin email verstuurd voor ${projectId}`);
    } catch (emailError) {
      console.warn(`⚠️ Admin email NIET verstuurd voor ${projectId}:`, emailError.message);
    }
    
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: data.contactEmail,
        subject: `🎉 Welkom bij Webstability! Bewaar je Project ID: ${projectId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Welkom ${data.contactName}!</h2>
            <p>Je project is aangemaakt. Hier zijn je gegevens:</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px 0; font-size: 14px;">⚠️ BEWAAR DIT GOED - Je hebt dit nodig om je project te volgen:</p>
              <p style="color: white; font-size: 28px; font-weight: bold; font-family: monospace; margin: 0; letter-spacing: 2px;">${projectId}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Pakket:</strong> ${data.package}</p>
              <p style="margin: 8px 0 0 0;"><strong>Bedrijf:</strong> ${data.businessName}</p>
            </div>
            
            <h3 style="color: #1f2937;">Volgende stappen:</h3>
            <ol style="color: #4b5563; line-height: 1.8;">
              <li>Vul de <strong>onboarding checklist</strong> in (knop hieronder)</li>
              <li>We nemen binnen 24 uur contact met je op</li>
              <li>Volg je project via <a href="https://webstability.nl/project/${projectId}">je project pagina</a></li>
            </ol>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="https://webstability.nl/onboarding/${projectId}" 
                 style="background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Start onboarding →
              </a>
            </p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Tip:</strong> Sla deze email op of maak een screenshot van je Project ID. 
                Je hebt deze nodig om de voortgang te volgen en met ons te communiceren.
              </p>
            </div>
            
            <p style="color: #6b7280;">Met vriendelijke groet,<br>Team Webstability</p>
          </div>
        `,
      });
      emailsSent.customer = true;
      logger.info(`📧 Klant email verstuurd voor ${projectId}`);
    } catch (emailError) {
      console.warn(`⚠️ Klant email NIET verstuurd voor ${projectId}:`, emailError.message);
    }
    
    logger.info(`✅ Project ${projectId} succesvol aangemaakt. Emails: admin=${emailsSent.admin}, customer=${emailsSent.customer}`);
    
    res.json({ 
      success: true, 
      projectId,
      emailsSent // Laat frontend weten of emails zijn verstuurd
    });
  } catch (error) {
    logger.error('❌ Project request error:', error);
    res.status(500).json({ error: 'Aanvraag mislukt', details: error.message });
  }
});

// ===========================================
// CHANGE REQUESTS (MET PRIORITEIT & REVISIE TRACKING)
// ===========================================

app.post('/api/change-request', async (req, res) => {
  try {
    const { projectId, request, priority = 'normal' } = req.body;
    
    if (!projectId || !request) {
      return res.status(400).json({ error: 'Project ID en verzoek zijn vereist' });
    }
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Maak change request in database
    const changeRequest = database.changeRequests.create(projectId, {
      request,
      priority
    });
    
    // Update project revisie teller
    const newRevisionsUsed = (project.revisionsUsed || 0) + 1;
    
    // Bepaal totaal revisies op basis van pakket
    const packageRevisions = {
      starter: 2,
      professional: 3,
      premium: 5,
      business: 5,
      webshop: 3
    };
    const pkg = (project.package || 'starter').toLowerCase();
    const revisionsTotal = project.revisionsTotal || packageRevisions[pkg] || 2;
    
    database.projects.update(projectId, {
      revisionsUsed: newRevisionsUsed,
      revisionsTotal: revisionsTotal
    });
    
    // Voeg update toe
    database.projectUpdates.create(projectId, {
      title: 'Wijzigingsverzoek ontvangen',
      message: request.substring(0, 100) + (request.length > 100 ? '...' : ''),
      date: new Date().toISOString()
    });
    
    const priorityLabels = { low: '🟢 Nice to have', normal: '🟡 Normaal', urgent: '🔴 Urgent' };
    
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      replyTo: project.contactEmail,
      subject: `🔧 ${priorityLabels[priority] || 'Wijzigingsverzoek'}: ${project.businessName} (${projectId})`,
      html: `
        <h2>Nieuw Wijzigingsverzoek</h2>
        <p><strong>Project:</strong> ${project.businessName}</p>
        <p><strong>Project ID:</strong> ${projectId}</p>
        <p><strong>Klant:</strong> ${project.contactName} (${project.contactEmail})</p>
        <p><strong>Prioriteit:</strong> ${priorityLabels[priority] || priority}</p>
        <p><strong>Revisies gebruikt:</strong> ${newRevisionsUsed} / ${revisionsTotal}</p>
        <hr>
        <h3>Verzoek:</h3>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${request}</div>
      `,
    });
    
    if (project.contactEmail) {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: project.contactEmail,
        subject: `🔧 Je wijzigingsverzoek is ontvangen!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔧 Wijziging Aangevraagd</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
                Hoi ${project.contactName || 'daar'}! 👋
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                We hebben je wijzigingsverzoek ontvangen en gaan dit zo snel mogelijk bekijken.
              </p>

              <!-- Request Box -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 12px 12px 0; margin: 24px 0;">
                <p style="color: #92400e; margin: 0 0 8px 0; font-weight: 600;">Je verzoek:</p>
                <p style="color: #78350f; margin: 0; white-space: pre-wrap;">${request}</p>
              </div>

              <!-- Stats -->
              <div style="display: flex; gap: 16px; margin: 24px 0;">
                <div style="flex: 1; background: #f9fafb; padding: 16px; border-radius: 12px; text-align: center;">
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">Prioriteit</p>
                  <p style="color: #1f2937; margin: 4px 0 0 0; font-weight: 600;">${priorityLabels[priority] || 'Normaal'}</p>
                </div>
                <div style="flex: 1; background: #f9fafb; padding: 16px; border-radius: 12px; text-align: center;">
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">Revisies</p>
                  <p style="color: #1f2937; margin: 4px 0 0 0; font-weight: 600;">${newRevisionsUsed} / ${revisionsTotal}</p>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://webstability.nl/project/${projectId}" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                  📊 Bekijk status van je aanvragen
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
                We nemen zo snel mogelijk contact met je op over dit verzoek.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Met vriendelijke groet,<br>
                <strong style="color: #4b5563;">Team Webstability</strong>
              </p>
            </div>
          </div>
        `,
      });
    }
    
    res.json({ 
      success: true, 
      changeRequest,
      revisionsUsed: newRevisionsUsed,
      revisionsTotal: revisionsTotal
    });
  } catch (error) {
    logger.error('Change request error:', error);
    res.status(500).json({ error: 'Verzoek versturen mislukt' });
  }
});

// Update change request status (admin)
app.patch('/api/change-request/:projectId/:requestId', async (req, res) => {
  try {
    const { projectId, requestId } = req.params;
    const { status, response } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Update change request in database
    database.changeRequests.update(requestId, { status, response });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Update mislukt' });
  }
});

// ===========================================
// PROJECT MESSAGES (IN-APP CHAT)
// ===========================================

app.get('/api/messages/:projectId', (req, res) => {
  const { projectId } = req.params;
  const project = database.projects.getById(projectId);
  
  if (!project) {
    return res.status(404).json({ error: 'Project niet gevonden' });
  }
  
  res.json(database.messages.getByProject(projectId));
});

app.post('/api/messages/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, from } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Maak nieuw bericht aan in database
    const newMessage = database.messages.create(projectId, {
      from: from || 'client',
      message,
      date: new Date().toISOString()
    });
    
    // Stuur notificatie email
    if (from === 'client') {
      // Klant stuurt bericht -> notificeer developer
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: 'info@webstability.nl',
        replyTo: project.contactEmail,
        subject: `💬 Nieuw bericht van ${project.businessName} (${projectId})`,
        html: `
          <h2>Nieuw Bericht Ontvangen</h2>
          <p><strong>Project:</strong> ${project.businessName}</p>
          <p><strong>Van:</strong> ${project.contactName} (${project.contactEmail})</p>
          <hr>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          <p style="margin-top: 20px;">
            <a href="https://webstability.nl/dashboard" style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
              Beantwoorden in dashboard
            </a>
          </p>
        `,
      });
    } else if (from === 'developer' && project.contactEmail) {
      // Developer stuurt bericht -> notificeer klant
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: project.contactEmail,
        subject: `💬 Nieuw bericht over je website project!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">💬 Nieuw Bericht!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 20px;">
                Hoi ${project.contactName || 'daar'}! 👋
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Je hebt een nieuw bericht ontvangen over je website project:
              </p>

              <!-- Message Box -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 12px 12px 0; margin: 24px 0;">
                <p style="color: #1e40af; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://webstability.nl/project/${projectId}" 
                   style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
                  💬 Bekijk & Reageer
                </a>
              </div>

              <p style="color: #6b7280; font-size: 14px; text-align: center;">
                Je kunt direct reageren via je project pagina
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                Met vriendelijke groet,<br>
                <strong style="color: #4b5563;">Team Webstability</strong>
              </p>
            </div>
          </div>
        `,
      });
    }
    
    res.json({ success: true, message: newMessage });
  } catch (error) {
    logger.error('Message error:', error);
    res.status(500).json({ error: 'Bericht versturen mislukt' });
  }
});

// Mark messages as read
app.patch('/api/messages/:projectId/read', (req, res) => {
  const { projectId } = req.params;
  const { messageIds } = req.body;
  
  if (!projects[projectId]) {
    return res.status(404).json({ error: 'Project niet gevonden' });
  }
  
  const messages = projects[projectId].messages || [];
  projects[projectId].messages = messages.map(msg => 
    messageIds.includes(msg.id) ? { ...msg, read: true } : msg
  );
  saveData(PROJECTS_FILE, projects);
  
  res.json({ success: true });
});

// ===========================================
// SERVICE REQUESTS
// ===========================================

app.post('/api/service-request', async (req, res) => {
  try {
    const { projectId, service, serviceName, price, name, email, phone, company, remarks } = req.body;
    
    const requestId = `SR-${Date.now().toString(36).toUpperCase()}`;
    
    // Sla op in database
    database.serviceRequests.create({
      id: requestId,
      service,
      serviceName,
      price,
      name,
      email,
      phone,
      company,
      remarks,
      status: 'nieuw'
    });
    
    const project = projectId ? database.projects.getById(projectId) : null;
    
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `🛠️ Service aanvraag: ${serviceName || service}`,
      html: `
        <h2>Nieuwe Service Aanvraag</h2>
        <p><strong>Request ID:</strong> ${requestId}</p>
        <p><strong>Service:</strong> ${serviceName || service}</p>
        <p><strong>Prijs:</strong> ${price || '-'}</p>
        <hr>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${phone || '-'}</p>
        <p><strong>Bedrijf:</strong> ${company || '-'}</p>
        ${project ? `<p><strong>Project:</strong> ${project.businessName} (${projectId})</p>` : ''}
        <hr>
        <p><strong>Opmerkingen:</strong></p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${remarks || '-'}</div>
      `,
    });
    
    res.json({ success: true, requestId });
  } catch (error) {
    logger.error('Service request error:', error);
    res.status(500).json({ error: 'Aanvraag mislukt' });
  }
});

app.get('/api/service-requests', (req, res) => {
  res.json(database.serviceRequests.getAll());
});

app.patch('/api/service-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    database.serviceRequests.updateStatus(id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Update mislukt' });
  }
});

// ===========================================
// SUBMISSIONS (DASHBOARD SYNC)
// ===========================================

app.get('/api/submissions', (req, res) => {
  res.json(database.submissions.getAll());
});

app.post('/api/submissions', (req, res) => {
  try {
    const submission = req.body;
    
    // Check of submission al bestaat
    const existing = database.submissions.getById(submission.id);
    if (existing) {
      database.submissions.update(submission.id, submission);
    } else {
      database.submissions.create(submission);
    }
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Submission save error:', error);
    res.status(500).json({ error: 'Opslaan mislukt' });
  }
});

app.delete('/api/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    database.submissions.delete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Verwijderen mislukt' });
  }
});

// ===========================================
// MOLLIE PAYMENTS
// ===========================================

// Helper functie om BTW te berekenen (21%)
function calculateAmountWithVAT(amountExclVAT) {
  // Parse het bedrag (kan string zijn zoals "99.00" of number)
  const amount = typeof amountExclVAT === 'string' 
    ? parseFloat(amountExclVAT.replace(',', '.')) 
    : amountExclVAT;
  
  // Bereken incl. 21% BTW
  const amountInclVAT = amount * 1.21;
  
  // Return als string met 2 decimalen (Mollie formaat)
  return amountInclVAT.toFixed(2);
}

app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, description, projectId, redirectUrl } = req.body;
    
    const mollie = getMollieClient();
    if (!mollie) {
      return res.status(500).json({ error: 'Mollie niet beschikbaar' });
    }
    
    // Bereken bedrag inclusief 21% BTW
    const amountInclVAT = calculateAmountWithVAT(amount);
    
    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: amountInclVAT
      },
      description: description || `Webstability - ${projectId}`,
      redirectUrl: redirectUrl || `https://webstability.nl/project/${projectId}?payment=success`,
      webhookUrl: 'https://webstability.nl/api/mollie-webhook',
      metadata: {
        projectId,
        type: 'payment',
        amountExclVAT: amount,
        amountInclVAT: amountInclVAT,
        vatPercentage: '21'
      }
    });
    
    res.json({ success: true, checkoutUrl: payment.getCheckoutUrl(), paymentId: payment.id });
  } catch (error) {
    logger.error('Mollie payment error:', error);
    res.status(500).json({ error: 'Betaling aanmaken mislukt', details: error.message });
  }
});

app.post('/api/mollie-webhook', async (req, res) => {
  try {
    const { id } = req.body;
    
    const mollie = getMollieClient();
    if (!mollie) {
      return res.status(200).send('OK');
    }
    
    const payment = await mollie.payments.get(id);
    logger.info(`Payment ${id} status: ${payment.status}`);
    
    if (payment.status === 'paid' && payment.metadata?.projectId) {
      const projectId = payment.metadata.projectId;
      const project = database.projects.getById(projectId);
      if (project) {
        // Voeg update toe
        database.projectUpdates.create(projectId, {
          title: 'Betaling ontvangen',
          message: `Betaling van €${payment.amount.value} ontvangen.`,
          date: new Date().toISOString()
        });
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(200).send('OK');
  }
});

// ===========================================
// SERVICE REQUESTS (DRONE & LOGO)
// ===========================================

// GET all service requests (for admin dashboard)
app.get('/api/service-requests', (req, res) => {
  const { type } = req.query;
  
  if (type && serviceRequests[type]) {
    res.json(serviceRequests[type]);
  } else {
    res.json({
      drone: serviceRequests.drone,
      logo: serviceRequests.logo
    });
  }
});

// GET single service request
app.get('/api/service-requests/:type/:id', (req, res) => {
  const { type, id } = req.params;
  
  if (!serviceRequests[type]) {
    return res.status(400).json({ error: 'Ongeldig service type' });
  }
  
  const request = serviceRequests[type].find(r => r.requestId === id);
  if (!request) {
    return res.status(404).json({ error: 'Aanvraag niet gevonden' });
  }
  
  res.json(request);
});

// POST drone request
app.post('/api/service-request/drone', async (req, res) => {
  try {
    const data = req.body;
    const requestId = `DR-${Date.now().toString(36).toUpperCase()}`;
    
    // Hash the password if provided
    const passwordHash = data.projectPassword ? await bcrypt.hash(data.projectPassword, 10) : null;
    
    const droneRequest = {
      requestId,
      type: 'drone',
      status: 'pending', // pending, confirmed, completed, cancelled
      createdAt: new Date().toISOString(),
      passwordHash, // Store hashed password
      // Location
      locationType: data.locationType,
      locationAddress: data.locationAddress,
      locationCity: data.locationCity,
      locationNotes: data.locationNotes,
      // Capture details
      captureType: data.captureType || [],
      duration: data.duration,
      // Scheduling
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      flexibleSchedule: data.flexibleSchedule,
      confirmedDate: null,
      confirmedTime: null,
      // Contact
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      businessName: data.businessName,
      additionalNotes: data.additionalNotes,
      // Admin fields
      adminNotes: '',
      price: null,
      paymentStatus: 'unpaid', // unpaid, pending, paid
      paymentLink: null
    };
    
    serviceRequests.drone.push(droneRequest);
    
    // Send notification email to admin
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: { user: config.email.user, pass: config.email.pass }
    });
    
    const formattedDate = data.preferredDate ? new Date(data.preferredDate).toLocaleDateString('nl-NL', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    }) : 'Niet opgegeven';
    
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: config.email.adminEmail,
        subject: `🚁 Nieuwe drone aanvraag: ${data.businessName || data.contactName} - ${data.locationCity}`,
        html: `
          <h2>Nieuwe Drone Aanvraag</h2>
          <p><strong>ID:</strong> ${requestId}</p>
          
          <h3>📍 Locatie</h3>
          <p><strong>Type:</strong> ${data.locationType}</p>
          <p><strong>Adres:</strong> ${data.locationAddress}, ${data.locationCity}</p>
          ${data.locationNotes ? `<p><strong>Notities:</strong> ${data.locationNotes}</p>` : ''}
          
          <h3>🎬 Opnames</h3>
          <p><strong>Wat:</strong> ${(data.captureType || []).join(', ')}</p>
          <p><strong>Duur:</strong> ${data.duration}</p>
          
          <h3>📅 Afspraak</h3>
          <p><strong>Voorkeursdatum:</strong> ${formattedDate}</p>
          <p><strong>Voorkeurstijd:</strong> ${data.preferredTime || 'Niet opgegeven'}</p>
          <p><strong>Flexibel:</strong> ${data.flexibleSchedule ? 'Ja' : 'Nee'}</p>
          
          <h3>👤 Contact</h3>
          <p><strong>Naam:</strong> ${data.contactName}</p>
          <p><strong>Bedrijf:</strong> ${data.businessName || '-'}</p>
          <p><strong>Email:</strong> ${data.contactEmail}</p>
          <p><strong>Telefoon:</strong> ${data.contactPhone}</p>
          
          ${data.additionalNotes ? `<h3>📝 Extra notities</h3><p>${data.additionalNotes}</p>` : ''}
          
          <p style="margin-top: 30px;"><a href="https://webstability.nl/dash">Bekijk in dashboard →</a></p>
        `
      });
      logger.info(`📧 Drone request email verstuurd voor ${requestId}`);
    } catch (emailErr) {
      logger.error('Email error:', emailErr.message);
    }
    
    // Send confirmation to customer
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: data.contactEmail,
        subject: `🚁 Je drone aanvraag is ontvangen - ${requestId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9;">Hoi ${data.contactName.split(' ')[0]}!</h2>
            <p>Bedankt voor je drone aanvraag! We hebben alles ontvangen.</p>
            
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 24px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px 0; font-size: 14px;">Je aanvraagnummer</p>
              <p style="color: white; font-size: 28px; font-weight: bold; font-family: monospace; margin: 0; letter-spacing: 2px;">${requestId}</p>
            </div>
            
            <h3>📅 Je voorkeur</h3>
            <p><strong>Datum:</strong> ${formattedDate}</p>
            <p><strong>Tijd:</strong> ${data.preferredTime}</p>
            <p><strong>Locatie:</strong> ${data.locationAddress}, ${data.locationCity}</p>
            
            <h3>Wat nu?</h3>
            <ol>
              <li>We bevestigen de afspraak binnen 24 uur per email</li>
              <li>We nemen 24 uur van tevoren contact op</li>
              <li>Op de dag zelf zijn we 15 min eerder aanwezig</li>
              <li>Binnen 5 werkdagen ontvang je de beelden</li>
            </ol>
            
            <p style="color: #6b7280; margin-top: 30px;">
              Vragen? Reply op deze email of bel ons: 06 44712573<br>
              Team Webstability
            </p>
          </div>
        `
      });
    } catch (emailErr) {
      logger.error('Customer email error:', emailErr.message);
    }
    
    logger.info(`✅ Drone request ${requestId} aangemaakt`);
    res.json({ success: true, requestId });
    
  } catch (error) {
    logger.error('Drone request error:', error);
    res.status(500).json({ error: 'Aanvraag mislukt' });
  }
});

// POST logo request
app.post('/api/service-request/logo', async (req, res) => {
  try {
    const data = req.body;
    const requestId = `LG-${Date.now().toString(36).toUpperCase()}`;
    
    // Hash the password if provided
    const passwordHash = data.projectPassword ? await bcrypt.hash(data.projectPassword, 10) : null;
    
    const logoRequest = {
      requestId,
      type: 'logo',
      status: 'pending', // pending, in_progress, review, completed
      createdAt: new Date().toISOString(),
      passwordHash, // Store hashed password
      // Business info
      businessName: data.businessName,
      industry: data.industry,
      businessDescription: data.businessDescription,
      hasExistingLogo: data.hasExistingLogo,
      // Style preferences
      style: data.style || [],
      colors: data.colors || [],
      avoidColors: data.avoidColors || [],
      // Inspiration
      inspiration: data.inspiration,
      mustHave: data.mustHave,
      mustAvoid: data.mustAvoid,
      // Contact
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      preferCall: data.preferCall,
      additionalNotes: data.additionalNotes,
      // Admin fields
      adminNotes: '',
      concepts: [], // Array of concept URLs
      selectedConcept: null,
      price: 199,
      paymentStatus: 'unpaid',
      paymentLink: null
    };
    
    serviceRequests.logo.push(logoRequest);
    
    // Send notification email to admin
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: { user: config.email.user, pass: config.email.pass }
    });
    
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: config.email.adminEmail,
        subject: `🎨 Nieuwe logo aanvraag: ${data.businessName}${data.preferCall ? ' 📞 CALL GEWENST' : ''}`,
        html: `
          <h2>Nieuwe Logo Aanvraag</h2>
          <p><strong>ID:</strong> ${requestId}</p>
          ${data.preferCall ? '<p style="color: #ea580c; font-weight: bold;">⚠️ KLANT WIL GEBELD WORDEN</p>' : ''}
          
          <h3>🏢 Bedrijf</h3>
          <p><strong>Naam:</strong> ${data.businessName}</p>
          <p><strong>Branche:</strong> ${data.industry}</p>
          <p><strong>Beschrijving:</strong> ${data.businessDescription || '-'}</p>
          <p><strong>Bestaand logo:</strong> ${data.hasExistingLogo ? 'Ja' : 'Nee'}</p>
          
          <h3>🎨 Stijl voorkeuren</h3>
          <p><strong>Stijlen:</strong> ${(data.style || []).join(', ') || '-'}</p>
          <p><strong>Kleuren:</strong> ${(data.colors || []).join(', ') || '-'}</p>
          <p><strong>Vermijden:</strong> ${(data.avoidColors || []).join(', ') || '-'}</p>
          
          <h3>💡 Inspiratie & Wensen</h3>
          <p><strong>Inspiratie:</strong> ${data.inspiration || '-'}</p>
          <p><strong>Moet bevatten:</strong> ${data.mustHave || '-'}</p>
          <p><strong>Vermijden:</strong> ${data.mustAvoid || '-'}</p>
          
          <h3>👤 Contact</h3>
          <p><strong>Naam:</strong> ${data.contactName}</p>
          <p><strong>Email:</strong> ${data.contactEmail}</p>
          <p><strong>Telefoon:</strong> ${data.contactPhone || '-'}</p>
          <p><strong>Wil bellen:</strong> ${data.preferCall ? 'Ja' : 'Nee'}</p>
          
          ${data.additionalNotes ? `<h3>📝 Extra notities</h3><p>${data.additionalNotes}</p>` : ''}
          
          <p style="margin-top: 30px;"><a href="https://webstability.nl/dash">Bekijk in dashboard →</a></p>
        `
      });
      logger.info(`📧 Logo request email verstuurd voor ${requestId}`);
    } catch (emailErr) {
      logger.error('Email error:', emailErr.message);
    }
    
    // Send confirmation to customer
    try {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: data.contactEmail,
        subject: `🎨 Je logo aanvraag is ontvangen - ${requestId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6;">Hoi ${data.contactName.split(' ')[0]}!</h2>
            <p>Bedankt voor je logo aanvraag! We gaan creatief aan de slag.</p>
            
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 24px; border-radius: 12px; margin: 20px 0; text-align: center;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px 0; font-size: 14px;">Je aanvraagnummer</p>
              <p style="color: white; font-size: 28px; font-weight: bold; font-family: monospace; margin: 0; letter-spacing: 2px;">${requestId}</p>
            </div>
            
            <h3>📋 Je gegevens</h3>
            <p><strong>Bedrijf:</strong> ${data.businessName}</p>
            <p><strong>Branche:</strong> ${data.industry}</p>
            <p><strong>Stijl:</strong> ${(data.style || []).join(', ')}</p>
            
            <h3>Wat nu?</h3>
            <ol>
              <li>We nemen je aanvraag door</li>
              ${data.preferCall ? '<li><strong>We bellen je binnen 24 uur</strong></li>' : '<li>Binnen 24 uur nemen we contact op</li>'}
              <li>Na akkoord ontvang je binnen 5 dagen 3 concepten</li>
              <li>Onbeperkte revisies tot je 100% tevreden bent</li>
            </ol>
            
            <p style="color: #6b7280; margin-top: 30px;">
              Vragen? Reply op deze email of bel ons: 06 44712573<br>
              Team Webstability
            </p>
          </div>
        `
      });
    } catch (emailErr) {
      logger.error('Customer email error:', emailErr.message);
    }
    
    logger.info(`✅ Logo request ${requestId} aangemaakt`);
    res.json({ success: true, requestId });
    
  } catch (error) {
    logger.error('Logo request error:', error);
    res.status(500).json({ error: 'Aanvraag mislukt' });
  }
});

// UPDATE service request (for admin)
app.patch('/api/service-requests/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const updates = req.body;
  
  if (!serviceRequests[type]) {
    return res.status(400).json({ error: 'Ongeldig service type' });
  }
  
  const index = serviceRequests[type].findIndex(r => r.requestId === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Aanvraag niet gevonden' });
  }
  
  serviceRequests[type][index] = {
    ...serviceRequests[type][index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  logger.info(`📝 Service request ${id} updated`);
  res.json({ success: true, request: serviceRequests[type][index] });
});

// Create payment link for service request
app.post('/api/service-requests/:type/:id/payment', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { amount, description } = req.body;
    
    if (!serviceRequests[type]) {
      return res.status(400).json({ error: 'Ongeldig service type' });
    }
    
    const request = serviceRequests[type].find(r => r.requestId === id);
    if (!request) {
      return res.status(404).json({ error: 'Aanvraag niet gevonden' });
    }
    
    const mollie = getMollieClient();
    if (!mollie) {
      return res.status(500).json({ error: 'Betaalsysteem niet beschikbaar' });
    }
    
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: amount.toFixed(2) },
      description: description || `${type === 'drone' ? 'Drone opnames' : 'Logo ontwerp'} - ${id}`,
      redirectUrl: `${config.urls.app}/bedankt-service?type=${type}&id=${id}&paid=true`,
      webhookUrl: `${config.urls.api}/api/mollie-webhook`,
      metadata: { serviceType: type, requestId: id }
    });
    
    // Update request with payment info
    const index = serviceRequests[type].findIndex(r => r.requestId === id);
    serviceRequests[type][index].paymentLink = payment.getCheckoutUrl();
    serviceRequests[type][index].paymentId = payment.id;
    serviceRequests[type][index].paymentStatus = 'pending';
    
    res.json({ 
      success: true, 
      paymentUrl: payment.getCheckoutUrl(),
      paymentId: payment.id
    });
    
  } catch (error) {
    logger.error('Payment creation error:', error);
    res.status(500).json({ error: 'Betaallink aanmaken mislukt' });
  }
});

// ===========================================
// DEVELOPER DASHBOARD API ENDPOINTS
// ===========================================

// Developer login
app.post('/api/developer/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ success: false, message: 'Wachtwoord is verplicht.' });
    }
    
    // Check against admin password
    if (password === ADMIN_PASSWORD) {
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      // Store developer session (in-memory for now)
      if (!global.developerSessions) global.developerSessions = {};
      global.developerSessions[sessionToken] = { expiresAt };
      
      logger.info('Developer login successful');
      return res.json({ 
        success: true, 
        token: sessionToken,
        expiresAt
      });
    }
    
    logger.warn('Developer login failed - wrong password');
    return res.status(401).json({ success: false, message: 'Onjuist wachtwoord.' });
    
  } catch (error) {
    logger.error('Developer login error:', error);
    res.status(500).json({ success: false, message: 'Er is een fout opgetreden.' });
  }
});

// Middleware to verify developer session
function verifyDeveloperSession(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Niet ingelogd.' });
  }
  
  const session = global.developerSessions?.[token];
  if (!session || Date.now() > session.expiresAt) {
    delete global.developerSessions?.[token];
    return res.status(401).json({ success: false, message: 'Sessie verlopen.' });
  }
  
  next();
}

// Get all projects for developer dashboard
app.get('/api/developer/projects', verifyDeveloperSession, (req, res) => {
  try {
    const projects = database.projects.getAll();
    
    // Enhance projects with additional data
    const enhancedProjects = projects.map(project => {
      const updates = database.projectUpdates.getByProjectId(project.projectId) || [];
      const messages = database.messages.getByProjectId(project.projectId) || [];
      const changeRequests = database.changeRequests?.getByProjectId(project.projectId) || [];
      
      return {
        ...project,
        updates,
        messages,
        changeRequests,
        unreadMessages: messages.filter(m => m.from_type === 'client' && !m.is_read).length,
        pendingChanges: changeRequests.filter(cr => cr.status === 'pending').length
      };
    });
    
    res.json({ success: true, projects: enhancedProjects });
  } catch (error) {
    logger.error('Get developer projects error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen projecten.' });
  }
});

// Get single project details
app.get('/api/developer/project/:projectId', verifyDeveloperSession, (req, res) => {
  try {
    const { projectId } = req.params;
    const project = database.projects.getById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden.' });
    }
    
    const updates = database.projectUpdates.getByProjectId(projectId) || [];
    const messages = database.messages.getByProjectId(projectId) || [];
    const changeRequests = database.changeRequests?.getByProjectId(projectId) || [];
    const onboarding = database.onboardingSubmissions.getByProjectId(projectId);
    
    res.json({ 
      success: true, 
      project: {
        ...project,
        updates,
        messages,
        changeRequests,
        onboarding
      }
    });
  } catch (error) {
    logger.error('Get developer project error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen project.' });
  }
});

// Update project (developer)
app.patch('/api/developer/project/:projectId', verifyDeveloperSession, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden.' });
    }
    
    const oldPhase = project.status;
    
    // Update project
    database.projects.update(projectId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    const updatedProject = database.projects.getById(projectId);
    
    // If phase changed, send email notification
    if (updates.status && oldPhase !== updates.status) {
      const token = generateMagicToken(projectId);
      const magicLink = `https://webstability.nl/project/${projectId}?t=${token}`;
      
      // Add project update
      database.projectUpdates.create(projectId, {
        title: `Fase gewijzigd naar ${updates.status}`,
        message: `Je project is nu in de ${updates.status} fase.`,
        phase: updates.status,
        date: new Date().toISOString()
      });
      
      // Send email
      if (project.contactEmail) {
        try {
          await transporter.sendMail({
            from: '"Webstability" <info@webstability.nl>',
            to: project.contactEmail,
            subject: emailTemplates.phaseUpdate.subject(updates.status),
            html: emailTemplates.phaseUpdate.html({
              projectId,
              businessName: project.businessName,
              contactName: project.contactName,
              oldPhase,
              newPhase: updates.status,
              magicLink
            })
          });
          logger.info(`Phase change email sent for ${projectId}`);
        } catch (emailErr) {
          logger.error('Phase change email error:', emailErr);
        }
      }
    }
    
    res.json({ success: true, project: updatedProject });
  } catch (error) {
    logger.error('Update developer project error:', error);
    res.status(500).json({ success: false, message: 'Fout bij updaten project.' });
  }
});

// Send message to client
app.post('/api/developer/project/:projectId/message', verifyDeveloperSession, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, sendEmail = true } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden.' });
    }
    
    // Save message to database
    database.messages.create(projectId, {
      from_type: 'developer',
      message,
      is_read: 0
    });
    
    // Send email notification to client
    if (sendEmail && project.contactEmail) {
      const token = generateMagicToken(projectId);
      const magicLink = `https://webstability.nl/project/${projectId}?t=${token}`;
      
      try {
        await transporter.sendMail({
          from: '"Webstability" <info@webstability.nl>',
          to: project.contactEmail,
          subject: `💬 Nieuw bericht over ${project.businessName}`,
          html: emailTemplates.newMessage({
            projectId,
            businessName: project.businessName,
            contactName: project.contactName,
            message,
            magicLink
          })
        });
        logger.info(`Message email sent to ${project.contactEmail}`);
      } catch (emailErr) {
        logger.error('Message email error:', emailErr);
      }
    }
    
    res.json({ success: true, message: 'Bericht verzonden.' });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Fout bij verzenden bericht.' });
  }
});

// Handle change request
app.patch('/api/developer/change-request/:requestId', verifyDeveloperSession, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, response } = req.body;
    
    // Update change request in database
    if (database.changeRequests?.update) {
      database.changeRequests.update(requestId, { 
        status, 
        response,
        updatedAt: new Date().toISOString()
      });
    }
    
    // If completed or rejected, get project and notify client
    const changeRequest = database.changeRequests?.getById?.(requestId);
    if (changeRequest && ['completed', 'rejected'].includes(status)) {
      const project = database.projects.getById(changeRequest.project_id);
      
      if (project?.contactEmail) {
        const statusText = status === 'completed' ? 'uitgevoerd' : 'afgewezen';
        const token = generateMagicToken(project.projectId);
        const magicLink = `https://webstability.nl/project/${project.projectId}?t=${token}`;
        
        try {
          await transporter.sendMail({
            from: '"Webstability" <info@webstability.nl>',
            to: project.contactEmail,
            subject: `${status === 'completed' ? '✅' : '❌'} Wijzigingsverzoek ${statusText}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">
                    ${status === 'completed' ? '✅' : '❌'} Wijzigingsverzoek ${statusText}
                  </h1>
                </div>
                <div style="padding: 40px 30px; background: white;">
                  <p style="font-size: 18px; color: #1f2937;">Hoi ${project.contactName || 'daar'}!</p>
                  <p style="color: #4b5563; line-height: 1.6;">
                    Je wijzigingsverzoek voor <strong>${project.businessName}</strong> is ${statusText}.
                  </p>
                  ${response ? `
                    <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
                      <p style="margin: 0; color: #374151;"><strong>Reactie:</strong></p>
                      <p style="margin: 8px 0 0 0; color: #4b5563;">${response}</p>
                    </div>
                  ` : ''}
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${magicLink}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
                      Bekijk je project
                    </a>
                  </div>
                </div>
              </div>
            `
          });
        } catch (emailErr) {
          logger.error('Change request email error:', emailErr);
        }
      }
    }
    
    res.json({ success: true, message: 'Wijzigingsverzoek bijgewerkt.' });
  } catch (error) {
    logger.error('Handle change request error:', error);
    res.status(500).json({ success: false, message: 'Fout bij bijwerken verzoek.' });
  }
});

// Get dashboard stats
app.get('/api/developer/stats', verifyDeveloperSession, (req, res) => {
  try {
    const projects = database.projects.getAll();
    
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => !['live', 'cancelled'].includes(p.status)).length,
      inReview: projects.filter(p => p.status === 'review').length,
      pendingOnboarding: projects.filter(p => p.status === 'onboarding').length,
      liveProjects: projects.filter(p => p.status === 'live').length,
      recentProjects: projects
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
      projectsByStatus: {
        onboarding: projects.filter(p => p.status === 'onboarding').length,
        design: projects.filter(p => p.status === 'design').length,
        development: projects.filter(p => p.status === 'development').length,
        review: projects.filter(p => p.status === 'review').length,
        live: projects.filter(p => p.status === 'live').length,
      },
      // Calculate monthly revenue estimate
      monthlyRevenue: projects.filter(p => p.status === 'live').reduce((sum, p) => {
        const packagePrices = { starter: 96, professional: 180, business: 301, webshop: 422 };
        return sum + (packagePrices[p.package] || 96);
      }, 0)
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    logger.error('Get developer stats error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen statistieken.' });
  }
});

// Get service requests (drone, logo)
app.get('/api/developer/services', verifyDeveloperSession, (req, res) => {
  try {
    res.json({ 
      success: true, 
      services: {
        drone: serviceRequests.drone || [],
        logo: serviceRequests.logo || []
      }
    });
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen diensten.' });
  }
});

// Mark messages as read
app.post('/api/developer/project/:projectId/messages/read', verifyDeveloperSession, (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Mark all client messages as read
    if (database.messages.markAsRead) {
      database.messages.markAsRead(projectId, 'client');
    }
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Mark messages read error:', error);
    res.status(500).json({ success: false, message: 'Fout bij markeren berichten.' });
  }
});

// ===========================================
// CLIENT-SIDE PROJECT ENDPOINTS (for ProjectStatus sync)
// ===========================================

// Client submits change request
app.post('/api/project/:projectId/change-request', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { request, priority = 'normal' } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden.' });
    }
    
    // Check monthly change limit
    const currentMonth = new Date().toISOString().slice(0, 7);
    const existingChanges = database.changeRequests?.getByProjectId(projectId) || [];
    const thisMonthChanges = existingChanges.filter(
      cr => cr.created_at?.startsWith(currentMonth)
    ).length;
    
    const packageLimits = { starter: 1, professional: 3, business: 5, webshop: 5 };
    const limit = packageLimits[project.package] || 1;
    
    if (thisMonthChanges >= limit) {
      return res.status(400).json({ 
        success: false, 
        message: `Je maandelijkse limiet van ${limit} wijzigingen is bereikt.` 
      });
    }
    
    // Create change request
    if (database.changeRequests?.create) {
      database.changeRequests.create(projectId, {
        request,
        priority,
        status: 'pending'
      });
    }
    
    // Notify developer via email
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `📝 Nieuw wijzigingsverzoek: ${project.businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Nieuw wijzigingsverzoek</h2>
          <p><strong>Project:</strong> ${projectId} - ${project.businessName}</p>
          <p><strong>Prioriteit:</strong> ${priority}</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;">${request}</p>
          </div>
          <p><a href="https://webstability.nl/developer">Bekijk in dashboard →</a></p>
        </div>
      `
    });
    
    res.json({ success: true, message: 'Wijzigingsverzoek ingediend.' });
  } catch (error) {
    logger.error('Submit change request error:', error);
    res.status(500).json({ success: false, message: 'Fout bij indienen verzoek.' });
  }
});

// Client sends message
app.post('/api/project/:projectId/message', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;
    
    const project = database.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project niet gevonden.' });
    }
    
    // Save message
    database.messages.create(projectId, {
      from_type: 'client',
      message,
      is_read: 0
    });
    
    // Notify developer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `💬 Nieuw bericht van ${project.contactName || 'klant'} - ${project.businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Nieuw bericht</h2>
          <p><strong>Van:</strong> ${project.contactName} (${project.contactEmail})</p>
          <p><strong>Project:</strong> ${projectId} - ${project.businessName}</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0;">${message}</p>
          </div>
          <p><a href="https://webstability.nl/developer">Bekijk in dashboard →</a></p>
        </div>
      `
    });
    
    res.json({ success: true, message: 'Bericht verzonden.' });
  } catch (error) {
    logger.error('Client message error:', error);
    res.status(500).json({ success: false, message: 'Fout bij verzenden bericht.' });
  }
});

// Get project messages
app.get('/api/project/:projectId/messages', (req, res) => {
  try {
    const { projectId } = req.params;
    const messages = database.messages.getByProjectId(projectId) || [];
    res.json({ success: true, messages });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen berichten.' });
  }
});

// Get change requests for project
app.get('/api/project/:projectId/change-requests', (req, res) => {
  try {
    const { projectId } = req.params;
    const changeRequests = database.changeRequests?.getByProjectId(projectId) || [];
    res.json({ success: true, changeRequests });
  } catch (error) {
    logger.error('Get change requests error:', error);
    res.status(500).json({ success: false, message: 'Fout bij ophalen verzoeken.' });
  }
});

// ===========================================
// SPA FALLBACK & ERROR HANDLING
// ===========================================

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  if (req.path.includes('.')) return next();
  
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint niet gevonden', path: req.path });
});

// Error handler middleware
app.use(logger.errorHandler());

// ===========================================
// START SERVER
// ===========================================

const PORT = config.port;
app.listen(PORT, () => {
  logger.startup('Webstability', '4.1.0', PORT);
  logger.info(`API URL: ${config.urls.api}`);
  logger.info(`App URL: ${config.urls.app}`);
});