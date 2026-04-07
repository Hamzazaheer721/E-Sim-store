# eSIM Shop

A production-ready eSIM marketplace built with **Next.js 16**, **TypeScript (strict)**, and **MUI (Material UI)**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables required — the API base URL is hardcoded to the provided endpoint.

## Tech Stack

| Layer         | Choice                   | Why                                                                    |
| ------------- | ------------------------ | ---------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router)  | File-based routing, `next/image` optimisation, `generateMetadata`      |
| Language      | TypeScript (strict mode) | Zero `any` — `noUncheckedIndexedAccess` enabled for safer array access |
| Styling       | MUI v7 + custom theme    | Accessible components out-of-the-box, `createTheme` for brand tokens   |
| Data fetching | React Query v5           | Stale-while-revalidate caching, smart retry, devtools                  |
| Forms         | React Hook Form + Zod    | No re-renders per keystroke, schema validation, API 422 error mapping  |
| Cart state    | Zustand (persist)        | Only `cartId` in localStorage — cart data is server-authoritative      |
| HTTP          | Native `fetch`           | Typed `apiFetch<T>()` wrapper with `ApiError` class — no Axios needed  |

## Architecture

```
src/
├── app/                  # Routes: /, /destinations/[slug], /cart
├── components/           # UI primitives (Button, Input, Skeleton) + feature components
├── hooks/                # useCart, useDestinations, useDebounce, usePlaceOrder, etc.
├── lib/                  # api.ts (fetch wrapper), theme.ts, utils.ts, constants.ts
├── store/                # Zustand cart store (cartId persistence only)
└── types/                # Shared TypeScript interfaces for API responses
```

## Pages

### Destinations (`/`)

- Responsive destination grid with skeleton loading, error, and empty states
- **Search** with 300ms debounce — URL-driven (`?search=germany`)
- **Region filter** chips — URL-driven (`?region=europe`)
- **Popular** badge on popular destinations

### Destination Detail (`/destinations/:slug`)

- Hero image with gradient overlay and destination name
- Plan cards showing data/validity/price/coverage
- **`speedThrottle` warning** when a plan has throttling (e.g. "3G speeds after 5GB")
- Add-to-cart with loading spinner, auto-nav to cart
- Dynamic `<title>` via `generateMetadata`

### Cart & Checkout (`/cart`)

- Cart summary with item-level remove (optimistic with rollback)
- Multi-field checkout form: name, email, payment method (fetched from API)
- **422 validation errors** mapped inline to individual fields
- Order confirmation receipt on success

## Key Decisions & Trade-offs

### Why client-side rendering everywhere?

The API doesn't support server-side cookies or auth headers. All state (cart, filters) is user-specific. React Query provides caching and background revalidation, so there's no perceived lag after the initial fetch.

**Trade-off:** No SSR/ISR for destination listings — hurts SEO. In production I'd use ISR with `generateStaticParams` for the destination pages since that data changes infrequently.

### Why Zustand only stores `cartId`?

Cart data lives on the server. Persisting a full cart object locally creates staleness problems (prices change, items get removed). Storing just the `cartId` in localStorage means the cart survives refresh but data is always fresh from the API.

**Trade-off:** An extra GET request to hydrate the cart on each page load. Acceptable for data correctness.

### Why MUI over Tailwind CSS?

MUI gives a complete component library — `TextField`, `Chip`, `Card`, `Badge`, `Alert`, `Skeleton` — all with ARIA attributes and focus management baked in. The custom `createTheme` provides a single source of truth for brand colours and typography.

**Trade-off:** Larger bundle (~80KB gzipped for MUI + Emotion). Worth it for development speed, accessibility compliance, and consistent design without building primitives from scratch.

### Why no optimistic add-to-cart?

Adding to cart is a server mutation that could fail (plan unavailable, network error). Showing the item before confirmation would lead to inconsistent UI. The button shows a loading spinner instead.

### Why optimistic remove-from-cart?

Removing an item already in your cart is deterministic — there's no server-side reason it would fail. If it does, the mutation rolls back via `onError` and restores the previous cache snapshot.

### Why native `fetch` over Axios?

The API surface is small (7 endpoints). A 40-line typed wrapper with an `ApiError` class covers all needs without adding a dependency. Axios would be justified if we needed request interceptors, upload progress, or cancellation — none apply here.

## What I'd Do With More Time

- **ISR/SSG** for destination pages via `generateStaticParams` — better SEO and TTFB
- **E2E tests** with Playwright — full purchase flow, empty cart edge case, 422 handling
- **Accessibility audit** — axe-core automated scan, manual keyboard/screen-reader walkthrough
- **Dark mode** — MUI theme supports `mode: 'dark'`, tokens are structured for it
- **Image placeholders** — `blurDataURL` for destination images to eliminate layout shift
- **Error boundary** — React `ErrorBoundary` at route level for uncaught exceptions
- **Bundle analysis** — `@next/bundle-analyzer` to identify and tree-shake unused MUI components

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint — zero warnings policy
npm run type-check   # TypeScript strict check
npm run format       # Prettier format all files
```
