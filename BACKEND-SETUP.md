# 🚀 Webstability Backend Setup Guide

Dit document beschrijft hoe je de backend van Webstability configureert op Vercel.

---

## 📋 Stap 1: Vercel Project Setup

### 1.1 Vercel CLI installeren (optioneel)
```bash
npm install -g vercel
```

### 1.2 Inloggen bij Vercel
```bash
vercel login
```

### 1.3 Project deployen
```bash
cd webstability
vercel
```

---

## 🔑 Stap 2: Environment Variables Instellen

Ga naar je Vercel Dashboard:
1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecteer je project: **webstability**
3. Ga naar **Settings** → **Environment Variables**
4. Voeg deze variabelen toe:

### Mollie (Betalingen)
| Key | Value | Environment |
|-----|-------|-------------|
| `MOLLIE_API_KEY` | `live_yU9vUQMsANfcgJrSs59McdSMNPHfPP` | Production |

### Email (SMTP)
| Key | Value | Environment |
|-----|-------|-------------|
| `SMTP_HOST` | `smtp.hostinger.com` | All |
| `SMTP_PORT` | `465` | All |
| `SMTP_USER` | `info@webstability.nl` | All |
| `SMTP_PASS` | `N45eqtu2!jz8j0v` | All |

---

## 🗄️ Stap 3: Vercel KV Database

### 3.1 KV Database aanmaken
1. Ga naar [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecteer je project
3. Ga naar **Storage** tab
4. Klik **Create Database**
5. Kies **KV** (Redis-compatible)
6. Geef een naam: `webstability-db`
7. Klik **Create**

### 3.2 KV Connecteren
De environment variables worden automatisch toegevoegd:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

---

## 💳 Stap 4: Mollie Webhook Configureren

### 4.1 Webhook URL
Na deployment is je webhook URL:
```
https://webstability.nl/api/mollie-webhook
```

### 4.2 In Mollie Dashboard
1. Ga naar [mollie.com/dashboard](https://mollie.com/dashboard)
2. **Developers** → **Webhooks**
3. Voeg webhook toe met URL: `https://webstability.nl/api/mollie-webhook`

---

## ✅ Stap 5: Testen

### Test Email API
```bash
curl -X POST https://webstability.nl/api/marketing/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "Dit is een test email."
  }'
```

### Test Mollie API
```bash
curl -X POST https://webstability.nl/api/create-payment \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "TEST-123",
    "packageType": "starter",
    "customer": {
      "name": "Test Klant",
      "email": "test@example.com"
    },
    "redirectUrl": "https://webstability.nl/bedankt"
  }'
```

### Test Leads API
```bash
# Alle leads ophalen
curl https://webstability.nl/api/leads

# Nieuwe lead toevoegen
curl -X POST https://webstability.nl/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Bedrijf",
    "contactPerson": "Jan Test",
    "email": "jan@test.nl",
    "phone": "06-12345678",
    "city": "Amsterdam"
  }'
```

---

## 📁 API Endpoints Overzicht

| Endpoint | Method | Beschrijving |
|----------|--------|--------------|
| `/api/leads` | GET | Alle leads ophalen |
| `/api/leads` | POST | Nieuwe lead toevoegen |
| `/api/leads` | PUT | Lead updaten |
| `/api/leads?id=xxx` | DELETE | Lead verwijderen |
| `/api/projects` | GET | Alle projecten ophalen |
| `/api/projects?id=xxx` | GET | Specifiek project ophalen |
| `/api/projects` | POST | Nieuw project aanmaken |
| `/api/projects` | PUT | Project updaten |
| `/api/create-payment` | POST | Mollie betaling aanmaken |
| `/api/mollie-webhook` | POST | Mollie webhook handler |
| `/api/marketing/send-email` | POST | Marketing email versturen |

---

## 🔧 Troubleshooting

### Email werkt niet
1. Check SMTP credentials in Vercel env vars
2. Check Hostinger email instellingen
3. Kijk in Vercel logs: **Functions** → **Logs**

### Mollie betaling faalt
1. Check of API key correct is (live vs test)
2. Check webhook URL in Mollie dashboard
3. Test met Mollie test mode eerst

### Database errors
1. Check of Vercel KV is geconfigureerd
2. Check of project gekoppeld is aan KV store
3. Bekijk logs in Vercel dashboard

---

## 📞 Support

Vragen? Check de Vercel documentatie:
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Mollie API Docs](https://docs.mollie.com/)
