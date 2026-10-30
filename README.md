# MAIT Connect 2.0

<<<<<<< HEAD
MAIT Connect is a light-theme campus information and student-services prototype built with React, TypeScript, Vite, Express, and a file-backed JSON data store. The existing cinematic homepage, original campus photographs, and 3D campus experience remain intact.

## Current Features

- Institutional pages for academics, departments, admissions, notices, events, placements, and campus life.
- Express APIs for authentication, notices, events, complaints, lost and found, notes, opportunities, queue reports, academic planning, campus rooms, and administrative content.
- Student Hub workflows for event registrations, bookmarks, complaints, and Lost & Found reporting, search, matching, proof-backed claims, status tracking, and reporter/admin claim decisions.
- MAIT AI Assistant using approved AI-document summaries as retrieval context, server-side Gemini generation, source links, and abstention when no relevant source is found.
- Searchable keyboard-operated campus and notice command palette.

This is a student-built prototype, not an official MAIT service. It is not connected to MAIT ERP, attendance, grades, sensors, or official grievance systems.

## Requirements and Setup

Use Node.js 20.19 or newer. The repository currently has a Vite 8 / esbuild peer-version mismatch; until its lockfile is regenerated with the chosen package manager, install with:

```sh
npm install --legacy-peer-deps
cp .env.example .env.local
```

Edit `.env.local` and set `GEMINI_API_KEY` to enable generated answers. `AUTH_TOKEN_SECRET` should be set locally for stable signed sessions. Keep both values private; neither belongs in frontend code.

Run the app and checks:

```sh
npm run dev
=======
> **A smarter digital campus experience for Maharaja Agrasen Institute of Technology.**
>
> An immersive, light-themed college website concept that brings institutional information and useful student services into one place.

[Official MAIT Website](https://mait.ac.in/)

---

## About the Project

**MAIT Connect 2.0** is a student-focused redesign concept for the digital experience of Maharaja Agrasen Institute of Technology (MAIT). The goal is to move beyond a conventional college website and create a modern, accessible and useful digital campus platform.

The project combines:

- A cinematic, scroll-driven homepage inspired by MAIT's campus architecture.
- Official college information, notices, events, academic resources and placement information.
- Student utilities such as Lost & Found, complaint tracking, notes and opportunity discovery.
- An administrative content-management experience.
- A Gemini-powered assistant that answers questions using verified MAIT information.

**Project status:** Planned / under phased development. Features should be marked as complete only after implementation and testing.

**Important:** This is an independent redesign/prototype concept. It is not an official MAIT service and is not affiliated with or endorsed by MAIT unless formal authorization is obtained. Do not use it to collect real student records or accept official applications without institutional approval.

## Design Direction

The visual identity is based on a bright, premium architectural style—not a dark or black theme.

| Token | Color | Usage |
|---|---|---|
| Warm Ivory | `#F7F5EF` | Main page background |
| White | `#FFFFFF` | Content surfaces |
| Brick Red | `#873A2B` | Primary accent |
| Campus Green | `#16745B` | Secondary accent |
| Muted Gold | `#B18B50` | Small highlights |
| Deep Navy | `#203044` | Primary text |
| Slate Gray | `#657080` | Secondary text |

Design principles:

- Bright, spacious and readable layouts.
- Architectural storytelling and editorial typography.
- Smooth, purposeful scroll animations and subtle 3D depth.
- Responsive layouts for desktop, tablet and mobile.
- Accessible controls, keyboard navigation and reduced-motion support.
- Avoid unnecessary visual effects, heavy WebGL scenes and generic dashboard templates.

## Homepage Photography

The homepage must use the **two original MAIT campus photographs supplied for this project**:

| Asset | Intended use |
|---|---|
| `mait-main-gate.jpeg` | Main homepage hero featuring the campus entrance and fountain |
| `mait-aerial-campus.jpeg` | Later homepage storytelling section featuring the aerial campus view |

Place these files in the project's public assets directory, for example:

```text
public/
  images/
    mait-main-gate.jpeg
    mait-aerial-campus.jpeg
```

Image requirements:

- Use the supplied files themselves; do not substitute AI-generated or stock campus photos.
- Keep both supplied photographs on the homepage only.
- Preserve their aspect ratios and crop carefully without distorting the buildings.
- The aerial image is a small panoramic image; avoid enlarging it beyond a sensible display size.
- Use other campus images on internal pages only when they come from verified official MAIT sources and their use is permitted. Otherwise use typography, CSS, diagrams or icons.

## Planned Features

### 1. Institutional Website

- About MAIT: overview, history, vision, mission and leadership.
- Department directory and department detail pages.
- Academic programs and resources.
- Admissions information and official links.
- Campus facilities, societies and student life.
- Alumni, research and achievements where official information is available.

### 2. Smart Notice Board

- Search by title and keywords.
- Filter by category, department and academic year where available.
- Sort by publication date.
- Highlight important notices.
- View and download original PDFs.
- Link each record to its official source.
- Optional authenticated bookmarks and notifications.

### 3. Events at MAIT

- Upcoming and past event listings.
- Event details, dates, venues and organizers when published officially.
- Search, category filters and calendar view.
- Official posters and registration links where available.
- Student registration workflows only for events approved to use this platform.

### 4. Placement Insights

- Batch-wise placement reports.
- Recruiter directory and company information.
- Historical placement trends.
- Department-level information where officially published.
- Source-linked statistics and original reports.

Every statistic must show its batch/reporting period and source. Do not mix batches or present historical figures as current results.

### 5. Academic and Campus Resources

- Department and faculty information where officially published.
- Academic calendar, syllabus and course resources.
- Examination and scholarship resources.
- Campus facilities and societies.
- Official PDF and document links.

### 6. Student Hub

- Student dashboard and saved resources.
- Lost & Found with claim verification.
- Campus issue/complaint tracker.
- Notes and previous-year-paper sharing with moderation.
- Internship, hackathon and scholarship opportunity discovery.
- Academic planner and personal reminders.
- Student-reported campus queue information.
- Campus and classroom finder where verified location data exists.

Student-generated content must be moderated. Personal information must not be publicly exposed.

### 7. Admin and Content Management

- Role-based access for authorized administrators and content editors.
- Create, edit, publish and unpublish content.
- Upload and manage approved documents.
- Track source URLs and verification dates.
- Maintain audit history for important changes.

A demo admin account must never be represented as an official MAIT administrator.

### 8. MAIT AI Assistant

A Gemini-powered assistant is planned to answer questions using a verified MAIT knowledge base.

Potential capabilities:

- Search official notices, academic resources, events and department information.
- Explain an official notice in simpler language.
- Answer in English, Hindi and Hinglish.
- Cite the original source and link to the relevant page or document.
- Say when information cannot be verified.

The assistant should use retrieval-augmented generation (RAG). It must not invent exam dates, policies, faculty details or placement statistics, and must not reveal private student information.

## Development Roadmap

The application is intended to be developed incrementally. Complete and test each phase before moving to the next.

| Phase | Scope | Status |
|---|---|---|
| 0 | Project instructions, foundation and design system | Planned / verify in repository |
| 1 | Cinematic 3D homepage using supplied MAIT photos | Planned / verify in repository |
| 2 | Research and structure verified official MAIT content | Planned |
| 3 | Notices, events and placement portal | Planned |
| 4 | Academics, departments, admissions and campus life | Planned |
| 5 | Backend, database, authentication and admin CMS | Planned |
| 6 | Student Hub and student utility workflows | Planned |
| 7 | Gemini AI Assistant with RAG and citations | Planned |
| 8 | QA, accessibility, performance, security and deployment | Planned |
| 9 | Optional future enhancements (PWA, push notifications, voice search, campus map) | Future |

Update this table as features are actually implemented and tested.

## Suggested Technology

Choose technologies based on the existing Google AI Studio-generated project. Do not replace a working scaffold without a clear reason.

| Area | Suggested technology |
|---|---|
| Frontend | React / Next.js with TypeScript |
| Styling | Tailwind CSS |
| UI components | Reusable components; optionally shadcn/ui |
| 3D | Three.js / React Three Fiber, used selectively |
| Scroll animation | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis, if compatible and accessible |
| Icons | Lucide |
| Backend | Existing compatible backend; otherwise a suitable server-side API |
| Database / Auth / Storage | Supabase (PostgreSQL, Auth and Storage), if selected for the project |
| AI | Gemini API through a secure server-side integration |
| Hosting | Vercel or the project's compatible hosting provider |

This is a suggested stack, not a claim that all services are already configured.

## Getting Started

### 1. Get the project

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env.local` file in the project root. Add only the variables required by the services that have actually been configured.

Example placeholders:

```env
# Gemini — server-side only
GEMINI_API_KEY=

# Supabase — only if Supabase is configured
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Security:** Never commit `.env.local`, API keys, database passwords or service-role keys. The Supabase service-role key and Gemini API key must only be used in trusted server-side code. Do not expose them through client-side components or public environment variables.

### 4. Add the homepage photographs

Put the original supplied image files in:

```text
public/images/mait-main-gate.jpeg
public/images/mait-aerial-campus.jpeg
```

Confirm that the homepage imports these exact local assets.

### 5. Run the development server

Use the command defined by the repository's `package.json`. For a standard Next.js project, this is commonly:

```bash
npm run dev
```

Then open the local URL printed in the terminal (commonly `http://localhost:3000`).

### 6. Run checks

Use the scripts available in `package.json`. Common checks include:

```bash
>>>>>>> b703f5d901cddd0892d405c21e4bb3dd27eb8401
npm run lint
npm run build
```

<<<<<<< HEAD
The Express server and Vite development middleware use port `3000` by default. Override it with `PORT`.

## AI and Retrieval

`POST /api/ai/chat` normalizes a question into tokens, searches chunks made from approved `AiDocumentRecord` titles and summaries, and sends only the top lexical matches to Gemini. Answers are instructed to stay within the retrieved evidence; source links and verification dates come from the stored records, not model output. Unmatched questions abstain without calling Gemini. Requests are limited per client IP.

The current corpus contains short summaries, not the underlying official PDFs or full documents. Retrieval is lexical and summary-based; there are no embeddings, pgvector, PostgreSQL full-text search, notice explainer, or authenticated student-record tools. Add and verify source documents before relying on answers. Gemini credentials are required for matched questions; without them the endpoint returns `503`.

## Data and Authentication

The server stores data in `.data/mait_database.json`. This file-backed store is suitable for local demonstration only: it is not transactional, does not support multi-instance deployments, and has no migration or managed backup system. Do not use real student personal data in this prototype.

Bearer tokens are HMAC-signed and expire after 12 hours. Production startup requires `AUTH_TOKEN_SECRET`; development generates a temporary process-only secret when omitted, so sessions expire on restart. Passwords use salted scrypt. Existing legacy hashes are verified and upgraded on a successful login. Self-service password recovery is disabled until a verified recovery provider exists.

## Deployment Preparation

Deployment has not been performed or verified. The current server expects a persistent writable filesystem for `.data`, so use a Node host or container with a persistent volume. A stateless/serverless deployment such as default Vercel Functions is not compatible with this storage model without replacing the database and adapting the server entry point.

For a persistent Node deployment:

1. Install dependencies using the setup command above and build with `npm run build`.
2. Set `NODE_ENV=production`, `PORT`, `AUTH_TOKEN_SECRET`, and `GEMINI_API_KEY` in the hosting provider's secret/environment settings.
3. Mount persistent storage for `.data`, restrict filesystem access, and establish backups before accepting data.
4. Start with `npm run start` and verify `/api/health`, authentication, and the AI endpoint in the deployed environment.

The prototype has no database migration scripts or storage-provider setup. Do not expose it to production student records until those controls, account recovery, upload storage, operational monitoring, and an authorization review are in place.

## Known Limitations

- Lost & Found accepts an optional HTTPS image URL; direct image uploads and managed storage are not configured.
- Gemini, Hindi/Hinglish generation, and citation quality have not been verified without an API credential.
- The AI corpus is limited to the approved summaries currently seeded in the local database.
- Student Hub does not yet expose every server-backed utility as a complete student-facing workflow.
- No automated test suite, deployment, PostgreSQL/Supabase configuration, sitemap, or external upload integration is present.
- The production bundle currently exceeds Vite's 500 kB chunk warning threshold.
=======
Not every scaffold includes both scripts. Check `package.json` before running them and add appropriate checks as the project matures.

## Official Data and Source Integrity

Primary reference:

- [MAIT official website](https://mait.ac.in/)

Content collection should prioritize:

- Official MAIT pages and subdomains.
- Official department websites linked from MAIT.
- Original official PDFs and institutional documents.

For each public information record, retain where applicable:

- Original source URL.
- Publication date.
- Academic year or placement batch.
- Department/category.
- Last verified date.
- Verification status.

If a page cannot be accessed or a fact cannot be verified, label it unavailable or unverified. Do not fill gaps with fabricated content. Do not scrape protected ERP portals, private student accounts, webmail or restricted records.

## Privacy, Security and Responsible Use

- Do not collect real student data until the project has appropriate authorization, privacy notices and security controls.
- Use clearly labelled demo data during prototyping.
- Apply server-side authorization and least-privilege database policies.
- Validate and restrict uploaded files.
- Protect private Lost & Found claims and complaint information.
- Do not publicly reveal phone numbers, email addresses or other personal details submitted by users.
- Moderate user-generated notes, reports and listings.
- Do not imply that student-built complaint or service workflows are official MAIT channels without approval.
- Do not claim live ERP, attendance, room occupancy, transport GPS or sensor integration unless a real authorized integration exists.

## Quality Checklist

Before marking a phase complete, verify:

- [ ] Existing features remain functional.
- [ ] The site uses the approved light theme.
- [ ] The homepage uses the two supplied original photographs.
- [ ] The supplied photographs are not reused on internal pages.
- [ ] Navigation and buttons work.
- [ ] Search and filters return correct results.
- [ ] Official information links to its source.
- [ ] Sample/demo data is clearly labelled.
- [ ] Forms have validation and useful error states.
- [ ] Mobile, tablet and desktop layouts are checked.
- [ ] Keyboard navigation and reduced-motion preferences are supported.
- [ ] No secrets are exposed in client-side code.
- [ ] Build and available tests pass.

## Contributing / Development Workflow

1. Work on one roadmap phase at a time.
2. Inspect the current project before editing.
3. Preserve approved pages and components.
4. Reuse the existing design system and data models.
5. Test the changes before starting another phase.
6. Keep the roadmap status accurate.
7. Document new environment variables and setup steps.

For larger changes, create a separate Git branch and commit after each successfully tested phase.

## License and Institutional Identity

This repository is an independent redesign/prototype concept. MAIT names, marks, logos, photographs, documents and other institutional materials may be subject to ownership, trademark, copyright or usage restrictions. Use official assets only where permitted and provide attribution or source links as required. Obtain permission before presenting the platform as an official institutional website or service.

---

**MAIT Connect 2.0 — One Campus. One Connected Experience.**
>>>>>>> b703f5d901cddd0892d405c21e4bb3dd27eb8401
