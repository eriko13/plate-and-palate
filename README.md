# Plate & Palate

**BYU-I WDD 430 Group Project**

Plate & Palate helps people find homemade food from cooks nearby. Cooks make a profile and list dishes. Buyers browse by category or price, then leave ratings and reviews.

## Team Members

- Andrew Lee Parry
- Erik German Ruiz
- Karim Valenzuela Gonzalez
- Precious Okoroji
- Demetrious Shoniwa

## Tech Stack

### Front-end
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Back-end
- Node.js
- PostgreSQL (Neon)
- Auth.js (NextAuth)
- Prisma

### Deployment & Workflow
- Vercel
- GitHub Boards
- Git/GitHub with feature branches + pull requests

## Design

### Colors

| Color | Hex | Use |
|---|---|---|
| Terracotta | `#C4552D` | Buttons, links, accents |
| Cream | `#FAF3E7` | Page background |
| Charcoal | `#2E2A25` | Text |
| Sage | `#8A9B6E` | Tags and secondary accents |

### Typography

- **Bricolage Grotesque** — headings and brand
- **Source Sans 3** — body text and UI

## Core Features

- Cook (seller) profiles with login
- Dish listings with description, price, and images
- Browse page with category and price filters
- Ratings and written reviews
- Responsive layout with basic accessibility and SEO metadata

## Local setup

```bash
nvm use 22
pnpm install
vercel env pull .env.local
pnpm db:setup
pnpm dev
```

## Deployment

The app is deployed to Vercel: https://plate-and-palate-nortelab-projects.vercel.app

Environment variables live in the Vercel dashboard and are pulled locally with `vercel env pull .env.local`. See `.env.example` for the full list. The production database is Neon Postgres, shared with local development.

Demo accounts (from seed):

- Buyer: `buyer@plateandpalate.test` / `buyer1234`
- Cook: `marisol@plateandpalate.test` / `cook1234`
