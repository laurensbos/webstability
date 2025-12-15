/**
 * Configuration Module voor Webstability Server
 * Centralized configuration vanuit environment variables
 */

require('dotenv').config();

const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  
  // Database
  database: {
    path: process.env.DATABASE_PATH || './data/webstability.db'
  },
  
  // Email/SMTP
  email: {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    user: process.env.SMTP_USER || 'info@webstability.nl',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'Webstability <info@webstability.nl>',
    admin: process.env.EMAIL_ADMIN || 'info@webstability.nl'
  },
  
  // Mollie
  mollie: {
    apiKey: process.env.MOLLIE_API_KEY || '',
    webhookUrl: process.env.MOLLIE_WEBHOOK_URL || ''
  },
  
  // URLs
  urls: {
    app: process.env.APP_URL || 'http://localhost:5173',
    api: process.env.API_URL || 'http://localhost:3001'
  },
  
  // Security
  security: {
    adminPassword: process.env.ADMIN_PASSWORD || 'webstability2024!',
    magicLinkSecret: process.env.MAGIC_LINK_SECRET || 'default-secret-change-in-production'
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    path: process.env.LOG_PATH || './logs'
  },
  
  /**
   * Check of we in productie draaien
   */
  isProduction() {
    return this.env === 'production';
  },
  
  /**
   * Check of we in development draaien
   */
  isDevelopment() {
    return this.env === 'development';
  },
  
  /**
   * Valideer configuratie voor productie
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];
    
    // Check kritieke waarden
    if (!this.email.pass || this.email.pass === 'your_smtp_password_here') {
      errors.push('SMTP_PASS is niet geconfigureerd');
    }
    
    if (!this.mollie.apiKey || this.mollie.apiKey === 'your_mollie_api_key_here') {
      errors.push('MOLLIE_API_KEY is niet geconfigureerd');
    }
    
    if (this.security.adminPassword === 'webstability2024!') {
      errors.push('ADMIN_PASSWORD heeft nog de default waarde');
    }
    
    if (this.security.magicLinkSecret === 'default-secret-change-in-production' ||
        this.security.magicLinkSecret.length < 32) {
      errors.push('MAGIC_LINK_SECRET is niet veilig geconfigureerd (min 32 karakters)');
    }
    
    // In productie moeten URLs kloppen
    if (this.isProduction()) {
      if (this.urls.app.includes('localhost')) {
        errors.push('APP_URL bevat localhost in productie');
      }
      if (this.urls.api.includes('localhost')) {
        errors.push('API_URL bevat localhost in productie');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Print configuratie (verbergt gevoelige data)
   */
  print() {
    const masked = (value) => value ? '***configured***' : '(not set)';
    
    return {
      env: this.env,
      port: this.port,
      database: this.database.path,
      email: {
        host: this.email.host,
        port: this.email.port,
        user: this.email.user,
        pass: masked(this.email.pass)
      },
      mollie: {
        apiKey: masked(this.mollie.apiKey)
      },
      urls: this.urls,
      security: {
        adminPassword: masked(this.security.adminPassword),
        magicLinkSecret: masked(this.security.magicLinkSecret)
      },
      logging: this.logging
    };
  }
};

module.exports = config;
