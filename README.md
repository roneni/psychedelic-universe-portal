# Psychedelic Universe Portal

A high-end web portal for the [Psychedelic Universe](https://www.youtube.com/@PsychedelicUniverse) YouTube channel (634K subscribers, 156M+ views). Features a persistent audio player, categorized mix navigation across psytrance subgenres, a global festival directory, and a community engagement system -- all wrapped in a dark, cyber-psy-minimalist design.

**Live:** [psychedelic-universe.com](https://psychedelic-universe.com)

---

## Features

- **Persistent Audio Player** -- Continuous playback across page navigation via an embedded YouTube player that stays active site-wide.
- **Genre-Based Mix Browser** -- Mixes organized by category: Progressive Psy, Psychedelic Trance, Goa Trance, and Full-On.
- **Festival Directory** -- Searchable global psytrance festival calendar with filtering by continent, date, and size. Festivals can be submitted by the community.
- **Artist Directory** -- Profiles for featured artists with social links, genre tags, and country of origin.
- **Radio Mode** -- Lean-back continuous listening experience.
- **Underground Vault** -- Exclusive content section with gated access for engaged community members.
- **Community Features** -- Karma points system, user favorites, suggestion box, and newsletter subscription.
- **Ronen's Picks** -- Curated personal favorites from the channel owner.
- **YouTube Analytics Dashboard** -- Stats page with real-time channel analytics via YouTube Data API and YouTube Analytics API.
- **Admin Panel** -- Content management for mixes, artists, partners, festivals, and site settings.
- **PWA Support** -- Installable progressive web app with offline-capable service worker, full icon set, and web manifest.
- **Record Label Partners** -- Carousel showcasing partner labels (HOMmega, Nano Records, Iboga, Dacru, TIP World, and more).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7 |
| Styling | Tailwind CSS 4, Framer Motion |
| UI Components | Radix UI primitives, shadcn/ui, Lucide icons |
| Routing | Wouter (lightweight React router) |
| State / Data | TanStack React Query, tRPC (end-to-end typesafe API) |
| Backend | Express, tRPC server, Node.js |
| Database | PostgreSQL via Drizzle ORM |
| Auth | OAuth (via Supabase), JWT sessions (jose) |
| Storage | AWS S3 (asset hosting) |
| Hosting | Vercel (serverless functions + static) |
| Testing | Vitest |
| Package Manager | pnpm |

## Project Structure

```
psychedelic-universe-portal/
  client/                 # Frontend SPA
    src/
      components/         # Reusable UI (Player, Hero, Navigation, etc.)
      pages/              # Route-level pages (Home, Genre, Festivals, etc.)
      contexts/           # React context providers (theme)
      hooks/              # Custom hooks (auth, debounce, mobile detection)
      lib/                # Utilities (tRPC client, YouTube helpers)
    public/               # Static assets (images, icons, manifest, SW)
  server/                 # Backend API
    _core/                # Server infrastructure (tRPC, auth, env, Vite)
    routers.ts            # tRPC router definitions
    db.ts                 # Database connection
    youtube.ts            # YouTube Data API integration
    youtubeAnalytics.ts   # YouTube Analytics API integration
    youtubePoller.ts      # Background polling for new uploads
    supabase.ts           # Supabase client
    storage.ts            # S3 storage helpers
  shared/                 # Shared types and constants (client + server)
  drizzle/                # Database schema, migrations, and relations
  scripts/                # Data population scripts (mixes, artists)
  api/                    # Vercel serverless function entry point
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database (local or hosted)

### Installation

```bash
git clone https://github.com/roneni/psychedelic-universe-portal.git
cd psychedelic-universe-portal
pnpm install
```

### Environment Variables

Create a `.env` file in the project root with the required credentials:

- Database connection string (PostgreSQL)
- YouTube Data API key
- YouTube OAuth credentials (for analytics)
- Supabase project URL and keys
- AWS S3 credentials (for asset storage)

### Development

```bash
pnpm dev
```

Starts the Express backend with Vite dev server middleware. The app will be available at `http://localhost:5000` (or the port configured in your environment).

### Build

```bash
pnpm build
```

Produces an optimized client bundle in `dist/public/` and a bundled server entry in `dist/`.

### Database Migrations

```bash
pnpm db:push
```

Generates and applies Drizzle ORM migrations against your PostgreSQL database.

### Testing

```bash
pnpm test
```

Runs the Vitest test suite.

## Deployment

The project is configured for Vercel deployment. The `vercel.json` routes API requests to the serverless function entry point and serves the SPA for all other routes.

## License

MIT
