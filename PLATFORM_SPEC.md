# AI Engineering for Devs — Platform Specification

> Living reference document · v1.0 · 2026-02-21

---

## 🎨 Design System — "Warm Intelligence"

### Color Tokens

#### Light Mode (default)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-main` | `#FFF8F1` | Page background |
| `--bg-surface` | `#FFFFFF` | Elevated surfaces |
| `--bg-card` | `#FFF1E6` | Cards, soft surfaces |
| `--primary` | `#FF6B00` | Primary actions, links |
| `--secondary` | `#FFC93C` | Secondary accents |
| `--accent` | `#FFD166` | Highlights |
| `--gradient-brand` | `#FF6B00 → #FFB703 → #FFD166` | Buttons, badges |
| `--text-primary` | `#1E1E1E` | Headings, body |
| `--text-secondary` | `#5C5C5C` | Descriptions |

#### Dark Mode

| Token | Value |
|-------|-------|
| `--bg-main` | `#0F0F12` |
| `--bg-surface` | `#1A1A1F` |
| `--primary` | `#FF8C42` |
| `--secondary` | `#FFC857` |
| `--text-primary` | `#F5F5F5` |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter / Geist | 48px (3rem) | 800 |
| H2 | Inter / Geist | 36px (2.25rem) | 800 |
| H3 | Inter / Geist | 28px (1.75rem) | 700 |
| Body | Inter | 16px (1rem) | 400 |
| Small | Inter | 14px (0.875rem) | 400 |
| Code | JetBrains Mono | 14px | 400 |

### Motion

| Property | Value |
|----------|-------|
| Duration fast | 200ms |
| Duration base | 300ms |
| Easing | ease-in-out |
| Hover scale | scale(1.02) |
| Page transition | fade + translateY(8px) |
| Hover glow | box-shadow warm orange |

### Component Styles

**Cards:**
- `border-radius: 16px`
- `backdrop-filter: blur(8px)`
- `border: 1px solid rgba(255,107,0,0.15)`
- Warm shadow on hover

**Buttons:**
- Primary → orange gradient solid
- Secondary → outline + glow on hover
- Ghost → hover highlight only

---

## 🧠 Multi-Tenant Architecture

### Model: Shared DB + Tenant Column Isolation

```
┌─────────────────────────────────┐
│           Tenants               │
│  Id · Name · Slug               │
│  CreatedAt                      │
└─────────────────────────────────┘
         ↓ TenantId (FK)
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Users   │ │ Courses  │ │ Progress │
│ TenantId │ │ TenantId │ │ TenantId │
└──────────┘ └──────────┘ └──────────┘
```

### Tenant Resolution

**Recommended: Subdomain**
```
empresa.tuplataforma.com → resolve tenant "empresa"
```

**Middleware pipeline:**
```
TenantResolverMiddleware
  → Extract subdomain from Host header
  → Lookup Tenant by Slug
  → Inject TenantContext into HttpContext
  → All queries scoped by TenantId
```

**Fallback options:** Custom header, JWT claim

### Migration path

Start shared DB → migrate high-value tenants to dedicated DB later.

---

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) |
| Styling | Vanilla CSS / Design tokens |
| 3D | Three.js (hero, dashboard only) |
| Motion | Framer Motion |
| Backend | ASP.NET Core |
| Auth | JWT + Refresh tokens |
| DB | PostgreSQL |
| Deploy | Docker → Cloud |

### Three.js Usage (Performance-first)

Only in:
- ✅ Hero landing (warm neural network)
- ✅ Dashboard progress graph
- ✅ Module visualization
- ❌ Everything else

---

## 🚀 90-Day Roadmap

### 🟢 Phase 1 — Foundation (Days 1–15)
- [ ] Setup repos (Next.js + .NET)
- [ ] Docker infra
- [ ] Auth JWT flow
- [ ] Theme light/dark base
- [ ] Landing page (✅ done)

### 🟡 Phase 2 — Core Product (Days 16–30)
- [ ] Course system (CRUD)
- [ ] Dashboard layout
- [ ] Progress tracking
- [ ] Basic sandbox mode
- [ ] Complete UI design

### 🟠 Phase 3 — AI Features (Days 31–45)
- [ ] Prompt Linter MVP
- [ ] LLM integration
- [ ] Session history
- [ ] Complete course modules

### 🔵 Phase 4 — Monetization (Days 46–60)
- [ ] Multi-tenant resolver
- [ ] Roles & permissions
- [ ] Staging deploy

### 🟣 Phase 5 — Polish (Days 61–75)
- [ ] Three.js hero
- [ ] 3D progress visualization
- [ ] Refined animations
- [ ] Performance optimization
