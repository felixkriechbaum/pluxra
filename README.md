# Pluxra

A self-hosted, customizable personal dashboard. Add pages, tabs, and widget tiles on a flexible 2D grid — live data from your server, NAS, weather, RSS feeds, bookmarks, and more.

---

## Features

- **Customizable 2D Grid** — configure columns and rows per page, place widgets with precise col/row spans (like a 2D Bootstrap grid)
- **Multiple Pages & Tabs** — organize your dashboard into named pages with tabs per page
- **Plugin-based Widgets** — each widget type is a self-contained module; adding new widgets requires no core changes
- **Live Data via Push Agents** — run a small script on your NAS or server that pushes metrics to the dashboard via a secure token; data streams to the browser in real-time via SSE
- **Built-in Widgets**
  - Bookmarks
  - Server Stats (push agent)
  - NAS Stats (push agent)
  - iFrame Embed
  - Weather (via Open-Meteo, no API key required)
  - RSS Feed
- **Firebase Auth** — sign in with Google or GitHub; all routes are protected
- **Secure Ingest Tokens** — generate tokens with a custom expiry (up to 1 year) for push agents; tokens are bcrypt-hashed, never stored in plain text

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 |
| Components | shadcn-vue (new-york, zinc) |
| Styling | TailwindCSS v4 |
| Backend | Nuxt Nitro (built-in) |
| Database | MySQL + Drizzle ORM |
| Auth | Firebase Auth + Firebase Admin SDK |
| Validation | Zod |

---

## Getting Started

### 1. Clone & install

```bash
git clone git@github.com:felixkriechbaum/pluxra.git
cd pluxra
bun install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Database
NUXT_DB_URL=mysql://user:password@localhost:3306/pluxra

# Firebase Admin SDK (server-side) — from Firebase Console → Project Settings → Service Accounts
NUXT_FIREBASE_PROJECT_ID=your-project-id
NUXT_FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
NUXT_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Auth SDK (browser) — from Firebase Console → Project Settings → General
NUXT_PUBLIC_FIREBASE_API_KEY=AIza...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### 3. Create database & run migrations

```bash
# Create the database first (once)
mysql -u root -p -e "CREATE DATABASE pluxra;"

# Generate and run migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 4. Start

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

---

## Push Agent

To send live metrics from a server or NAS to a widget:

1. Create a widget of type **Server Stats** or **NAS Stats**
2. Go to **Settings → Tokens**, generate a token for that widget
3. POST data from your agent:

```bash
curl -X POST https://your-dashboard/api/ingest/<your-token> \
  -H "Content-Type: application/json" \
  -d '{"cpu": 42, "ram": 61, "disk": 78}'
```

The data appears in the widget in real-time via SSE.

---

## Adding a Widget Plugin

1. Create a directory under `plugins/widgets/<your-widget>/`
2. Add three files:
   - `index.ts` — manifest (id, name, icon, Zod config schema, data source, default size)
   - `component.vue` — tile display
   - `settings.vue` — configuration form (v-model)
3. Register it in `plugins/widgets/widgetRegistry.ts`

---

## License

GPL v3.0 + Commons Clause — free for non-commercial use, forks must remain open source.
Commercial use requires explicit written permission from the author.

See [LICENSE](./LICENSE) for full terms.
