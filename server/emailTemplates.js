/**
 * Email Templates voor Webstability
 * Consistente, professionele email templates
 */

// Brand kleuren
const COLORS = {
  primary: '#3b82f6',
  primaryDark: '#1d4ed8',
  primaryLight: '#60a5fa',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

// Logo als inline SVG (geen externe URL nodig)
const LOGO_SVG = `
<svg width="48" height="48" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" rx="80" fill="#1456a3"/>
  <text x="250" y="330" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="220" fill="white" text-anchor="middle">web.</text>
</svg>
`;

/**
 * Basis email wrapper met header en footer
 */
function emailWrapper(content, options = {}) {
  const { preheader = '' } = options;
  
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Webstability</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .button { padding: 14px 28px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.gray[100]}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  
  <!-- Main container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.gray[100]};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email content card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    ${LOGO_SVG}
                  </td>
                  <td style="text-align: right;">
                    <span style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">webstability.nl</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: ${COLORS.gray[50]}; border-top: 1px solid ${COLORS.gray[200]};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: ${COLORS.gray[600]};">
                      Met vriendelijke groet,<br>
                      <strong style="color: ${COLORS.gray[800]};">Team Webstability</strong>
                    </p>
                    <p style="margin: 0; font-size: 12px; color: ${COLORS.gray[500]};">
                      <a href="mailto:info@webstability.nl" style="color: ${COLORS.primary}; text-decoration: none;">info@webstability.nl</a>
                      &nbsp;•&nbsp;
                      <a href="https://webstability.nl" style="color: ${COLORS.primary}; text-decoration: none;">webstability.nl</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Footer text -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <tr>
            <td style="padding: 24px 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: ${COLORS.gray[500]};">
                © ${new Date().getFullYear()} Webstability. Alle rechten voorbehouden.
              </p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Primary button component
 */
function primaryButton(text, url) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td style="border-radius: 12px; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 12px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;
}

/**
 * Secondary button component
 */
function secondaryButton(text, url) {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
  <tr>
    <td style="border-radius: 12px; border: 2px solid ${COLORS.gray[200]};">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: ${COLORS.gray[700]}; text-decoration: none; border-radius: 12px;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`;
}

/**
 * Info box component
 */
function infoBox(content, type = 'info') {
  const colors = {
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  };
  const c = colors[type] || colors.info;
  
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td style="padding: 16px 20px; background-color: ${c.bg}; border-left: 4px solid ${c.border}; border-radius: 8px;">
      <p style="margin: 0; font-size: 14px; color: ${c.text}; line-height: 1.6;">
        ${content}
      </p>
    </td>
  </tr>
</table>
`;
}

/**
 * Progress bar component
 */
function progressBar(phases, currentPhase) {
  const phaseList = ['onboarding', 'design', 'development', 'review', 'live'];
  const currentIndex = phaseList.indexOf(currentPhase);
  
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
  <tr>
    <td style="padding: 20px; background-color: ${COLORS.gray[50]}; border-radius: 12px;">
      <p style="margin: 0 0 12px 0; font-size: 12px; color: ${COLORS.gray[500]}; text-transform: uppercase; letter-spacing: 0.5px;">Voortgang</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${phaseList.map((phase, i) => `
            <td width="20%" style="padding: 2px;">
              <div style="height: 8px; border-radius: 4px; background-color: ${i <= currentIndex ? COLORS.primary : COLORS.gray[200]};"></div>
            </td>
          `).join('')}
        </tr>
      </table>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: ${COLORS.gray[500]}; text-align: right;">
        ${phases[currentPhase]?.label || currentPhase}
      </p>
    </td>
  </tr>
</table>
`;
}

/**
 * Divider component
 */
function divider() {
  return `<hr style="margin: 24px 0; border: none; border-top: 1px solid ${COLORS.gray[200]};">`;
}

// ===========================================
// EMAIL TEMPLATES
// ===========================================

const templates = {
  /**
   * Welkom email na project aanvraag
   */
  projectWelcome: (data) => {
    const { projectId, businessName, contactName, package: pkg, magicLink } = data;
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        Welkom bij Webstability! 🎉
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Hoi ${contactName || 'daar'},
      </p>
      <p style="margin: 0 0 16px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Super dat je hebt gekozen voor Webstability! We gaan aan de slag met jouw professionele website voor <strong style="color: ${COLORS.gray[900]};">${businessName}</strong>.
      </p>
      
      ${infoBox(`
        <strong>Je project ID:</strong> ${projectId}<br>
        <strong>Pakket:</strong> ${pkg || 'Professional'}
      `, 'info')}
      
      <h2 style="margin: 32px 0 16px 0; font-size: 20px; font-weight: 600; color: ${COLORS.gray[900]};">
        Wat is de volgende stap?
      </h2>
      <p style="margin: 0 0 16px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Vul de onboarding in zodat we alle informatie hebben om te starten. Dit duurt ongeveer 5 minuten.
      </p>
      
      ${primaryButton('Start onboarding →', magicLink || `https://webstability.nl/project/${projectId}`)}
      
      ${divider()}
      
      <p style="margin: 0; font-size: 14px; color: ${COLORS.gray[500]};">
        Vragen? Reageer gewoon op deze email of stuur een WhatsApp naar 06-12345678.
      </p>
    `;
    
    return emailWrapper(content, { preheader: `Welkom! Je project ${projectId} is aangemaakt.` });
  },

  /**
   * Fase update email
   */
  phaseUpdate: (data) => {
    const { projectId, businessName, contactName, oldPhase, newPhase, magicLink } = data;
    
    const phaseConfig = {
      onboarding: { label: 'Onboarding', emoji: '📋', message: 'We verzamelen je materialen' },
      design: { label: 'Design', emoji: '🎨', message: 'We zijn begonnen met het ontwerp!' },
      development: { label: 'Development', emoji: '💻', message: 'We bouwen nu je website!' },
      review: { label: 'Review', emoji: '👀', message: 'Je website is klaar voor review!' },
      live: { label: 'Live', emoji: '🚀', message: 'Gefeliciteerd! Je website is live!' },
    };
    
    const phase = phaseConfig[newPhase] || { label: newPhase, emoji: '📌', message: '' };
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        ${phase.emoji} ${phase.label} fase gestart!
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Hoi ${contactName || 'daar'},
      </p>
      <p style="margin: 0 0 16px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Er is nieuws over je project <strong style="color: ${COLORS.gray[900]};">${businessName}</strong>!
      </p>
      
      ${infoBox(phase.message, 'success')}
      
      ${progressBar(phaseConfig, newPhase)}
      
      <p style="margin: 24px 0 16px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Bekijk de volledige status en updates op je persoonlijke projectpagina:
      </p>
      
      ${primaryButton('Bekijk project status →', magicLink || `https://webstability.nl/project/${projectId}`)}
      
      ${divider()}
      
      <p style="margin: 0; font-size: 14px; color: ${COLORS.gray[500]};">
        Project ID: ${projectId}
      </p>
    `;
    
    return emailWrapper(content, { preheader: `${phase.emoji} Je project is nu in de ${phase.label} fase` });
  },

  /**
   * Nieuwe bericht notificatie
   */
  newMessage: (data) => {
    const { projectId, businessName, contactName, message, magicLink } = data;
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        💬 Nieuw bericht
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Hoi ${contactName || 'daar'},
      </p>
      <p style="margin: 0 0 16px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Je hebt een nieuw bericht ontvangen over je project <strong style="color: ${COLORS.gray[900]};">${businessName}</strong>:
      </p>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
        <tr>
          <td style="padding: 20px; background-color: ${COLORS.gray[50]}; border-radius: 12px; border-left: 4px solid ${COLORS.primary};">
            <p style="margin: 0; font-size: 16px; color: ${COLORS.gray[700]}; line-height: 1.6; font-style: italic;">
              "${message}"
            </p>
          </td>
        </tr>
      </table>
      
      ${primaryButton('Bekijk & reageer →', magicLink || `https://webstability.nl/project/${projectId}`)}
    `;
    
    return emailWrapper(content, { preheader: `Nieuw bericht over ${businessName}` });
  },

  /**
   * Project herstel email (magic link)
   */
  projectRecovery: (data) => {
    const { projects, email } = data;
    
    const projectList = projects.map(p => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: ${COLORS.gray[900]};">${p.businessName}</p>
                <p style="margin: 0; font-size: 14px; color: ${COLORS.gray[500]};">Project ID: ${p.projectId}</p>
              </td>
              <td style="text-align: right;">
                <a href="https://webstability.nl/project/${p.projectId}" style="display: inline-block; padding: 8px 16px; background-color: ${COLORS.primary}; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
                  Bekijk →
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        🔑 Je projecten
      </h1>
      <p style="margin: 0 0 24px 0; font-size: 16px; color: ${COLORS.gray[600]}; line-height: 1.6;">
        Je hebt gevraagd om toegang tot je projecten. Hieronder vind je een overzicht:
      </p>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid ${COLORS.gray[200]}; border-radius: 12px; overflow: hidden;">
        ${projectList}
      </table>
      
      ${infoBox('Deze links zijn 24 uur geldig. Voor veiligheidsredenen kun je later opnieuw een link aanvragen.', 'info')}
      
      <p style="margin: 24px 0 0 0; font-size: 14px; color: ${COLORS.gray[500]};">
        Heb je dit niet aangevraagd? Dan kun je deze email negeren.
      </p>
    `;
    
    return emailWrapper(content, { preheader: 'Je gevraagde projectlinks' });
  },

  /**
   * Admin notificatie - nieuw project
   */
  adminNewProject: (data) => {
    const { projectId, businessName, contactName, contactEmail, contactPhone, package: pkg } = data;
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        🎉 Nieuw project aangevraagd!
      </h1>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid ${COLORS.gray[200]}; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="padding: 16px; background-color: ${COLORS.gray[50]}; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Bedrijf</strong><br>
            <span style="color: ${COLORS.gray[900]}; font-size: 18px; font-weight: 600;">${businessName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Contact</strong><br>
            <span style="color: ${COLORS.gray[900]};">${contactName || '-'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Email</strong><br>
            <a href="mailto:${contactEmail}" style="color: ${COLORS.primary};">${contactEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Telefoon</strong><br>
            <span style="color: ${COLORS.gray[900]};">${contactPhone || '-'}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px;">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Pakket</strong><br>
            <span style="color: ${COLORS.gray[900]};">${pkg || 'Professional'}</span>
          </td>
        </tr>
      </table>
      
      ${primaryButton('Open in Dashboard →', `https://webstability.nl/dashboard?project=${projectId}`)}
      
      <p style="margin: 24px 0 0 0; font-size: 14px; color: ${COLORS.gray[500]};">
        Project ID: ${projectId}
      </p>
    `;
    
    return emailWrapper(content, { preheader: `Nieuw project: ${businessName}` });
  },

  /**
   * Contact formulier email
   */
  contactForm: (data) => {
    const { name, email, phone, message, subject } = data;
    
    const content = `
      <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: ${COLORS.gray[900]};">
        📬 Nieuw contactformulier
      </h1>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0; border: 1px solid ${COLORS.gray[200]}; border-radius: 12px; overflow: hidden;">
        <tr>
          <td style="padding: 16px; background-color: ${COLORS.gray[50]}; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Van</strong><br>
            <span style="color: ${COLORS.gray[900]}; font-weight: 600;">${name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Email</strong><br>
            <a href="mailto:${email}" style="color: ${COLORS.primary};">${email}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Telefoon</strong><br>
            <span style="color: ${COLORS.gray[900]};">${phone}</span>
          </td>
        </tr>
        ` : ''}
        ${subject ? `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid ${COLORS.gray[200]};">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Onderwerp</strong><br>
            <span style="color: ${COLORS.gray[900]};">${subject}</span>
          </td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 16px;">
            <strong style="color: ${COLORS.gray[500]}; font-size: 12px; text-transform: uppercase;">Bericht</strong><br>
            <p style="margin: 8px 0 0 0; color: ${COLORS.gray[700]}; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </td>
        </tr>
      </table>
      
      ${primaryButton(`Beantwoord via email →`, `mailto:${email}?subject=Re: ${subject || 'Je vraag aan Webstability'}`)}
    `;
    
    return emailWrapper(content, { preheader: `Nieuw bericht van ${name}` });
  },
};

// Contact bevestiging naar klant
const contactConfirmation = {
  subject: (name) => `✅ Bedankt voor je bericht, ${name}!`,
  html: ({ name }) => {
    const content = `
      <h1 style="margin: 0 0 24px 0; font-size: 28px; color: ${COLORS.gray[900]};">
        📬 Bericht Ontvangen!
      </h1>
      
      <p style="font-size: 18px; color: ${COLORS.gray[800]}; margin-bottom: 20px;">
        Hoi ${name}! 👋
      </p>
      
      <p style="color: ${COLORS.gray[600]}; line-height: 1.6;">
        Bedankt voor je bericht! We hebben het ontvangen en nemen binnen <strong>24 uur</strong> contact met je op.
      </p>
      
      ${infoBox('🚀 Wist je dat...', 'De meeste van onze klanten binnen 7 dagen een professionele website hebben? We kijken ernaar uit om ook jou te helpen!', 'info')}
      
      ${divider()}
      
      <p style="color: ${COLORS.gray[500]}; font-size: 14px;">
        Kan je niet wachten? Stuur ons een WhatsApp op <strong>06-44712573</strong>
      </p>
    `;
    
    return emailWrapper(content, { preheader: 'We nemen binnen 24 uur contact met je op' });
  },
};

module.exports = {
  // Main templates
  projectWelcome: templates.projectWelcome,
  phaseUpdate: templates.phaseUpdate,
  newMessage: templates.newMessage,
  projectRecovery: templates.projectRecovery,
  adminNewProject: templates.adminNewProject,
  contactForm: templates.contactForm,
  contactConfirmation,
  // Phase-specific templates
  phaseUpdate: {
    subject: (phase) => {
      const subjects = {
        onboarding: '📋 Je onboarding is klaar om te starten!',
        design: '🎨 We zijn begonnen met je ontwerp!',
        development: '💻 Je website wordt nu gebouwd!',
        review: '👀 Je website is klaar voor review!',
        live: '🚀 Gefeliciteerd! Je website is live!',
      };
      return subjects[phase] || `📌 Update over je project`;
    },
    html: (data) => templates.phaseUpdate(data),
  },
  // Helper functions
  emailWrapper,
  primaryButton,
  secondaryButton,
  infoBox,
  progressBar,
  divider,
  COLORS,
};
