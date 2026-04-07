# eSIM Shop

A production-ready eSIM marketplace built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Live Demo

[Deployed on Vercel](https://alphacomm.vercel.app) _(update URL after deployment)_

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer         | Choice                   | Why                                                                |
| ------------- | ------------------------ | ------------------------------------------------------------------ |
| Framework     | Next.js 16 (App Router)  | Server components, file-based routing, built-in optimisations      |
| Language      | TypeScript (strict mode) | Type safety, `noUncheckedIndexedAccess` enabled                    |
| Styling       | MUI (Material UI) v6     | Production-grade component library, custom theme with brand tokens |
| Data fetching | React Query v5           | Cache management, optimistic updates, retry strategy               |
| Forms         | React Hook Form + Zod    | Performant forms with schema validation, API error mapping         |
| Cart state    | Zustand (persist)        | Minimal global state — only `cartId` persisted to localStorage     |
| HTTP          | Native `fetch`           | No Axios needed — typed wrapper with `ApiError` class              |

## Architecture

```
src/
├── app/                  # Next.js routes (/, /destinations/[slug], /cart)
├── components/           # UI primitives + feature components
├── hooks/                # Custom React hooks (useCart, useDestinations, etc.)
├── lib/                  # API client, utilities, constants, MUI theme
├── store/                # Zustand cart store
└── types/                # Shared TypeScript interfaces
```

## Pages

### Destinations (`/`)

- Searchable, filterable destination grid
- URL-driven filter state (`?search=&region=`)
- Skeleton loading, error, and empty states

### Destination Detail (`/destinations/:slug`)

- Hero image with destination name
- Plan cards with data/validity/coverage details
- Add-to-cart with loading feedback
- Server-side metadata via `generateMetadata`

### Cart & Checkout (`/cart`)

- Cart items with optimistic remove
- Checkout form with real-time validation
- Payment method selection from API
- 422 error mapping to individual form fields
- Order confirmation with receipt

## Key Decisions & Trade-offs

**Client-side rendering for all pages**
Why: The API doesn't support server-side auth or cookies. All data is user-specific (cart) or fetched client-side. React Query handles caching and stale data elegantly.
Trade-off: No SSR benefits for SEO on destination pages. For a production e-commerce site, I'd use ISR/SSG for destinations.

**Zustand only for `cartId`**
Why: Cart data lives server-side. Only the identifier needs persistence. React Query owns all server state.
Trade-off: Extra network request to hydrate cart on page load. Acceptable for data consistency.

**MUI with custom theme over Tailwind CSS**
Why: Full component library with accessibility built-in, consistent design system via `createTheme`, no need to build primitives from scratch. Single source of truth for brand colors and typography in the theme file.
Trade-off: Larger bundle than Tailwind (~80KB gzipped). Runtime CSS-in-JS. Worth it for development speed and a11y compliance out of the box.

**No optimistic updates for add-to-cart**
Why: Cart is server-authoritative. Optimistic add could show incorrect state if the plan is no longer available.
Trade-off: Slightly slower perceived performance. Mitigated with loading spinner on the button.

**Optimistic updates for remove-from-cart**
Why: Removing an item the user already has is deterministic. Rollback on error is straightforward.

## What I'd Do With More Time

- **SSG/ISR** for destination pages with `generateStaticParams`
- **E2E tests** with Playwright covering the full purchase flow
- **Accessibility audit** with axe-core, keyboard navigation testing
- **Dark mode** — tokens are already structured for it
- **i18n** — `next-intl` with locale-based routing
- **Rate limiting UI** — friendly 429 handling with exponential backoff
- **Sentry** error tracking + Vercel Analytics
- **Storybook** for component documentation
- **Docker** multi-stage build for self-hosted deployment

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint (0 warnings policy)
npm run type-check   # TypeScript strict check
npm run format       # Prettier format
```
