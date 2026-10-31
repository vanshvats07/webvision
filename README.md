# MAIT Connect 2.0

MAIT Connect is a student-built campus information and student-services prototype for Maharaja Agrasen Institute of Technology (MAIT). It uses React, TypeScript, Vite, Express, and a file-backed JSON data store.

> This is an independent prototype, not an official MAIT service. It is not connected to MAIT ERP, attendance, grades, sensors, or official grievance systems. Do not use real student personal data.

## Features

- Institutional pages for academics, departments, admissions, notices, events, placements, and campus life.
- Student Hub workflows for event registrations, bookmarks, complaints, Lost & Found reporting and claim review, opportunities, academic planning, attendance, queue reports, and campus-room search.
- Express APIs with role-based access, signed sessions, and audit logging.
- Admin content-management workflows.
- A MAIT AI assistant that grounds responses in approved document summaries, returns source links, and abstains when it cannot find relevant material.
- A searchable, keyboard-operated command palette.

## Requirements

- Node.js 20.19 or newer.
- npm.

## Setup

```sh
npm install --legacy-peer-deps
cp .env.example .env.local
```

Set `AUTH_TOKEN_SECRET` in `.env.local` to a unique random value of at least 32 bytes. Set `GEMINI_API_KEY` to enable generated answers from the AI assistant. Keep both values private; neither belongs in frontend code or Git.

## Development

```sh
npm run dev
```

The Express server and Vite development middleware use port `3000` by default. Override it with `PORT`.

## Checks and production

```sh
npm run lint
npm run build
npm test
```

For production, build the frontend and start the Express server with `NODE_ENV=production` and a configured `AUTH_TOKEN_SECRET`:

```sh
npm run build
npm start
```

The server serves the generated `dist` directory in production. Deployment has not been performed or verified.

## AI and retrieval

`POST /api/ai/chat` searches chunks made from approved `AiDocumentRecord` titles and summaries and sends the top lexical matches to Gemini. Answers are instructed to stay within retrieved evidence; source links and verification dates come from stored records, not model output. Unmatched questions abstain without calling Gemini. Requests are limited per client IP.

The current corpus contains short summaries, not the underlying official PDFs or full documents. Retrieval is lexical and summary-based; there are no embeddings, PostgreSQL full-text search, notice explainer, or authenticated student-record tools. Add and verify source documents before relying on answers. Gemini credentials are required for matched questions; without them the endpoint returns `503`.

## Data and authentication

The server stores data in `.data/mait_database.json`. This file-backed store is for local demonstration only: it is not transactional, does not support multi-instance deployments, and has no migration or managed backup system. Do not use real student personal data in this prototype.

Authentication tokens are HMAC-signed and expire after 12 hours. Production startup requires `AUTH_TOKEN_SECRET`; development generates a temporary process-only secret when omitted, so sessions expire on restart. Passwords use salted scrypt. Existing legacy hashes are verified and upgraded on a successful login. Self-service password recovery is disabled until a verified recovery provider exists.

## Deployment limitations

The server expects a persistent writable filesystem for `.data`, so deployment requires a Node host or container with a persistent volume. A stateless/serverless deployment is not compatible with this storage model without replacing the database and adapting the server entry point.

Before accepting any real user data, establish persistent storage and backups, account recovery, upload storage, operational monitoring, and an authorization review. This prototype does not include database migrations or a managed storage provider.

## Known limitations

- Lost & Found accepts an optional image URL; direct image uploads and managed storage are not configured.
- Gemini generation and citation quality have not been verified without an API credential.
- The AI corpus is limited to approved summaries seeded in the local database.
- Student Hub does not yet expose every server-backed utility as a complete student-facing workflow.
- No PostgreSQL/Supabase configuration, sitemap, or external upload integration is present.
- The production bundle currently exceeds Vite's 500 kB chunk warning threshold.

## Institutional content

Use official sources for public institutional information and retain source URLs, publication dates, academic years, and verification dates where applicable. Do not fill unverifiable gaps with invented information or access protected ERP portals, private student accounts, webmail, or restricted records. MAIT names, marks, photographs, and documents may be subject to ownership or usage restrictions; obtain permission before presenting this prototype as an official service.
