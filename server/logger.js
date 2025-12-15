/**
 * Logger Module voor Webstability Server
 * Centralized logging met levels, kleuren en file output
 */

const fs = require('fs');
const path = require('path');

// Log levels met prioriteit
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

// ANSI kleuren voor console
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

// Default configuratie
let config = {
  level: 'info',
  toFile: false,
  logPath: './logs'
};

/**
 * Initialiseer logger met configuratie
 */
function init(options = {}) {
  config = { ...config, ...options };
  
  // Maak logs directory als nodig
  if (config.toFile) {
    const logDir = path.resolve(config.logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }
}

/**
 * Format timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message
 */
function formatMessage(level, message, meta = null) {
  const timestamp = getTimestamp();
  let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (meta) {
    if (meta instanceof Error) {
      formatted += `\n  Stack: ${meta.stack}`;
    } else if (typeof meta === 'object') {
      formatted += `\n  ${JSON.stringify(meta, null, 2)}`;
    } else {
      formatted += ` ${meta}`;
    }
  }
  
  return formatted;
}

/**
 * Schrijf naar log file
 */
function writeToFile(level, message) {
  if (!config.toFile) return;
  
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.resolve(config.logPath, `${date}.log`);
  
  fs.appendFileSync(logFile, message + '\n', 'utf8');
  
  // Schrijf errors ook naar apart error.log
  if (level === 'error') {
    const errorFile = path.resolve(config.logPath, 'error.log');
    fs.appendFileSync(errorFile, message + '\n', 'utf8');
  }
}

/**
 * Log met specifiek level
 */
function log(level, message, meta = null) {
  // Check of level voldoet aan configuratie
  if (LOG_LEVELS[level] > LOG_LEVELS[config.level]) {
    return;
  }
  
  const formatted = formatMessage(level, message, meta);
  
  // Console output met kleuren
  let color;
  switch (level) {
    case 'error':
      color = COLORS.red;
      break;
    case 'warn':
      color = COLORS.yellow;
      break;
    case 'info':
      color = COLORS.green;
      break;
    case 'debug':
      color = COLORS.gray;
      break;
    default:
      color = COLORS.reset;
  }
  
  console.log(`${color}${formatted}${COLORS.reset}`);
  
  // Schrijf naar file
  writeToFile(level, formatted);
}

/**
 * Shorthand logging methods
 */
const logger = {
  init,
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
  
  /**
   * Express middleware voor request logging
   */
  requestLogger: () => {
    return (req, res, next) => {
      const start = Date.now();
      
      // Log na response
      res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method;
        const url = req.originalUrl;
        
        // Bepaal level op basis van status
        let level = 'info';
        if (status >= 400 && status < 500) level = 'warn';
        if (status >= 500) level = 'error';
        
        log(level, `${method} ${url} ${status} - ${duration}ms`);
      });
      
      next();
    };
  },
  
  /**
   * Express error handler middleware
   */
  errorHandler: () => {
    return (err, req, res, next) => {
      logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err);
      
      // Stuur generieke error in productie
      const isDev = process.env.NODE_ENV !== 'production';
      
      res.status(err.status || 500).json({
        success: false,
        error: isDev ? err.message : 'Er is een serverfout opgetreden',
        ...(isDev && { stack: err.stack })
      });
    };
  },
  
  /**
   * Log startup info
   */
  startup: (name, version, port) => {
    console.log(`
${COLORS.bold}${COLORS.blue}╔════════════════════════════════════════════╗
║                                            ║
║   🚀 ${name} Server v${version}           ║
║                                            ║
║   Running on port ${port}                   ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║                                            ║
╚════════════════════════════════════════════╝${COLORS.reset}
    `);
  }
};

module.exports = logger;
