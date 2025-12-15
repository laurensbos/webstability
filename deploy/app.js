const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Mollie client - lazy load om crash te voorkomen
let mollieClient = null;
function getMollieClient() {
  if (!mollieClient) {
    try {
      const { createMollieClient } = require('@mollie/api-client');
      mollieClient = createMollieClient({
        apiKey: process.env.MOLLIE_API_KEY || 'live_yU9vUQMsANfcgJrSs59McdSMNPHfPP',
      });
    } catch (error) {
      console.error('Mollie client init error:', error.message);
    }
  }
  return mollieClient;
}

const app = express();
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Serve static files (je React app)
app.use(express.static(path.join(__dirname, '/')));

// ==========================================
// PERSISTENT DATA STORAGE (JSON FILES)
// ==========================================
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const ONBOARDING_FILE = path.join(DATA_DIR, 'onboarding.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Maak data directory als die niet bestaat
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functies voor persistent storage
function loadData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
  return {};
}

function saveData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
    return false;
  }
}

// Load bestaande data bij opstarten
const projects = loadData(PROJECTS_FILE);
const onboardingSubmissions = loadData(ONBOARDING_FILE);
const submissions = loadData(SUBMISSIONS_FILE);

console.log(`Loaded ${Object.keys(projects).length} projects`);
console.log(`Loaded ${Object.keys(onboardingSubmissions).length} onboarding submissions`);
console.log(`Loaded ${Object.keys(submissions).length} submissions`);

// Email transporter - Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@webstability.nl',
    pass: 'N45eqtu2!jz8j0v'
  }
});

// Test endpoint om email te checken
app.get('/api/test-email', async (req, res) => {
  try {
    // Verify SMTP connection
    await transporter.verify();
    
    // Send test email
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: 'Test Email - ' + new Date().toISOString(),
      text: 'Dit is een test email. Als je dit ziet, werkt de email!',
      html: '<h1>Test Email</h1><p>Als je dit ziet, werkt de email configuratie correct!</p>',
    });
    
    res.json({ success: true, message: 'Test email verzonden naar info@webstability.nl' });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code,
      command: error.command
    });
  }
});

// Debug endpoint - check welke versie draait
app.get('/api/debug', (req, res) => {
  res.json({
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/test-email',
      'GET /api/debug',
      'POST /api/contact',
      'POST /api/project-request',
      'GET /api/project/:projectId',
      'POST /api/project/:projectId',
      'GET /api/projects',
      'POST /api/onboarding',
      'GET /api/onboarding/:projectId',
      'GET /api/onboarding-submissions',
      'POST /api/project-feedback',
      'POST /api/change-request',
      'POST /api/submissions',
      'GET /api/submissions',
      'DELETE /api/submissions/:id'
    ],
    dataDir: DATA_DIR,
    projectsCount: Object.keys(projects).length,
    onboardingCount: Object.keys(onboardingSubmissions).length,
    submissionsCount: Object.keys(submissions).length
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message, package: pkg } = req.body;

    // Stuur email naar info@webstability.nl
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      replyTo: email,
      subject: `Nieuwe aanvraag van ${name}${company ? ` - ${company}` : ''}`,
      html: `
        <h2>Nieuwe contactaanvraag</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Naam:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Telefoon:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          ` : ''}
          ${company ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bedrijf:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${company}</td>
          </tr>
          ` : ''}
          ${pkg ? `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pakket:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${pkg}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bericht:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
      `,
    });

    // Stuur bevestigingsmail naar klant - professionele styling
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: email,
      subject: 'Bedankt voor je aanvraag! We nemen snel contact op 📬',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 40px 30px 40px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 12px;">📬</div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Aanvraag ontvangen!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 22px;">Bedankt ${name}!</h2>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        We hebben je bericht ontvangen en nemen binnen <strong>24 uur</strong> contact met je op.
                      </p>
                      
                      <!-- Steps Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px;">
                            <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Wat gebeurt er nu?</p>
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <span style="display: inline-block; background: #2563eb; color: #fff; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; font-size: 13px; font-weight: 600; margin-right: 12px;">1</span>
                                  <span style="color: #475569; font-size: 15px;">We bekijken je aanvraag</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <span style="display: inline-block; background: #2563eb; color: #fff; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; font-size: 13px; font-weight: 600; margin-right: 12px;">2</span>
                                  <span style="color: #475569; font-size: 15px;">We nemen telefonisch of per email contact op</span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span style="display: inline-block; background: #2563eb; color: #fff; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 50%; font-size: 13px; font-weight: 600; margin-right: 12px;">3</span>
                                  <span style="color: #475569; font-size: 15px;">We bespreken je wensen en maken een voorstel</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
                        Vragen? Reply op deze email of bel ons.<br>
                        <strong style="color: #1e293b;">Team Webstability</strong>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    res.json({ success: true, message: 'Email verzonden!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Email verzenden mislukt', details: error.message });
  }
});

// Project aanvraag endpoint (voor StartProject wizard)
app.post('/api/project-request', async (req, res) => {
  try {
    const data = req.body;
    const projectId = `WS-${Date.now().toString(36).toUpperCase()}`;

    // Email naar developer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      replyTo: data.contactEmail,
      subject: `🚀 Nieuwe projectaanvraag: ${data.businessName} - ${data.package}`,
      html: `
        <h2>Nieuwe Projectaanvraag</h2>
        <p><strong>Project ID:</strong> ${projectId}</p>
        
        <h3>Klantgegevens</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Naam:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.contactName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.contactEmail}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefoon:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.contactPhone || '-'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Bedrijf:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.businessName}</td></tr>
        </table>
        
        <h3>Projectdetails</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Pakket:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.package}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Website type:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.websiteType}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Branche:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.industry}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Design stijl:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.style}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Pagina's:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.pages?.join(', ') || '-'}</td></tr>
        </table>
        
        ${data.callScheduled ? `
        <h3>📞 Gepland Gesprek</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Datum:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.callDate}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Tijd:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.callTime}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Onderwerpen:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.callTopics?.join(', ') || '-'}</td></tr>
        </table>
        ` : ''}
        
        ${data.remarks ? `<h3>Extra informatie</h3><p>${data.remarks}</p>` : ''}
      `,
    });

    // Welkomstmail naar klant - professionele styling
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: data.contactEmail,
      subject: `Welkom bij Webstability! Je project ${projectId} is aangemaakt`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 40px 30px 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Webstability</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Professionele websites vanaf €79/maand</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Hoi ${data.contactName}! 👋</h2>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        Geweldig dat je voor Webstability hebt gekozen! We hebben je aanvraag ontvangen en gaan direct voor je aan de slag.
                      </p>
                      
                      <!-- Project Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px;">
                            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Je projectgegevens</p>
                            <p style="color: #1e293b; font-size: 16px; margin: 0 0 8px 0;"><strong>Project ID:</strong> ${projectId}</p>
                            <p style="color: #1e293b; font-size: 16px; margin: 0 0 8px 0;"><strong>Pakket:</strong> ${data.package}</p>
                            <p style="color: #1e293b; font-size: 16px; margin: 0;"><strong>Bedrijf:</strong> ${data.businessName}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <h3 style="color: #1e293b; font-size: 18px; margin: 0 0 16px 0;">Volgende stappen</h3>
                      
                      <!-- Step 1 -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">1</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="color: #1e293b; font-size: 15px; margin: 0;"><strong>Vul de onboarding checklist in</strong></p>
                            <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Deel je logo, kleuren en content met ons.</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Step 2 -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">2</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="color: #1e293b; font-size: 15px; margin: 0;"><strong>Wij gaan aan de slag</strong></p>
                            <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Binnen 7 dagen ontvang je het eerste ontwerp.</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Step 3 -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                        <tr>
                          <td width="32" valign="top">
                            <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">3</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="color: #1e293b; font-size: 15px; margin: 0;"><strong>Feedback & lancering</strong></p>
                            <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Na je goedkeuring gaat je website live!</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://webstability.nl/onboarding/${projectId}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 10px;">
                              Start onboarding →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #64748b; font-size: 14px; text-align: center; margin: 24px 0 0 0;">
                        Of bekijk je <a href="https://webstability.nl/status/${projectId}" style="color: #3b82f6; text-decoration: none;">project status</a>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
                        Vragen? Reply op deze email of bel ons.<br>
                        <strong style="color: #1e293b;">Team Webstability</strong>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Sla project op (voor status tracking)
    const newProject = {
      projectId,
      businessName: data.businessName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || '',
      package: data.package,
      websiteType: data.websiteType,
      industry: data.industry,
      style: data.style,
      domain: data.domain || '',
      status: 'onboarding',
      statusMessage: 'We wachten op je onboarding materialen.',
      estimatedCompletion: '',
      updates: [
        {
          date: new Date().toLocaleDateString('nl-NL'),
          title: 'Project aangemaakt',
          message: 'Je projectaanvraag is ontvangen. We nemen snel contact met je op!'
        }
      ],
      createdAt: new Date().toISOString()
    };

    // Sla project persistent op
    projects[projectId] = newProject;
    saveData(PROJECTS_FILE, projects);

    res.json({ success: true, projectId });
  } catch (error) {
    console.error('Project request error:', error);
    res.status(500).json({ error: 'Aanvraag verzenden mislukt', details: error.message });
  }
});

// Mollie endpoints
// Pakket prijzen configuratie
const PACKAGE_PRICES = {
  starter: { monthly: 79, setup: 99 },
  professional: { monthly: 149, setup: 99 },
  business: { monthly: 249, setup: 99 },
  webshop: { monthly: 249, setup: 299 }
};

// Endpoint om prijzen op te vragen
app.get('/api/prices', (req, res) => {
  res.json(PACKAGE_PRICES);
});

// Endpoint om totaalprijs te berekenen voor eerste betaling
app.get('/api/calculate-first-payment', (req, res) => {
  const { packageType } = req.query;
  
  if (!packageType || !PACKAGE_PRICES[packageType]) {
    return res.status(400).json({ error: 'Ongeldig pakkettype' });
  }
  
  const prices = PACKAGE_PRICES[packageType];
  const total = prices.monthly + prices.setup;
  const productType = packageType === 'webshop' ? 'Webshop' : 'Website';
  
  res.json({
    packageType,
    productType,
    monthly: prices.monthly,
    setup: prices.setup,
    total,
    description: `Webstability ${productType} - Eerste betaling (€${prices.setup} eenmalig + €${prices.monthly} maandelijks)`
  });
});

app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, description, customerEmail, customerName, redirectUrl, metadata, packageType, isFirstPayment } = req.body;
    
    let finalAmount = amount;
    let finalDescription = description;
    
    // Als het de eerste betaling is EN er is een pakkettype, bereken dan de totale kosten
    if (isFirstPayment && packageType && PACKAGE_PRICES[packageType]) {
      const prices = PACKAGE_PRICES[packageType];
      const totalAmount = prices.monthly + prices.setup;
      finalAmount = totalAmount.toFixed(2);
      
      // Bepaal of het een webshop of website is
      const productType = packageType === 'webshop' ? 'Webshop' : 'Website';
      finalDescription = `Webstability ${productType} - Eerste betaling (€${prices.setup} eenmalig + €${prices.monthly} maandelijks)`;
    } else if (description) {
      // Zorg dat de beschrijving altijd "Webstability" gebruikt (niet "WebStability")
      finalDescription = description.replace(/WebStability/gi, 'Webstability');
    } else {
      finalDescription = 'Webstability - Maandelijkse betaling';
    }

    const payment = await getMollieClient().payments.create({
      amount: { currency: 'EUR', value: finalAmount },
      description: finalDescription,
      redirectUrl: redirectUrl || 'https://webstability.nl/betaling-succes',
      webhookUrl: 'https://webstability.nl/api/mollie-webhook',
      metadata: { customerName, customerEmail, packageType, isFirstPayment, ...metadata },
    });

    res.json({
      success: true,
      paymentUrl: payment.getCheckoutUrl(),
      paymentId: payment.id,
      status: payment.status,
      amount: finalAmount,
      description: finalDescription
    });
  } catch (error) {
    console.error('Mollie error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mollie-webhook', async (req, res) => {
  try {
    const { id } = req.body;
    const payment = await getMollieClient().payments.get(id);
    console.log('Payment update:', payment.id, payment.status);
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/get-payment', async (req, res) => {
  try {
    const { paymentId } = req.query;
    const payment = await getMollieClient().payments.get(paymentId);
    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stuur betaallink per email
app.post('/api/send-payment-link', async (req, res) => {
  try {
    const { to, name, businessName, paymentLink, amount } = req.body;

    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: to,
      subject: `Je betaallink voor ${businessName} 💳`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 40px 30px 40px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 12px;">💳</div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Betaallink voor je website</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 22px;">Hallo ${name}!</h2>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        Bedankt voor je aanvraag bij Webstability! Hieronder vind je de betaallink om je project te starten.
                      </p>
                      
                      <!-- Amount Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px; text-align: center;">
                            <p style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Bedrag</p>
                            <p style="color: #1e293b; font-size: 32px; font-weight: 700; margin: 0;">€${amount}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                        <tr>
                          <td align="center">
                            <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 700; padding: 18px 48px; border-radius: 12px;">
                              Nu betalen →
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
                        Na betaling nemen wij direct contact met je op om je website te bespreken en te starten met de ontwikkeling.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
                        Vragen? Reply op deze email of bel ons.<br>
                        <strong style="color: #1e293b;">Team Webstability</strong>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Stuur ook notificatie naar info@webstability.nl
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `📧 Betaallink verstuurd naar ${businessName}`,
      html: `
        <h3>Betaallink verstuurd</h3>
        <p><strong>Naar:</strong> ${name} (${to})</p>
        <p><strong>Bedrijf:</strong> ${businessName}</p>
        <p><strong>Bedrag:</strong> €${amount}</p>
        <p><strong>Link:</strong> <a href="${paymentLink}">${paymentLink}</a></p>
      `,
    });

    res.json({ success: true, message: 'Betaallink verstuurd!' });
  } catch (error) {
    console.error('Send payment link error:', error);
    res.status(500).json({ error: 'Email versturen mislukt', details: error.message });
  }
});

// ==========================================
// PROJECT & ONBOARDING ENDPOINTS
// ==========================================

// Endpoint om een project op te halen
app.get('/api/project/:projectId', (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('GET /api/project/', projectId);
    
    // Check if projectId has valid format (WS-XXXXX) - minder strikt
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is vereist' });
    }
    
    let project = projects[projectId];
    
    if (project) {
      console.log('Project gevonden:', projectId);
      res.json(project);
    } else {
      // Project niet gevonden - maak een nieuw placeholder project
      // Dit zorgt ervoor dat klanten alsnog kunnen doorgaan met onboarding
      console.log('Project niet gevonden, maak nieuw placeholder:', projectId);
      project = {
        projectId,
        businessName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        package: '',
        status: 'onboarding',
        statusMessage: 'Je project is aangemaakt. Vul de onboarding checklist in om te starten.',
        estimatedCompletion: '',
        updates: [],
        createdAt: new Date().toISOString()
      };
      projects[projectId] = project;
      saveData(PROJECTS_FILE, projects);
      res.json(project);
    }
  } catch (error) {
    console.error('Error in GET /api/project:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Endpoint om project status te updaten (vanuit dashboard)
app.post('/api/project/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const data = req.body;
  
  const oldProject = projects[projectId];
  const oldStatus = oldProject?.status;
  const newStatus = data.status;
  
  projects[projectId] = {
    ...projects[projectId],
    ...data,
    projectId,
    updatedAt: new Date().toISOString()
  };
  
  saveData(PROJECTS_FILE, projects);
  
  // Stuur email naar klant als status is gewijzigd
  const customerEmail = projects[projectId].contactEmail;
  if (customerEmail && oldStatus && newStatus && oldStatus !== newStatus) {
    try {
      const statusLabels = {
        'onboarding': 'Onboarding',
        'design': 'Design fase',
        'development': 'Development fase',
        'review': 'Review fase',
        'live': 'Live! 🎉'
      };
      
      const statusDescriptions = {
        'onboarding': 'We verzamelen nog je materialen en informatie.',
        'design': 'We zijn bezig met het ontwerp van je website. Je ontvangt binnenkort een preview!',
        'development': 'Het ontwerp is goedgekeurd en we bouwen nu je website.',
        'review': 'Je website is klaar voor review! Bekijk de preview en geef je feedback.',
        'live': 'Gefeliciteerd! Je website is nu live en bereikbaar voor iedereen!'
      };
      
      const newStatusLabel = statusLabels[newStatus] || newStatus;
      const statusDescription = statusDescriptions[newStatus] || '';
      const businessName = projects[projectId].businessName || 'Je project';
      const statusMessage = projects[projectId].statusMessage || statusDescription;
      
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: customerEmail,
        subject: `${newStatus === 'live' ? '🎉 ' : '📊 '}Update: ${businessName} - ${newStatusLabel}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0; font-weight: 700;">Project Update</h1>
                        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">${businessName}</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                          Goed nieuws! Er is een update voor je project.
                        </p>
                        
                        <!-- Status Badge -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 24px; text-align: center;">
                              <p style="color: #0369a1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Nieuwe Status</p>
                              <p style="color: #0c4a6e; font-size: 28px; font-weight: 700; margin: 0;">${newStatusLabel}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                          ${statusMessage}
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center">
                              <a href="https://webstability.nl/project/${projectId}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; padding: 16px 32px; border-radius: 12px;">
                                Bekijk volledige status →
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Project Info -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                          <tr>
                            <td style="padding: 8px 0;">
                              <span style="color: #64748b; font-size: 14px;">Project-ID:</span>
                              <span style="color: #1e293b; font-size: 14px; font-weight: 600; float: right; font-family: monospace;">${projectId}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
                          Vragen over je project? Reply op deze email of bel ons.<br>
                          <strong style="color: #1e293b;">Team Webstability</strong>
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
      console.log(`Status update email sent to ${customerEmail} for project ${projectId}: ${oldStatus} -> ${newStatus}`);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // We gaan door ook als email faalt
    }
  }
  
  res.json({ success: true, project: projects[projectId] });
});

// Endpoint om alle projecten op te halen (voor dashboard)
app.get('/api/projects', (req, res) => {
  res.json(Object.values(projects));
});

// Endpoint om onboarding data te ontvangen
app.post('/api/onboarding', async (req, res) => {
  try {
    const data = req.body;
    const { projectId, isUpdate } = data;
    
    console.log('POST /api/onboarding - Project:', projectId, isUpdate ? '(UPDATE)' : '(NEW)');
    console.log('Onboarding data received:', JSON.stringify(data, null, 2));
    
    // Validatie
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is vereist' });
    }
    if (!data.contactEmail) {
      return res.status(400).json({ error: 'Email is vereist' });
    }
    
    // Check of dit een update is
    const existingOnboarding = onboardingSubmissions[projectId];
    
    // Sla onboarding data persistent op
    onboardingSubmissions[projectId] = {
      ...data,
      submittedAt: existingOnboarding?.submittedAt || new Date().toISOString(),
      updatedAt: isUpdate ? new Date().toISOString() : undefined
    };
    const onboardingSaved = saveData(ONBOARDING_FILE, onboardingSubmissions);
    console.log('Onboarding saved:', onboardingSaved);
    
    // Update project status (alleen bij nieuwe onboarding, niet bij update)
    if (!isUpdate) {
      if (projects[projectId]) {
        projects[projectId].status = 'design';
        projects[projectId].statusMessage = 'Onboarding ontvangen! We gaan aan de slag met het ontwerp.';
        projects[projectId].updates = [
          ...(projects[projectId].updates || []),
          {
            date: new Date().toLocaleDateString('nl-NL'),
            title: 'Onboarding ingevuld',
            message: 'Bedankt voor het invullen van de onboarding. We gaan nu aan de slag!'
          }
        ];
        const projectSaved = saveData(PROJECTS_FILE, projects);
        console.log('Project updated:', projectSaved);
      } else {
        // Maak nieuw project aan als het niet bestaat
        console.log('Project niet gevonden, maak nieuw aan');
        projects[projectId] = {
          projectId,
          businessName: data.businessName || '',
          contactName: data.contactName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          status: 'design',
          statusMessage: 'Onboarding ontvangen! We gaan aan de slag met het ontwerp.',
          updates: [{
            date: new Date().toLocaleDateString('nl-NL'),
            title: 'Onboarding ingevuld',
            message: 'Bedankt voor het invullen van de onboarding. We gaan nu aan de slag!'
          }],
          createdAt: new Date().toISOString()
        };
        saveData(PROJECTS_FILE, projects);
      }
    } else {
      // Bij update, voeg update toe aan project
      if (projects[projectId]) {
        projects[projectId].updates = [
          ...(projects[projectId].updates || []),
          {
            date: new Date().toLocaleDateString('nl-NL'),
            title: 'Onboarding gewijzigd',
            message: 'Klant heeft de onboarding informatie bijgewerkt.'
          }
        ];
        saveData(PROJECTS_FILE, projects);
      }
    }
    
    // Stuur email naar developer
    console.log('Sending notification email to info@webstability.nl...');
    try {
      await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `📋 ${isUpdate ? 'Onboarding GEWIJZIGD' : 'Nieuwe onboarding ontvangen'} - ${data.businessName} (${projectId})`,
      html: `
        <h2>${isUpdate ? '📝 Onboarding Gewijzigd' : '📋 Nieuwe Onboarding Ontvangen'}</h2>
        <p><strong>Project ID:</strong> ${projectId}</p>
        <p><strong>Bedrijf:</strong> ${data.businessName}</p>
        ${isUpdate ? '<p style="color: #f59e0b; font-weight: bold;">⚠️ Dit is een wijziging van een eerder ingevulde onboarding!</p>' : ''}
        
        <h3>Contactgegevens</h3>
        <p><strong>Naam:</strong> ${data.contactName}</p>
        <p><strong>Email:</strong> ${data.contactEmail}</p>
        <p><strong>Telefoon:</strong> ${data.contactPhone || '-'}</p>
        
        <h3>Bedrijfsinformatie</h3>
        <p><strong>Over het bedrijf:</strong><br>${data.aboutText}</p>
        <p><strong>Diensten/Producten:</strong><br>${data.services}</p>
        <p><strong>USPs:</strong><br>${data.uniqueSellingPoints || '-'}</p>
        
        <h3>Branding</h3>
        <p><strong>Logo:</strong> ${data.hasLogo}</p>
        <p><strong>Logo beschrijving:</strong> ${data.logoDescription || '-'}</p>
        <p><strong>Kleuren:</strong> ${data.brandColors || '-'}</p>
        <p><strong>Lettertype:</strong> ${data.brandFonts || '-'}</p>
        
        <h3>Media</h3>
        <p><strong>Foto's:</strong><br>${data.photos || '-'}</p>
        <p><strong>Social Media:</strong><br>${data.socialMedia || '-'}</p>
        
        <h3>Extra</h3>
        <p><strong>Concurrenten/Inspiratie:</strong><br>${data.competitors || '-'}</p>
        <p><strong>Extra wensen:</strong><br>${data.extraWishes || '-'}</p>
      `,
    });
    console.log('Notification email sent');
    } catch (emailError) {
      console.error('Email to developer failed:', emailError.message);
      // Ga door, data is al opgeslagen
    }
    
    // Bevestigingsmail naar klant - professionele styling
    console.log('Sending confirmation email to:', data.contactEmail);
    try {
      await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: data.contactEmail,
      subject: `Onboarding ontvangen - We gaan aan de slag! 🚀`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px 30px 40px; text-align: center;">
                      <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Onboarding ontvangen!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 22px;">Bedankt ${data.contactName}!</h2>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                        We hebben alle informatie ontvangen en gaan direct aan de slag met je website. Binnen <strong>7 werkdagen</strong> ontvang je het eerste ontwerp.
                      </p>
                      
                      <!-- Project Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px;">
                            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Project</p>
                            <p style="color: #1e293b; font-size: 16px; margin: 0 0 4px 0;"><strong>${data.businessName}</strong></p>
                            <p style="color: #64748b; font-size: 14px; margin: 0;">${projectId}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <h3 style="color: #1e293b; font-size: 16px; margin: 0 0 12px 0;">Wat gebeurt er nu?</h3>
                      
                      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                        Ons team bekijkt je gegevens en begint met het ontwerp. Je ontvangt een email zodra het eerste ontwerp klaar is voor review.
                      </p>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://webstability.nl/status/${projectId}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 10px;">
                              Bekijk project status →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #64748b; font-size: 14px; margin: 0; text-align: center;">
                        Vragen? Reply op deze email of bel ons.<br>
                        <strong style="color: #1e293b;">Team Webstability</strong>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    console.log('Confirmation email sent to customer');
    } catch (emailError) {
      console.error('Email to customer failed:', emailError.message);
      // Ga door, data is al opgeslagen
    }
    
    console.log('Onboarding completed successfully');
    res.json({ success: true, message: 'Onboarding ontvangen!' });
  } catch (error) {
    console.error('Onboarding error:', error);
    res.status(500).json({ error: 'Onboarding verzenden mislukt', details: error.message });
  }
});

// Endpoint om alle onboarding submissions op te halen (voor dashboard)
app.get('/api/onboarding-submissions', (req, res) => {
  res.json(Object.values(onboardingSubmissions));
});

// Endpoint om specifieke onboarding op te halen
app.get('/api/onboarding/:projectId', (req, res) => {
  const { projectId } = req.params;
  const onboarding = onboardingSubmissions[projectId];
  
  if (onboarding) {
    res.json(onboarding);
  } else {
    res.status(404).json({ error: 'Onboarding niet gevonden' });
  }
});

// Endpoint om design feedback te ontvangen
app.post('/api/project-feedback', async (req, res) => {
  try {
    const { projectId, approved, feedback, type } = req.body;
    
    const project = projects[projectId];
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Update project
    const feedbackUpdate = {
      date: new Date().toLocaleDateString('nl-NL'),
      title: approved ? `${type === 'design' ? 'Design' : 'Review'} goedgekeurd` : `Feedback ontvangen`,
      message: approved ? 'Klant heeft het design goedgekeurd!' : feedback
    };
    
    projects[projectId].updates = [...(projects[projectId].updates || []), feedbackUpdate];
    
    // Als goedgekeurd, ga naar volgende fase
    if (approved && type === 'design') {
      projects[projectId].status = 'development';
      projects[projectId].statusMessage = 'Design is goedgekeurd! We zijn nu bezig met de development.';
    }
    
    saveData(PROJECTS_FILE, projects);
    
    // Email naar developer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      subject: `${approved ? '✅' : '📝'} Feedback ontvangen: ${project.businessName} (${projectId})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h2 style="color: ${approved ? '#16a34a' : '#f59e0b'};">${approved ? '✅ Design Goedgekeurd!' : '📝 Feedback Ontvangen'}</h2>
          <p><strong>Project:</strong> ${project.businessName}</p>
          <p><strong>Project ID:</strong> ${projectId}</p>
          <p><strong>Type:</strong> ${type}</p>
          ${feedback ? `<p><strong>Feedback:</strong></p><div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">${feedback}</div>` : ''}
          <hr>
          <p><a href="https://webstability.nl/dashboard">Bekijk in Dashboard →</a></p>
        </body>
        </html>
      `,
    });
    
    // Bevestigingsmail naar klant
    if (project.contactEmail) {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: project.contactEmail,
        subject: approved ? '✅ Je feedback is ontvangen - Design goedgekeurd!' : '📝 Je feedback is ontvangen',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, ${approved ? '#16a34a' : '#f59e0b'} 0%, ${approved ? '#15803d' : '#d97706'} 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">${approved ? '✅ Design Goedgekeurd!' : '📝 Feedback Ontvangen'}</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #475569; font-size: 16px;">Beste ${project.contactName || 'klant'},</p>
                        <p style="color: #475569; font-size: 16px;">
                          ${approved 
                            ? 'Bedankt voor je goedkeuring! We gaan nu aan de slag met de development van je website.' 
                            : 'Bedankt voor je feedback! We gaan hier zo snel mogelijk mee aan de slag.'
                          }
                        </p>
                        ${feedback ? `<div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;"><strong>Je feedback:</strong><br>${feedback}</div>` : ''}
                        <p style="text-align: center; margin-top: 32px;">
                          <a href="https://webstability.nl/project/${projectId}" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">Bekijk project status →</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Team Webstability</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Feedback versturen mislukt' });
  }
});

// Endpoint om wijzigingsverzoek te ontvangen (voor live projecten)
app.post('/api/change-request', async (req, res) => {
  try {
    const { projectId, request } = req.body;
    
    const project = projects[projectId];
    if (!project) {
      return res.status(404).json({ error: 'Project niet gevonden' });
    }
    
    // Update project met wijzigingsverzoek
    const changeUpdate = {
      date: new Date().toLocaleDateString('nl-NL'),
      title: 'Wijzigingsverzoek ontvangen',
      message: request
    };
    
    projects[projectId].updates = [...(projects[projectId].updates || []), changeUpdate];
    saveData(PROJECTS_FILE, projects);
    
    // Email naar developer
    await transporter.sendMail({
      from: '"Webstability" <info@webstability.nl>',
      to: 'info@webstability.nl',
      replyTo: project.contactEmail,
      subject: `🔧 Wijzigingsverzoek: ${project.businessName} (${projectId})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <h2 style="color: #3b82f6;">🔧 Nieuw Wijzigingsverzoek</h2>
          <p><strong>Project:</strong> ${project.businessName}</p>
          <p><strong>Project ID:</strong> ${projectId}</p>
          <p><strong>Pakket:</strong> ${project.package || 'Onbekend'}</p>
          <p><strong>Klant:</strong> ${project.contactName} (${project.contactEmail})</p>
          <hr>
          <h3>Wijzigingsverzoek:</h3>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${request}</div>
          <hr>
          <p><a href="mailto:${project.contactEmail}?subject=Re: Wijzigingsverzoek ${projectId}">Reageer naar klant →</a></p>
        </body>
        </html>
      `,
    });
    
    // Bevestigingsmail naar klant
    if (project.contactEmail) {
      await transporter.sendMail({
        from: '"Webstability" <info@webstability.nl>',
        to: project.contactEmail,
        subject: '🔧 Wijzigingsverzoek ontvangen',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0;">🔧 Wijzigingsverzoek Ontvangen</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <p style="color: #475569; font-size: 16px;">Beste ${project.contactName || 'klant'},</p>
                        <p style="color: #475569; font-size: 16px;">We hebben je wijzigingsverzoek ontvangen en gaan dit zo snel mogelijk bekijken.</p>
                        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                          <strong>Je verzoek:</strong><br>
                          <span style="white-space: pre-wrap;">${request}</span>
                        </div>
                        <p style="color: #475569; font-size: 16px;">We nemen zo snel mogelijk contact met je op over de mogelijkheden en eventuele kosten.</p>
                        <p style="text-align: center; margin-top: 32px;">
                          <a href="https://webstability.nl/project/${projectId}" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600;">Bekijk project status →</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; font-size: 14px; margin: 0;">Team Webstability</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Change request error:', error);
    res.status(500).json({ error: 'Verzoek versturen mislukt' });
  }
});

// Endpoint om submissions (aanvragen) op te slaan (sync met dashboard localStorage)
app.post('/api/submissions', (req, res) => {
  try {
    const data = req.body;
    const { id } = data;
    
    submissions[id] = {
      ...data,
      savedAt: new Date().toISOString()
    };
    saveData(SUBMISSIONS_FILE, submissions);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Opslaan mislukt' });
  }
});

// Endpoint om submissions op te halen
app.get('/api/submissions', (req, res) => {
  res.json(Object.values(submissions));
});

// Endpoint om een submission te verwijderen
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (submissions[id]) {
      delete submissions[id];
      saveData(SUBMISSIONS_FILE, submissions);
      res.json({ success: true });
    } else {
      res.json({ success: true, message: 'Submission niet gevonden (mogelijk al verwijderd)' });
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Verwijderen mislukt' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
