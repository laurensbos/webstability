/**
 * SQLite Database Module voor Webstability
 * Vervangt JSON bestand opslag met echte database
 * 
 * @version 1.0.0
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database bestand locatie
const DB_PATH = path.join(__dirname, 'data', 'webstability.db');

// Zorg dat data directory bestaat
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database connectie
const db = new Database(DB_PATH);

// Enable WAL mode voor betere performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ============================================
// SCHEMA SETUP
// ============================================

const initDatabase = () => {
  console.log('📦 Initializing SQLite database...');

  // Projects tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT UNIQUE NOT NULL,
      business_name TEXT NOT NULL,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      package TEXT DEFAULT 'starter',
      status TEXT DEFAULT 'onboarding',
      status_message TEXT,
      estimated_completion TEXT,
      design_preview_url TEXT,
      live_url TEXT,
      google_drive_url TEXT,
      revisions_used INTEGER DEFAULT 0,
      revisions_total INTEGER DEFAULT 2,
      intake_data TEXT,
      phase_deadlines TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Project updates tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      phase TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
    )
  `);

  // Messages tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      from_type TEXT NOT NULL CHECK(from_type IN ('client', 'developer')),
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
    )
  `);

  // Change requests tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS change_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT NOT NULL,
      request TEXT NOT NULL,
      priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'urgent')),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed')),
      response TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
    )
  `);

  // Submissions tabel (van /start flow)
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id TEXT UNIQUE,
      timestamp TEXT,
      package TEXT,
      website_type TEXT,
      industry TEXT,
      domain TEXT,
      domain_status TEXT,
      business_name TEXT,
      tagline TEXT,
      description TEXT,
      primary_color TEXT,
      style TEXT,
      example_sites TEXT,
      pages TEXT,
      content TEXT,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Onboarding submissions tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS onboarding_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT,
      business_name TEXT,
      contact_name TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      about_text TEXT,
      services TEXT,
      unique_selling_points TEXT,
      has_logo TEXT,
      logo_description TEXT,
      brand_colors TEXT,
      brand_fonts TEXT,
      photos TEXT,
      social_media TEXT,
      competitors TEXT,
      extra_wishes TEXT,
      submitted_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE SET NULL
    )
  `);

  // Service requests tabel
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT UNIQUE,
      service TEXT,
      service_name TEXT,
      price TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      remarks TEXT,
      status TEXT DEFAULT 'nieuw' CHECK(status IN ('nieuw', 'in_behandeling', 'afgerond')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Indexes voor snellere queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_projects_email ON projects(contact_email);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_project_id ON projects(project_id);
    CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id);
    CREATE INDEX IF NOT EXISTS idx_updates_project ON project_updates(project_id);
    CREATE INDEX IF NOT EXISTS idx_change_requests_project ON change_requests(project_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(contact_email);
    CREATE INDEX IF NOT EXISTS idx_onboarding_project ON onboarding_submissions(project_id);
  `);

  console.log('✅ Database initialized successfully');
};

// ============================================
// HELPER: Converteer snake_case naar camelCase
// ============================================

const toCamelCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (typeof obj !== 'object') return obj;
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = toCamelCase(value);
  }
  return result;
};

const toSnakeCase = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
};

// ============================================
// PROJECT OPERATIES
// ============================================

const projects = {
  // Alle projecten ophalen
  getAll: () => {
    const rows = db.prepare(`
      SELECT * FROM projects ORDER BY created_at DESC
    `).all();
    
    return rows.map(row => {
      const project = toCamelCase(row);
      // Parse JSON velden
      if (project.intakeData) project.intakeData = JSON.parse(project.intakeData);
      if (project.phaseDeadlines) project.phaseDeadlines = JSON.parse(project.phaseDeadlines);
      // Voeg updates, messages en changeRequests toe
      project.updates = projectUpdates.getByProject(project.projectId);
      project.messages = messages.getByProject(project.projectId);
      project.changeRequests = changeRequests.getByProject(project.projectId);
      return project;
    });
  },

  // Project op ID ophalen
  getById: (projectId) => {
    const row = db.prepare(`
      SELECT * FROM projects WHERE project_id = ?
    `).get(projectId);
    
    if (!row) return null;
    
    const project = toCamelCase(row);
    if (project.intakeData) project.intakeData = JSON.parse(project.intakeData);
    if (project.phaseDeadlines) project.phaseDeadlines = JSON.parse(project.phaseDeadlines);
    project.updates = projectUpdates.getByProject(projectId);
    project.messages = messages.getByProject(projectId);
    project.changeRequests = changeRequests.getByProject(projectId);
    return project;
  },

  // Projecten op email ophalen
  getByEmail: (email) => {
    const rows = db.prepare(`
      SELECT * FROM projects WHERE contact_email = ? ORDER BY created_at DESC
    `).all(email);
    
    return rows.map(row => {
      const project = toCamelCase(row);
      if (project.intakeData) project.intakeData = JSON.parse(project.intakeData);
      if (project.phaseDeadlines) project.phaseDeadlines = JSON.parse(project.phaseDeadlines);
      project.updates = projectUpdates.getByProject(project.projectId);
      return project;
    });
  },

  // Projecten op status ophalen
  getByStatus: (status) => {
    const rows = db.prepare(`
      SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC
    `).all(status);
    return rows.map(toCamelCase);
  },

  // Project aanmaken
  create: (project) => {
    const stmt = db.prepare(`
      INSERT INTO projects (
        project_id, business_name, contact_name, contact_email, contact_phone,
        package, status, status_message, estimated_completion, revisions_used,
        revisions_total, google_drive_url, design_preview_url, live_url,
        intake_data, phase_deadlines, created_at
      ) VALUES (
        @projectId, @businessName, @contactName, @contactEmail, @contactPhone,
        @package, @status, @statusMessage, @estimatedCompletion, @revisionsUsed,
        @revisionsTotal, @googleDriveUrl, @designPreviewUrl, @liveUrl,
        @intakeData, @phaseDeadlines, @createdAt
      )
    `);
    
    const params = {
      projectId: project.projectId,
      businessName: project.businessName || '',
      contactName: project.contactName || null,
      contactEmail: project.contactEmail || null,
      contactPhone: project.contactPhone || null,
      package: project.package || 'starter',
      status: project.status || 'onboarding',
      statusMessage: project.statusMessage || '',
      estimatedCompletion: project.estimatedCompletion || null,
      revisionsUsed: project.revisionsUsed || 0,
      revisionsTotal: project.revisionsTotal || 2,
      googleDriveUrl: project.googleDriveUrl || null,
      designPreviewUrl: project.designPreviewUrl || null,
      liveUrl: project.liveUrl || null,
      intakeData: project.intakeData ? JSON.stringify(project.intakeData) : null,
      phaseDeadlines: project.phaseDeadlines ? JSON.stringify(project.phaseDeadlines) : null,
      createdAt: project.createdAt || new Date().toISOString()
    };
    
    const result = stmt.run(params);
    
    // Voeg updates toe als die er zijn
    if (project.updates && Array.isArray(project.updates)) {
      for (const update of project.updates) {
        projectUpdates.create(project.projectId, update);
      }
    }
    
    return result;
  },

  // Project updaten
  update: (projectId, updates) => {
    const current = projects.getById(projectId);
    if (!current) return null;
    
    const stmt = db.prepare(`
      UPDATE projects SET
        business_name = @businessName,
        contact_name = @contactName,
        contact_email = @contactEmail,
        contact_phone = @contactPhone,
        package = @package,
        status = @status,
        status_message = @statusMessage,
        estimated_completion = @estimatedCompletion,
        design_preview_url = @designPreviewUrl,
        live_url = @liveUrl,
        google_drive_url = @googleDriveUrl,
        revisions_used = @revisionsUsed,
        revisions_total = @revisionsTotal,
        phase_deadlines = @phaseDeadlines,
        intake_data = @intakeData,
        updated_at = CURRENT_TIMESTAMP
      WHERE project_id = @projectId
    `);
    
    const params = {
      projectId,
      businessName: updates.businessName ?? current.businessName,
      contactName: updates.contactName ?? current.contactName,
      contactEmail: updates.contactEmail ?? current.contactEmail,
      contactPhone: updates.contactPhone ?? current.contactPhone,
      package: updates.package ?? current.package,
      status: updates.status ?? current.status,
      statusMessage: updates.statusMessage ?? current.statusMessage,
      estimatedCompletion: updates.estimatedCompletion ?? current.estimatedCompletion,
      designPreviewUrl: updates.designPreviewUrl ?? current.designPreviewUrl,
      liveUrl: updates.liveUrl ?? current.liveUrl,
      googleDriveUrl: updates.googleDriveUrl ?? current.googleDriveUrl,
      revisionsUsed: updates.revisionsUsed ?? current.revisionsUsed,
      revisionsTotal: updates.revisionsTotal ?? current.revisionsTotal,
      phaseDeadlines: updates.phaseDeadlines ? JSON.stringify(updates.phaseDeadlines) : (current.phaseDeadlines ? JSON.stringify(current.phaseDeadlines) : null),
      intakeData: updates.intakeData ? JSON.stringify(updates.intakeData) : (current.intakeData ? JSON.stringify(current.intakeData) : null)
    };
    
    return stmt.run(params);
  },

  // Project verwijderen
  delete: (projectId) => {
    return db.prepare(`DELETE FROM projects WHERE project_id = ?`).run(projectId);
  },

  // Zoeken (naam, email, bedrijf)
  search: (query) => {
    const searchTerm = `%${query}%`;
    const rows = db.prepare(`
      SELECT * FROM projects 
      WHERE business_name LIKE ? OR contact_email LIKE ? OR contact_name LIKE ? OR project_id LIKE ?
      ORDER BY created_at DESC
    `).all(searchTerm, searchTerm, searchTerm, searchTerm);
    return rows.map(toCamelCase);
  }
};

// ============================================
// PROJECT UPDATES OPERATIES
// ============================================

const projectUpdates = {
  getByProject: (projectId) => {
    const rows = db.prepare(`
      SELECT * FROM project_updates WHERE project_id = ? ORDER BY created_at DESC
    `).all(projectId);
    return rows.map(row => ({
      id: row.id.toString(),
      date: row.created_at,
      title: row.title,
      message: row.message,
      phase: row.phase
    }));
  },

  create: (projectId, update) => {
    return db.prepare(`
      INSERT INTO project_updates (project_id, title, message, phase, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(projectId, update.title, update.message, update.phase || null, update.date || new Date().toISOString());
  },

  delete: (id) => {
    return db.prepare(`DELETE FROM project_updates WHERE id = ?`).run(id);
  }
};

// ============================================
// MESSAGES OPERATIES
// ============================================

const messages = {
  getByProject: (projectId) => {
    const rows = db.prepare(`
      SELECT * FROM messages WHERE project_id = ? ORDER BY created_at ASC
    `).all(projectId);
    return rows.map(row => ({
      id: row.id.toString(),
      date: row.created_at,
      from: row.from_type,
      from_type: row.from_type,
      message: row.message,
      read: Boolean(row.is_read),
      is_read: Boolean(row.is_read)
    }));
  },

  // Alias for API compatibility  
  getByProjectId: (projectId) => messages.getByProject(projectId),

  create: (projectId, msg) => {
    // Support both 'from' and 'from_type' field names
    const fromType = msg.from_type || msg.from || 'client';
    const result = db.prepare(`
      INSERT INTO messages (project_id, from_type, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(projectId, fromType, msg.message, msg.is_read || 0, msg.date || new Date().toISOString());
    
    return {
      id: result.lastInsertRowid.toString(),
      date: msg.date || new Date().toISOString(),
      from: fromType,
      from_type: fromType,
      message: msg.message,
      read: false,
      is_read: false
    };
  },

  markAsRead: (projectId, fromType) => {
    return db.prepare(`
      UPDATE messages SET is_read = 1 WHERE project_id = ? AND from_type = ?
    `).run(projectId, fromType);
  },

  getUnreadCount: (projectId, fromType) => {
    const row = db.prepare(`
      SELECT COUNT(*) as count FROM messages WHERE project_id = ? AND is_read = 0 AND from_type = ?
    `).get(projectId, fromType);
    return row?.count || 0;
  }
};

// ============================================
// CHANGE REQUESTS OPERATIES
// ============================================

const changeRequests = {
  getByProject: (projectId) => {
    const rows = db.prepare(`
      SELECT * FROM change_requests WHERE project_id = ? ORDER BY created_at DESC
    `).all(projectId);
    return rows.map(row => ({
      id: row.id.toString(),
      date: row.created_at,
      request: row.request,
      priority: row.priority,
      status: row.status,
      response: row.response,
      project_id: row.project_id
    }));
  },

  // Alias for API compatibility
  getByProjectId: (projectId) => changeRequests.getByProject(projectId),

  getById: (id) => {
    const row = db.prepare(`
      SELECT * FROM change_requests WHERE id = ?
    `).get(id);
    if (!row) return null;
    return {
      id: row.id.toString(),
      date: row.created_at,
      request: row.request,
      priority: row.priority,
      status: row.status,
      response: row.response,
      project_id: row.project_id
    };
  },

  create: (projectId, request) => {
    const result = db.prepare(`
      INSERT INTO change_requests (project_id, request, priority, created_at)
      VALUES (?, ?, ?, ?)
    `).run(projectId, request.request, request.priority || 'normal', new Date().toISOString());
    
    return {
      id: result.lastInsertRowid.toString(),
      date: new Date().toISOString(),
      request: request.request,
      priority: request.priority || 'normal',
      status: 'pending'
    };
  },

  update: (id, updates) => {
    return db.prepare(`
      UPDATE change_requests SET
        status = COALESCE(?, status),
        response = COALESCE(?, response),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updates.status || null, updates.response || null, id);
  },

  delete: (id) => {
    return db.prepare(`DELETE FROM change_requests WHERE id = ?`).run(id);
  }
};

// ============================================
// SUBMISSIONS OPERATIES (van /start flow)
// ============================================

const submissions = {
  getAll: () => {
    const rows = db.prepare(`
      SELECT * FROM submissions ORDER BY created_at DESC
    `).all();
    return rows.map(row => ({
      id: row.submission_id || row.id.toString(),
      timestamp: row.timestamp || row.created_at,
      package: row.package,
      websiteType: row.website_type,
      industry: row.industry,
      domain: row.domain,
      domainStatus: row.domain_status,
      businessName: row.business_name,
      tagline: row.tagline,
      description: row.description,
      primaryColor: row.primary_color,
      style: row.style,
      exampleSites: row.example_sites,
      pages: row.pages ? JSON.parse(row.pages) : [],
      content: row.content,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      remarks: row.remarks
    }));
  },

  getById: (id) => {
    const row = db.prepare(`
      SELECT * FROM submissions WHERE submission_id = ? OR id = ?
    `).get(id, id);
    if (!row) return null;
    return {
      id: row.submission_id || row.id.toString(),
      timestamp: row.timestamp || row.created_at,
      package: row.package,
      websiteType: row.website_type,
      industry: row.industry,
      domain: row.domain,
      domainStatus: row.domain_status,
      businessName: row.business_name,
      tagline: row.tagline,
      description: row.description,
      primaryColor: row.primary_color,
      style: row.style,
      exampleSites: row.example_sites,
      pages: row.pages ? JSON.parse(row.pages) : [],
      content: row.content,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      remarks: row.remarks
    };
  },

  create: (submission) => {
    const stmt = db.prepare(`
      INSERT INTO submissions (
        submission_id, timestamp, package, website_type, industry, domain, domain_status,
        business_name, tagline, description, primary_color, style, example_sites,
        pages, content, contact_name, contact_email, contact_phone, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      submission.id,
      submission.timestamp || new Date().toISOString(),
      submission.package,
      submission.websiteType,
      submission.industry,
      submission.domain,
      submission.domainStatus,
      submission.businessName,
      submission.tagline,
      submission.description,
      submission.primaryColor,
      submission.style,
      submission.exampleSites,
      JSON.stringify(submission.pages || []),
      submission.content,
      submission.contactName,
      submission.contactEmail,
      submission.contactPhone,
      submission.remarks
    );
  },

  update: (id, updates) => {
    const current = submissions.getById(id);
    if (!current) return null;
    
    const stmt = db.prepare(`
      UPDATE submissions SET
        package = ?, website_type = ?, industry = ?, domain = ?, domain_status = ?,
        business_name = ?, tagline = ?, description = ?, primary_color = ?, style = ?,
        example_sites = ?, pages = ?, content = ?, contact_name = ?, contact_email = ?,
        contact_phone = ?, remarks = ?
      WHERE submission_id = ? OR id = ?
    `);
    
    return stmt.run(
      updates.package ?? current.package,
      updates.websiteType ?? current.websiteType,
      updates.industry ?? current.industry,
      updates.domain ?? current.domain,
      updates.domainStatus ?? current.domainStatus,
      updates.businessName ?? current.businessName,
      updates.tagline ?? current.tagline,
      updates.description ?? current.description,
      updates.primaryColor ?? current.primaryColor,
      updates.style ?? current.style,
      updates.exampleSites ?? current.exampleSites,
      JSON.stringify(updates.pages ?? current.pages),
      updates.content ?? current.content,
      updates.contactName ?? current.contactName,
      updates.contactEmail ?? current.contactEmail,
      updates.contactPhone ?? current.contactPhone,
      updates.remarks ?? current.remarks,
      id, id
    );
  },

  delete: (id) => {
    return db.prepare(`DELETE FROM submissions WHERE submission_id = ? OR id = ?`).run(id, id);
  }
};

// ============================================
// ONBOARDING SUBMISSIONS OPERATIES
// ============================================

const onboardingSubmissions = {
  getAll: () => {
    const rows = db.prepare(`
      SELECT * FROM onboarding_submissions ORDER BY created_at DESC
    `).all();
    return rows.map(row => ({
      projectId: row.project_id,
      businessName: row.business_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      aboutText: row.about_text,
      services: row.services,
      uniqueSellingPoints: row.unique_selling_points,
      hasLogo: row.has_logo,
      logoDescription: row.logo_description,
      brandColors: row.brand_colors,
      brandFonts: row.brand_fonts,
      photos: row.photos,
      socialMedia: row.social_media,
      competitors: row.competitors,
      extraWishes: row.extra_wishes,
      submittedAt: row.submitted_at || row.created_at
    }));
  },

  getByProjectId: (projectId) => {
    const row = db.prepare(`
      SELECT * FROM onboarding_submissions WHERE project_id = ?
    `).get(projectId);
    if (!row) return null;
    return {
      projectId: row.project_id,
      businessName: row.business_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      aboutText: row.about_text,
      services: row.services,
      uniqueSellingPoints: row.unique_selling_points,
      hasLogo: row.has_logo,
      logoDescription: row.logo_description,
      brandColors: row.brand_colors,
      brandFonts: row.brand_fonts,
      photos: row.photos,
      socialMedia: row.social_media,
      competitors: row.competitors,
      extraWishes: row.extra_wishes,
      submittedAt: row.submitted_at || row.created_at
    };
  },

  create: (submission) => {
    const stmt = db.prepare(`
      INSERT INTO onboarding_submissions (
        project_id, business_name, contact_name, contact_email, contact_phone,
        about_text, services, unique_selling_points, has_logo, logo_description,
        brand_colors, brand_fonts, photos, social_media, competitors, extra_wishes,
        submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      submission.projectId,
      submission.businessName,
      submission.contactName,
      submission.contactEmail,
      submission.contactPhone,
      submission.aboutText,
      submission.services,
      submission.uniqueSellingPoints,
      submission.hasLogo,
      submission.logoDescription,
      submission.brandColors,
      submission.brandFonts,
      submission.photos,
      submission.socialMedia,
      submission.competitors,
      submission.extraWishes,
      submission.submittedAt || new Date().toISOString()
    );
  },

  delete: (projectId) => {
    return db.prepare(`DELETE FROM onboarding_submissions WHERE project_id = ?`).run(projectId);
  }
};

// ============================================
// SERVICE REQUESTS OPERATIES
// ============================================

const serviceRequests = {
  getAll: () => {
    const rows = db.prepare(`
      SELECT * FROM service_requests ORDER BY created_at DESC
    `).all();
    return rows.map(row => ({
      id: row.request_id || row.id.toString(),
      service: row.service,
      serviceName: row.service_name,
      price: row.price,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      remarks: row.remarks,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  },

  create: (request) => {
    const stmt = db.prepare(`
      INSERT INTO service_requests (
        request_id, service, service_name, price, name, email, phone, company, remarks, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      request.id,
      request.service,
      request.serviceName,
      request.price,
      request.name,
      request.email,
      request.phone,
      request.company,
      request.remarks,
      request.status || 'nieuw'
    );
  },

  updateStatus: (id, status) => {
    return db.prepare(`
      UPDATE service_requests SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE request_id = ? OR id = ?
    `).run(status, id, id);
  },

  delete: (id) => {
    return db.prepare(`DELETE FROM service_requests WHERE request_id = ? OR id = ?`).run(id, id);
  }
};

// ============================================
// MIGRATIE: JSON naar SQLite
// ============================================

const migrateFromJSON = () => {
  console.log('🔄 Starting migration from JSON to SQLite...');
  
  const dataDir = path.join(__dirname, 'data');
  
  // Migreer projects.json
  const projectsFile = path.join(dataDir, 'projects.json');
  if (fs.existsSync(projectsFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      const projectsArray = Array.isArray(data) ? data : [];
      console.log(`📦 Migrating ${projectsArray.length} projects...`);
      
      for (const project of projectsArray) {
        try {
          // Check of project al bestaat
          const existing = projects.getById(project.projectId);
          if (!existing) {
            projects.create(project);
            console.log(`  ✅ Project ${project.projectId} migrated`);
          } else {
            console.log(`  ⏭️  Project ${project.projectId} already exists`);
          }
        } catch (err) {
          console.log(`  ❌ Error migrating project ${project.projectId}:`, err.message);
        }
      }
    } catch (err) {
      console.log('❌ Error reading projects.json:', err.message);
    }
  }
  
  // Migreer submissions.json
  const submissionsFile = path.join(dataDir, 'submissions.json');
  if (fs.existsSync(submissionsFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
      const submissionsArray = Array.isArray(data) ? data : [];
      console.log(`📦 Migrating ${submissionsArray.length} submissions...`);
      
      for (const submission of submissionsArray) {
        try {
          const existing = submissions.getById(submission.id);
          if (!existing) {
            submissions.create(submission);
            console.log(`  ✅ Submission ${submission.id} migrated`);
          } else {
            console.log(`  ⏭️  Submission ${submission.id} already exists`);
          }
        } catch (err) {
          console.log(`  ❌ Error migrating submission ${submission.id}:`, err.message);
        }
      }
    } catch (err) {
      console.log('❌ Error reading submissions.json:', err.message);
    }
  }
  
  // Migreer onboarding.json
  const onboardingFile = path.join(dataDir, 'onboarding.json');
  if (fs.existsSync(onboardingFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(onboardingFile, 'utf8'));
      const onboardingArray = Array.isArray(data) ? data : [];
      console.log(`📦 Migrating ${onboardingArray.length} onboarding submissions...`);
      
      for (const onboarding of onboardingArray) {
        try {
          const existing = onboardingSubmissions.getByProjectId(onboarding.projectId);
          if (!existing) {
            onboardingSubmissions.create(onboarding);
            console.log(`  ✅ Onboarding ${onboarding.projectId} migrated`);
          } else {
            console.log(`  ⏭️  Onboarding ${onboarding.projectId} already exists`);
          }
        } catch (err) {
          console.log(`  ❌ Error migrating onboarding ${onboarding.projectId}:`, err.message);
        }
      }
    } catch (err) {
      console.log('❌ Error reading onboarding.json:', err.message);
    }
  }
  
  console.log('✅ Migration completed!');
};

// ============================================
// DATABASE STATISTIEKEN
// ============================================

const getStats = () => {
  return {
    projects: db.prepare('SELECT COUNT(*) as count FROM projects').get().count,
    submissions: db.prepare('SELECT COUNT(*) as count FROM submissions').get().count,
    onboarding: db.prepare('SELECT COUNT(*) as count FROM onboarding_submissions').get().count,
    messages: db.prepare('SELECT COUNT(*) as count FROM messages').get().count,
    changeRequests: db.prepare('SELECT COUNT(*) as count FROM change_requests').get().count,
    serviceRequests: db.prepare('SELECT COUNT(*) as count FROM service_requests').get().count,
    projectsByStatus: db.prepare(`
      SELECT status, COUNT(*) as count FROM projects GROUP BY status
    `).all()
  };
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  db,
  initDatabase,
  migrateFromJSON,
  getStats,
  projects,
  projectUpdates,
  messages,
  changeRequests,
  submissions,
  onboardingSubmissions,
  serviceRequests
};
