# Cloud Quest – Microsoft Azure Workshop
## Complete Project Documentation: Design to Deployment

> **Project:** Cloud Quest – Microsoft Azure Workshop Event Website  
> **Author:** Ms. Suchitra Nayak, Technical Project Manager – Microsoft Engagement, Tech Mahindra  
> **Date:** March 2026  
> **Repository:** [github.com/suchigithub/CloudQuestWorkshop](https://github.com/suchigithub/CloudQuestWorkshop)  
> **Live URL:** [cloudquest-demo.azurewebsites.net](https://cloudquest-demo.azurewebsites.net)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Design](#2-architecture-design)
3. [UI/UX Design](#3-uiux-design)
4. [Implementation](#4-implementation)
5. [Testing](#5-testing)
6. [Security](#6-security)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Deployment](#8-deployment)
9. [Monitoring & Observability](#9-monitoring--observability)
10. [Repository Structure](#10-repository-structure)
11. [Local Development Guide](#11-local-development-guide)
12. [API Reference](#12-api-reference)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Project Overview

### 1.1 About the Event

| Field | Details |
|-------|---------|
| **Workshop Title** | Cloud Quest – Microsoft Azure Workshop |
| **Organizer** | Alliance University, School of Advanced Computing |
| **Association** | Microsoft Azure Developer Community |
| **Speaker** | Ms. Suchitra Nayak, Technical Project Manager – Microsoft Engagement, Tech Mahindra |
| **Date** | March 14, 2026 (Saturday) |
| **Time** | 10:00 AM – 01:00 PM |
| **Venue** | LT-517, LC-2, Alliance University |

### 1.2 Workshop Agenda

| Time | Session | Topics |
|------|---------|--------|
| 10:00 – 11:00 AM | Session 1 | Introduction to Cloud Native Architecture & Azure Fundamentals |
| 11:00 – 12:00 PM | Session 2 | Fundamentals of UI Design, Security & App Deployment Basics |
| 12:00 – 01:00 PM | Session 3 | UI Development, App Deployment & End-to-End Monitoring |

### 1.3 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 18 + Vite | Single Page Application |
| Styling | CSS3 (Custom Properties) | Azure-themed responsive design |
| Backend | .NET 8 Minimal API | REST API + SPA hosting |
| Hosting | Azure App Service (F1) | Cloud hosting |
| CI/CD | GitHub Actions | Automated build & deploy |
| Version Control | Git + GitHub | Source code management |

---

## 2. Architecture Design

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AZURE CLOUD                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Azure App Service (F1 Free Tier)            │   │
│  │                                                          │   │
│  │  ┌──────────────────┐    ┌──────────────────────────┐    │   │
│  │  │  .NET 8 Runtime   │    │   wwwroot/ (Static)      │    │   │
│  │  │                  │    │                          │    │   │
│  │  │  /api/health     │    │   index.html             │    │   │
│  │  │  /api/workshop   │    │   assets/index.js        │    │   │
│  │  │  /api/register   │    │   assets/index.css       │    │   │
│  │  │  /api/login      │    │                          │    │   │
│  │  │                  │    │   (React SPA Build)      │    │   │
│  │  └──────────────────┘    └──────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
           ▲                              ▲
           │ HTTPS /api/*                 │ HTTPS / (SPA)
           │                              │
┌──────────┴──────────────────────────────┴──────────┐
│                   Browser (User)                    │
│                                                     │
│   Navbar → Hero → Speaker → Agenda → Details        │
│   → Registration → Login → Footer                   │
└─────────────────────────────────────────────────────┘
```

### 2.2 CI/CD Pipeline Architecture

```
┌──────────┐     push      ┌──────────────────┐     deploy     ┌───────────────┐
│          │ ──────────────▶│  GitHub Actions   │ ─────────────▶│ Azure App     │
│ Developer│               │                  │               │ Service       │
│ (Git)    │               │ 1. npm ci+build  │               │               │
│          │               │ 2. dotnet publish│               │ cloudquest-   │
│          │               │ 3. zip & deploy  │               │ demo          │
└──────────┘               └──────────────────┘               └───────────────┘
```

### 2.3 Request Flow

```
Browser Request
      │
      ▼
Azure App Service (.NET 8 Kestrel)
      │
      ├── /api/*  →  Minimal API Endpoints
      │                 ├── GET  /api/health     → Health check
      │                 ├── GET  /api/workshop   → Workshop data
      │                 ├── POST /api/register   → User registration
      │                 └── POST /api/login      → User authentication
      │
      ├── /assets/* → Static files (JS, CSS)
      │
      └── /*  →  SPA Fallback → wwwroot/index.html → React Router
```

### 2.4 Data Flow (Registration + Login)

```
┌──────────┐    POST /api/register     ┌─────────────────────┐
│  React   │ ─────────────────────────▶│  .NET 8 API         │
│  Form    │    {name,email,           │                     │
│          │     password,institution} │  1. Validate input  │
│          │                           │  2. Hash password   │
│          │◀───────────────────────── │  3. Store in memory │
│          │    {message, registrant}  │  4. Return success  │
└──────────┘                           └─────────────────────┘

┌──────────┐    POST /api/login        ┌─────────────────────┐
│  React   │ ─────────────────────────▶│  .NET 8 API         │
│  Form    │    {email, password}      │                     │
│          │                           │  1. Find user       │
│          │◀───────────────────────── │  2. Hash + compare  │
│          │    {message, user}        │  3. Return user     │
│          │    or 401 Unauthorized    │     or reject       │
└──────────┘                           └─────────────────────┘
```

---

## 3. UI/UX Design

### 3.1 Design System

#### Color Palette (Azure Brand)

| Color | Hex | Usage |
|-------|-----|-------|
| Azure Blue | `#0078D4` | Primary buttons, links, accents |
| Azure Blue Dark | `#005A9E` | Hover states |
| Azure Cyan | `#50E6FF` | Highlights, badges, gradients |
| Azure Teal | `#00B7C3` | Gradient endpoints |
| Azure Green | `#7FBA00` | Success states |
| Dark Navy | `#0A0E27` | Hero/footer backgrounds |
| Surface | `#F4F7FC` | Section backgrounds |
| Text Primary | `#1A1A2E` | Body text |
| Text Secondary | `#4A5568` | Muted text |

#### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | Inter / Segoe UI | 700-900 | 1.2–4rem |
| Body | Inter / Segoe UI | 400 | 1rem (16px) |
| Labels | Inter / Segoe UI | 600 | 0.85rem |
| Badges | Inter / Segoe UI | 600-700 | 0.75–0.85rem |

#### Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 8px | Inputs, small cards |
| --radius-md | 12px | Cards, buttons |
| --radius-lg | 20px | Large cards |
| --radius-xl | 30px | Badges, pills |
| Section padding | 100px top/bottom | Between sections |

### 3.2 Page Layout & Sections

```
┌─────────────────────────────────────────┐
│              NAVBAR (fixed)             │
│  ☁️ Cloud Quest    Home Speaker ...     │
├─────────────────────────────────────────┤
│              HERO SECTION               │
│                                         │
│        ⚡ Microsoft Azure Workshop      │
│           Cloud Quest                   │
│      Microsoft Azure Workshop           │
│                                         │
│   📅 March 14  ⏰ 10-1 PM  📍 LT-517   │
│                                         │
│          [ Register Now → ]             │
├─────────────────────────────────────────┤
│           SPEAKER SECTION               │
│                                         │
│    ┌─────┐  Ms. Suchitra Nayak         │
│    │ SN  │  Technical Project Manager  │
│    └─────┘  Tech Mahindra              │
│             Azure Cloud | DevOps | ...  │
├─────────────────────────────────────────┤
│           AGENDA SECTION                │
│                                         │
│  ☁️──── Session 1: Cloud Native ...     │
│  │                                      │
│  🛡️──── Session 2: UI Design ...       │
│  │                                      │
│  🚀──── Session 3: Deployment ...       │
├─────────────────────────────────────────┤
│        EVENT DETAILS SECTION            │
│                                         │
│  📍 Venue  📅 Date  💻 Bring  📋 Prereq │
├─────────────────────────────────────────┤
│        REGISTRATION SECTION             │
│                                         │
│  ┌─ Form ──────┐  ┌─ QR Code ──┐       │
│  │ Name         │  │            │       │
│  │ Email        │  │   [QR]     │       │
│  │ Password     │  │            │       │
│  │ Institution  │  │ Scan to    │       │
│  │ [Register]   │  │ Register   │       │
│  └──────────────┘  └────────────┘       │
├─────────────────────────────────────────┤
│           LOGIN SECTION                 │
│                                         │
│       ┌─ Login Form ──────┐             │
│       │ Email              │             │
│       │ Password           │             │
│       │ [ Log In ]         │             │
│       └────────────────────┘             │
├─────────────────────────────────────────┤
│              FOOTER                     │
│  Cloud Quest  |  Quick Links  | Azure   │
│  © 2026 Alliance University            │
└─────────────────────────────────────────┘
```

### 3.3 Responsive Breakpoints

| Breakpoint | Target | Key Changes |
|------------|--------|-------------|
| > 1024px | Desktop | 4-column details grid, side-by-side speaker card |
| 768–1024px | Tablet | 2-column details grid |
| 480–768px | Small Tablet | Hamburger menu, stacked layouts, 1-column grids |
| < 480px | Mobile | Reduced font sizes, hidden timeline connectors |

### 3.4 Animations & Interactions

| Element | Animation | CSS |
|---------|-----------|-----|
| Hero particles | Floating/scaling loop | `@keyframes float` (20s infinite) |
| Scroll indicator | Bounce | `@keyframes bounce` (2s infinite) |
| Cards | Hover lift + shadow | `transform: translateY(-4px)` |
| CTA button | Hover lift + arrow slide | `translateY(-3px)`, arrow `translateX(4px)` |
| Navbar | Scroll-triggered background | `backdrop-filter: blur(20px)` |
| Mobile menu | Slide from right | `right: -100%` → `right: 0` |

---

## 4. Implementation

### 4.1 Frontend (React 18 + Vite)

#### Component Tree

```
App
├── Navbar          — Fixed navigation, scroll detection, mobile menu
├── Hero            — Full-viewport hero with particles, event info
├── Speaker         — Speaker profile card with expertise tags
├── Agenda          — 3-session timeline with topic pills
├── EventDetails    — 4-card grid (venue, date, bring, prerequisites)
├── Registration    — Form (POST /api/register) + QR placeholder
├── Login           — Form (POST /api/login) + welcome card
└── Footer          — 3-column grid with links
```

#### State Management

| State | Component | Purpose |
|-------|-----------|---------|
| `user` | App.jsx | Logged-in user object (null if not logged in) |
| `isScrolled` | Navbar | Toggle navbar background on scroll |
| `menuOpen` | Navbar | Mobile hamburger menu toggle |
| `form` | Registration | Registration form field values |
| `form` | Login | Login form field values |
| `status` | Registration/Login | Success/error feedback state |
| `submitting` | Registration/Login | Loading spinner on form submit |

#### Key Implementation Details

**Vite Configuration (vite.config.js):**
- Dev server on port `5173` with API proxy to `localhost:5000`
- Production build outputs to `../server/wwwroot/` (served by .NET)

**Form Handling:**
- Controlled inputs with `useState`
- `fetch()` to API endpoints with JSON body
- Client-side validation (required, maxLength, minLength, email type)
- Status messages (success/error) with clear visual feedback

### 4.2 Backend (.NET 8 Minimal API)

#### Endpoint Implementation

```csharp
// Health check — used by Azure monitoring
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", ... }));

// Workshop data — returns all event details as JSON
app.MapGet("/api/workshop", () => Results.Ok(new { title, organizer, agenda, ... }));

// Registration — validates, hashes password, stores user
app.MapPost("/api/register", (RegistrationRequest request) => { ... });

// Login — validates credentials against stored users
app.MapPost("/api/login", (LoginRequest request) => { ... });

// SPA fallback — serves React index.html for client-side routing
app.MapFallbackToFile("index.html");
```

#### Middleware Pipeline

```
Request
  │
  ├── UseCors("AllowReactDev")    — CORS for dev server
  ├── UseDefaultFiles()           — Serve index.html for /
  ├── UseStaticFiles()            — Serve wwwroot/ assets
  ├── MapGet/MapPost endpoints    — API routes
  └── MapFallbackToFile           — SPA fallback
```

#### Data Models

```csharp
public record RegistrationRequest(string Name, string Email, string Password, string Institution);
public record LoginRequest(string Email, string Password);
public record RegisteredUser(string Name, string Email, string Institution, string PasswordHash, DateTime RegisteredAt);
```

---

## 5. Testing

### 5.1 Test Strategy

| Level | What | Tool | Status |
|-------|------|------|--------|
| **Unit** | API endpoint logic | `dotnet test` / xUnit | Manual |
| **Integration** | API request/response | `curl` / PowerShell | Verified |
| **E2E** | Full user flow | Browser manual testing | Verified |
| **Build** | React + .NET compilation | `npm run build` + `dotnet build` | Passed |

### 5.2 API Integration Tests (Verified Results)

#### Health Check
```http
GET /api/health
→ 200 OK
→ {"status":"healthy","service":"CloudQuest Workshop API","timestamp":"..."}
```

#### Registration (Success)
```http
POST /api/register
Content-Type: application/json
{"name":"Test User","email":"test@example.com","password":"secret123","institution":"Alliance University"}
→ 200 OK
→ {"message":"Registration successful! You can now log in.","registrant":{...}}
```

#### Registration (Duplicate Email)
```http
POST /api/register
{"name":"Dupe User","email":"test@example.com","password":"other123","institution":"Other Uni"}
→ 400 Bad Request
→ {"error":"This email is already registered."}
```

#### Login (Valid Credentials)
```http
POST /api/login
{"email":"test@example.com","password":"secret123"}
→ 200 OK
→ {"message":"Login successful!","user":{"name":"Test User","email":"test@example.com","institution":"Alliance University"}}
```

#### Login (Wrong Password)
```http
POST /api/login
{"email":"test@example.com","password":"wrongpass"}
→ 401 Unauthorized
→ {"error":"Invalid email or password."}
```

#### Login (Unregistered Email)
```http
POST /api/login
{"email":"nobody@example.com","password":"secret123"}
→ 401 Unauthorized
→ {"error":"Invalid email or password."}
```

### 5.3 Build Verification

| Build | Command | Result |
|-------|---------|--------|
| React SPA | `cd client && npm run build` | ✅ 35 modules → 3 files (174 KB) |
| .NET API | `cd server && dotnet build` | ✅ Succeeded |
| .NET Publish | `dotnet publish -c Release` | ✅ Output to `publish/` |
| SPA served at `/` | `curl http://localhost:5000/` | ✅ HTTP 200 |

### 5.4 Responsive Testing Checklist

| Device | Viewport | Status |
|--------|----------|--------|
| Desktop | 1920×1080 | ✅ Full layout, 4-column details grid |
| Laptop | 1366×768 | ✅ Scales properly |
| Tablet | 768×1024 | ✅ 2-column grid, stacked speaker card |
| Mobile | 375×667 | ✅ Hamburger menu, single column, smaller fonts |
| Mobile Small | 320×568 | ✅ Timeline connectors hidden, compact layout |

---

## 6. Security

### 6.1 Implemented Security Measures

#### Authentication & Data Protection

| Measure | Implementation | File |
|---------|---------------|------|
| **Password Hashing** | SHA256 hash before storage — plain text never stored | `Program.cs` |
| **Input Validation (Server)** | Required checks, email format, length limits | `Program.cs` |
| **Input Validation (Client)** | HTML5 required, maxLength, minLength, type="email" | React components |
| **No Information Leakage** | Same error message for wrong email & wrong password | `Program.cs` |
| **Duplicate Prevention** | Thread-safe `ConcurrentDictionary.TryAdd` rejects duplicate emails | `Program.cs` |

#### Network & Transport Security

| Measure | Implementation |
|---------|---------------|
| **HTTPS** | Azure App Service enforces HTTPS by default |
| **CORS** | Restricted to `localhost:5173` (dev only), not wildcard `*` |
| **External Links** | `rel="noopener noreferrer"` on all `target="_blank"` links |

#### Application Security

| Measure | Implementation |
|---------|---------------|
| **XSS Prevention** | React auto-escapes all JSX output — no `dangerouslySetInnerHTML` |
| **CSRF Mitigation** | JSON Content-Type API (not form POST) — browsers enforce preflight |
| **No SQL Injection** | No database / no raw SQL queries |
| **No Directory Listing** | Only `wwwroot/` served as static; `MapFallbackToFile` for SPA |
| **No Secret Exposure** | Publish profile stored as GitHub Secret, not in code |

### 6.2 OWASP Top 10 Assessment

| # | Risk | Status | Notes |
|---|------|--------|-------|
| A01 | Broken Access Control | ✅ Safe | No protected resources; login state in client memory |
| A02 | Cryptographic Failures | ⚠️ Adequate | SHA256 used (bcrypt recommended for production) |
| A03 | Injection | ✅ Safe | No SQL, no command execution, no template injection |
| A04 | Insecure Design | ✅ Safe | Minimal API surface, input validated at all boundaries |
| A05 | Security Misconfiguration | ✅ Safe | CORS restricted, no debug endpoints, no stack traces in prod |
| A06 | Vulnerable Components | ✅ Safe | Up-to-date React 18, .NET 8, Vite 6 |
| A07 | Auth Failures | ⚠️ Adequate | Passwords hashed, generic error messages; no rate limiting |
| A08 | Data Integrity | ✅ Safe | CI/CD pipeline from trusted GitHub repo |
| A09 | Logging Failures | ⚠️ Needs improvement | Basic .NET logging; no security event monitoring |
| A10 | SSRF | ✅ Safe | No server-side URL fetching |

### 6.3 Production Security Recommendations

| Priority | Improvement | How |
|----------|-------------|-----|
| **High** | Use bcrypt/PBKDF2 for passwords | `Microsoft.AspNetCore.Identity` or `BCrypt.Net-Next` NuGet package |
| **High** | Add JWT authentication | Issue tokens on login, validate on protected routes |
| **High** | Rate limiting | `Microsoft.AspNetCore.RateLimiting` middleware (100 req/min per IP) |
| **Medium** | Add CSP headers | `Content-Security-Policy: default-src 'self'` |
| **Medium** | HTTPS redirect | `app.UseHttpsRedirection()` in middleware |
| **Medium** | Persistent storage | Azure SQL or Cosmos DB instead of in-memory |
| **Low** | Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` |
| **Low** | Application Insights | Security event logging and anomaly detection |

---

## 7. CI/CD Pipeline

### 7.1 Pipeline Overview

**File:** `.github/workflows/azure-deploy.yml`  
**Trigger:** Push to `main` branch or manual dispatch  
**Environment:** `production`

### 7.2 Pipeline Stages

```
┌─────────────────────────────────────────────────────┐
│                 GitHub Actions Workflow              │
│                                                     │
│  ┌─ Stage 1: Checkout ─────────────────────────┐    │
│  │  actions/checkout@v4                        │    │
│  └─────────────────────────────────────────────┘    │
│                     │                               │
│  ┌─ Stage 2: Build React SPA ──────────────────┐    │
│  │  Setup Node.js 18                           │    │
│  │  npm ci (install deps)                      │    │
│  │  npm run build → ../server/wwwroot/         │    │
│  └─────────────────────────────────────────────┘    │
│                     │                               │
│  ┌─ Stage 3: Build .NET API ───────────────────┐    │
│  │  Setup .NET 8 SDK                           │    │
│  │  dotnet restore                             │    │
│  │  dotnet publish -c Release → ./publish      │    │
│  └─────────────────────────────────────────────┘    │
│                     │                               │
│  ┌─ Stage 4: Deploy to Azure ──────────────────┐    │
│  │  azure/webapps-deploy@v3                    │    │
│  │  Publish profile from GitHub Secrets        │    │
│  │  Package: ./publish                         │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 7.3 Pipeline YAML

```yaml
name: Build and Deploy to Azure App Service

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: cloudquest-demo
  DOTNET_VERSION: '8.0.x'
  NODE_VERSION: '18.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      - run: npm ci
        working-directory: client
      - run: npm run build
        working-directory: client
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: ${{ env.DOTNET_VERSION }}
      - run: dotnet restore
        working-directory: server
      - run: dotnet publish -c Release -o ../publish
        working-directory: server
      - uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: publish
```

### 7.4 Setting Up CI/CD

1. **Download publish profile:**
   ```bash
   az webapp deployment list-publishing-profiles \
     --name cloudquest-demo \
     --resource-group student-feedback-rg --xml
   ```

2. **Add GitHub Secret:**
   - Go to `github.com/suchigithub/CloudQuestWorkshop/settings/secrets/actions`
   - New secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Paste the XML content

3. **Trigger:** Every `git push origin main` auto-deploys

---

## 8. Deployment

### 8.1 Azure Resources

| Resource | Type | SKU | Region |
|----------|------|-----|--------|
| `student-feedback-rg` | Resource Group | — | South India |
| `ASP-studentfeedbackrg-be33` | App Service Plan | F1 Free | South India |
| `cloudquest-demo` | Web App | .NET 8 (Windows) | South India |

### 8.2 Manual Deployment (Azure CLI)

```powershell
# Step 1 — Login
az login

# Step 2 — Set subscription
az account set --subscription "Azure subscription 1"

# Step 3 — Build React SPA
cd client
npm ci
npm run build    # Outputs to ../server/wwwroot/

# Step 4 — Publish .NET API
cd ../server
dotnet publish -c Release -o ../publish

# Step 5 — Create zip
cd ../publish
Compress-Archive -Path .\* -DestinationPath ..\deploy.zip -Force

# Step 6 — Deploy
cd ..
az webapp deploy --resource-group student-feedback-rg --name cloudquest-demo --src-path deploy.zip --type zip

# Step 7 — Verify
Invoke-RestMethod -Uri "https://cloudquest-demo.azurewebsites.net/api/health"
```

### 8.3 Creating Azure Resources from Scratch

```powershell
$RG = "rg-cloudquest-workshop"
$PLAN = "plan-cloudquest-free"
$APP = "cloudquest-demo"
$LOC = "centralindia"

# Create resource group
az group create --name $RG --location $LOC

# Create App Service Plan (Free F1)
az appservice plan create --name $PLAN --resource-group $RG --sku F1 --is-linux

# Create Web App
az webapp create --name $APP --resource-group $RG --plan $PLAN --runtime "DOTNETCORE:8.0"
```

### 8.4 Deployment via Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com) → **Create a resource** → **Web App**
2. Configure: Name=`cloudquest-demo`, Runtime=`.NET 8`, Plan=`Free F1`
3. Click **Create**
4. Go to **Deployment Center** → Source: **GitHub** → Repo: `suchigithub/CloudQuestWorkshop` → Branch: `main`
5. Click **Save** — Azure creates a GitHub Actions workflow automatically

---

## 9. Monitoring & Observability

### 9.1 Built-in Health Check

The `/api/health` endpoint provides real-time service status:

```json
{
  "status": "healthy",
  "service": "CloudQuest Workshop API",
  "timestamp": "2026-03-12T12:18:56Z"
}
```

### 9.2 Azure App Service Monitoring (Built-in)

Available in Azure Portal → App Service → **Monitoring**:

| Feature | What it shows |
|---------|---------------|
| **Metrics** | CPU %, Memory %, HTTP 4xx/5xx errors, response times |
| **Activity Log** | Deployment events, config changes, restarts |
| **Diagnose & Solve Problems** | AI-powered diagnostics for common issues |
| **Health Check** | Configure `/api/health` for auto-restart on failures |

#### Enable Health Check Probing:
```powershell
az webapp config set --resource-group student-feedback-rg --name cloudquest-demo --generic-configurations '{"healthCheckPath":"/api/health"}'
```

### 9.3 Azure Application Insights (Recommended)

For production monitoring, add Application Insights:

```powershell
# Create Application Insights resource
az monitor app-insights component create \
  --app cloudquest-insights \
  --location southindia \
  --resource-group student-feedback-rg

# Get the instrumentation key
az monitor app-insights component show \
  --app cloudquest-insights \
  --resource-group student-feedback-rg \
  --query instrumentationKey -o tsv
```

Then add to `Program.cs`:
```csharp
builder.Services.AddApplicationInsightsTelemetry();
```

And add the NuGet package:
```bash
dotnet add package Microsoft.ApplicationInsights.AspNetCore
```

### 9.4 Monitoring Capabilities with App Insights

| Feature | Purpose |
|---------|---------|
| **Live Metrics** | Real-time request rate, failure rate, response time |
| **Request Tracking** | Every API call with duration, status, dependencies |
| **Exception Logging** | Automatic stack trace capture for all unhandled errors |
| **Custom Events** | Track registrations, logins, failed login attempts |
| **Availability Tests** | Ping `/api/health` from multiple regions every 5 minutes |
| **Alerts** | Email/SMS on high error rate, slow responses, downtime |
| **Usage Analytics** | Page views, sessions, user geography |

### 9.5 Azure CLI Monitoring Commands

```powershell
# View live logs
az webapp log tail --name cloudquest-demo --resource-group student-feedback-rg

# View recent logs
az webapp log download --name cloudquest-demo --resource-group student-feedback-rg

# Restart app
az webapp restart --name cloudquest-demo --resource-group student-feedback-rg

# View app settings
az webapp config show --name cloudquest-demo --resource-group student-feedback-rg

# View deployment status
az webapp deployment list --name cloudquest-demo --resource-group student-feedback-rg -o table
```

---

## 10. Repository Structure

```
CloudQuestWorkshop/
├── .github/
│   └── workflows/
│       └── azure-deploy.yml          # CI/CD pipeline
│
├── client/                            # React SPA (Vite)
│   ├── index.html                     # HTML entry point
│   ├── package.json                   # Node dependencies & scripts
│   ├── package-lock.json              # Locked dependency versions
│   ├── vite.config.js                 # Vite config (proxy + build output)
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Root component (auth state)
│       ├── components/
│       │   ├── Navbar.jsx             # Fixed nav + mobile menu + user indicator
│       │   ├── Hero.jsx               # Hero section with particles
│       │   ├── Speaker.jsx            # Speaker profile card
│       │   ├── Agenda.jsx             # 3-session timeline
│       │   ├── EventDetails.jsx       # 4-card info grid
│       │   ├── Registration.jsx       # Registration form (POST /api/register)
│       │   ├── Login.jsx              # Login form (POST /api/login)
│       │   └── Footer.jsx             # Footer with links
│       └── styles/
│           └── styles.css             # All styles (1100+ lines, Azure-themed)
│
├── server/                            # .NET 8 Minimal API
│   ├── Program.cs                     # API endpoints + SPA hosting + auth
│   ├── CloudQuestApi.csproj           # .NET project file
│   ├── appsettings.json               # App configuration
│   └── Properties/
│       └── launchSettings.json        # Dev server config (port 5000)
│
├── CloudQuestWorkshop.sln             # Visual Studio solution
├── PROJECT_DOCS.md                    # This file
├── DEPLOYMENT.md                      # Azure deployment guide
├── README.md                          # Project overview
└── .gitignore                         # Git ignore rules
```

---

## 11. Local Development Guide

### 11.1 Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Git](https://git-scm.com/)

### 11.2 Clone & Setup

```bash
git clone https://github.com/suchigithub/CloudQuestWorkshop.git
cd CloudQuestWorkshop

# Install frontend dependencies
cd client
npm install
cd ..
```

### 11.3 Run in Development Mode

**Terminal 1 — Backend:**
```bash
cd server
dotnet run
# API running at http://localhost:5000
```

**Terminal 2 — Frontend (hot reload):**
```bash
cd client
npm run dev
# App at http://localhost:5173, API proxied to :5000
```

### 11.4 Production Build & Preview

```bash
# Build React → server/wwwroot/
cd client && npm run build

# Run full app from .NET
cd ../server && dotnet run
# Full app at http://localhost:5000
```

---

## 12. API Reference

### GET /api/health

Health check for Azure monitoring.

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "service": "CloudQuest Workshop API",
  "timestamp": "2026-03-12T12:18:56Z"
}
```

### GET /api/workshop

Returns all workshop details.

**Response:** `200 OK`
```json
{
  "title": "Cloud Quest – Microsoft Azure Workshop",
  "organizer": "Alliance University School of Advanced Computing",
  "association": "Microsoft Azure Developer Community",
  "date": "March 14, 2026",
  "time": "10:00 AM – 01:00 PM",
  "venue": "LT-517, LC-2",
  "speaker": {
    "name": "Ms. Suchitra Nayak",
    "role": "Technical Project Manager – Microsoft Engagement",
    "company": "Tech Mahindra"
  },
  "agenda": [
    { "time": "10:00 – 11:00 AM", "topic": "Cloud Native Architecture & Azure Fundamentals" },
    { "time": "11:00 – 12:00 PM", "topic": "UI Design, Security & App Deployment" },
    { "time": "12:00 – 01:00 PM", "topic": "UI Development, Deployment & Monitoring" }
  ]
}
```

### POST /api/register

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "institution": "Alliance University"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Registration successful! You can now log in.",
  "registrant": { "name": "John Doe", "email": "john@example.com", "institution": "Alliance University", "registeredAt": "..." }
}
```

**Error Responses:**
- `400` — Missing fields, invalid email, password < 6 chars, duplicate email

### POST /api/login

Authenticate a registered user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Login successful!",
  "user": { "name": "John Doe", "email": "john@example.com", "institution": "Alliance University" }
}
```

**Error Response:** `401 Unauthorized`
```json
{ "error": "Invalid email or password." }
```

---

## 13. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 on page reload | SPA fallback missing | Ensure `app.MapFallbackToFile("index.html")` in `Program.cs` |
| API returns 500 | Unhandled exception | Check logs: `az webapp log tail --name cloudquest-demo --resource-group student-feedback-rg` |
| Build fails in CI | Missing lock file | Commit `client/package-lock.json` |
| Static files not served | Build target wrong | Verify `outDir: '../server/wwwroot'` in `vite.config.js` |
| CORS error in dev | Backend not running | Start backend first: `cd server && dotnet run` |
| Blank page | JS not loading | Check browser console for 404 on `/assets/index-*.js` |
| App not starting on Azure | Wrong runtime | Set runtime: `az webapp config set --linux-fx-version "DOTNETCORE:8.0"` |
| Registration fails | Network error | Verify API proxy config points to correct backend URL |
| Login always fails | Password mismatch | Ensure same hashing algorithm on register and login |

---

## Summary

This project demonstrates a complete end-to-end cloud-native development workflow:

```
Design (Figma/CSS) → Implement (React + .NET) → Test (API + UI)
→ Secure (Validation + Hashing) → CI/CD (GitHub Actions) 
→ Deploy (Azure App Service) → Monitor (Health + Logs)
```

**Live Site:** https://cloudquest-demo.azurewebsites.net  
**GitHub:** https://github.com/suchigithub/CloudQuestWorkshop

---

*Document prepared for Cloud Quest – Microsoft Azure Workshop, March 2026*
