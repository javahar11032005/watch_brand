# Kestrel Watch Co.

A full-stack luxury watch brand experience: cinematic storytelling landing page, a real
interactive 3D watch (Three.js / React Three Fiber, built procedurally — no external model
files), a scroll-driven product story, an atelier-style configurator, and a working
e-commerce backend (catalog, cart, guest/auth checkout, Stripe test payments, orders, and a
basic admin) on Next.js + PostgreSQL + Prisma.

Kestrel is a fictional brand created for this project — not affiliated with any real watch
manufacturer.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router, Route Handlers), TypeScript, Tailwind CSS v4
- **3D**: three.js, @react-three/fiber, @react-three/drei
- **Animation**: GSAP + ScrollTrigger, Framer Motion, Lenis (smooth scroll)
- **Database**: PostgreSQL + Prisma
- **Auth**: custom (bcrypt + JWT in an httpOnly cookie), role-based (`USER` / `ADMIN`)
- **Payments**: Stripe Checkout Sessions, test mode

## Getting started locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database.** Point `DATABASE_URL` in `.env` at a PostgreSQL database (see
   `.env.example`). Then run:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

   This creates the schema and seeds four Meridian watches (each with all 27 case/dial/strap
   variant combinations), an admin account, and a demo customer:

   | Role  | Email                      | Password            |
   | ----- | -------------------------- | -------------------- |
   | Admin | admin@kestrelwatch.co      | AdminKestrel2026!    |
   | User  | demo@kestrelwatch.co       | DemoKestrel2026!     |

3. **Copy `.env.example` to `.env`** and fill in `SESSION_SECRET` (generate one with
   `openssl rand -base64 32`). Stripe keys can stay as placeholders — payments will fail
   gracefully with a clear message until real test keys are added, but every other flow
   (browsing, cart, guest checkout, order creation, admin) works without them.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

## Enabling real Stripe test payments

1. Get test-mode keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys)
   and set `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Forward webhooks locally with the Stripe CLI:

   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

   and put the printed signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Checkout now redirects to a real Stripe test Checkout page. Card `4242 4242 4242 4242`,
   any future expiry/CVC, completes a test payment. The webhook — not the redirect — is what
   marks the order `PAID` and decrements stock.

## Architecture notes

- **No hardcoded product data.** Products, prices, variants, inventory and specs all come
  from PostgreSQL via Prisma; the frontend only ever reads them through
  `src/services/*` (server components) or `/api/*` (client mutations).
- **Cart** is a single `Cart` model keyed by either `userId` or an opaque `guestToken` cookie
  — one code path for guests and signed-in users, merged on login/register.
- **Orders snapshot** product name, variant spec and price at purchase time (`OrderItem`), so
  historical orders stay accurate even if a product is later edited or removed.
- **Payment status is only ever set by the Stripe webhook**, never trusted from the client
  redirect, per the brief's security requirements.
- **3D watch** (`src/components/watch/`) is fully procedural — no `.glb` asset — so materials,
  proportions and the anatomy hotspots are all driven by `WatchModel.tsx` and can be swapped
  for a real model later via `Product.model3dUrl`.
- **Media** (`src/data/media.ts`) centralizes every stock photo/video reference so a client's
  real photography and campaign film can replace them by editing one file.

## Deploying to Render

`render.yaml` defines one web service and one Postgres database. From the Render dashboard,
"New → Blueprint" pointed at this repo will provision both; then set the Stripe env vars
(marked `sync: false`) and `NEXT_PUBLIC_SITE_URL` to the assigned `.onrender.com` URL (or a
custom domain) before the first deploy finishes.

## Known limitations

- Stock decrements are not distributed-lock-safe under heavy concurrent checkout of the same
  variant — acceptable for a demo/portfolio scale, would need a transaction-level row lock or
  a queue for production volume.
- Product imagery is free-license stock (Unsplash), not real Kestrel photography — see
  `src/data/media.ts` to swap it out.
- No automated test suite; verification was done via manual API smoke tests and `next build`.
