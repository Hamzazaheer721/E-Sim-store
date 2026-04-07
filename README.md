# eSIM Shop

A production-ready eSIM marketplace built with **Next.js 16**, **TypeScript (strict)**, and **MUI (Material UI)**.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required — `NEXT_PUBLIC_API_URL` defaults to the provided Cloudflare Workers endpoint.

---

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

---

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

---

## Pages

### Destinations (`/`)

- Responsive destination grid with skeleton loading, error, and empty states
- **Search** with 300ms debounce — URL-driven (`?search=germany`)
- **Region filter** chips — URL-driven (`?region=europe`)
- **Popular** badge on destinations marked popular by the API

### Destination Detail (`/destinations/:slug`)

- Hero image with gradient overlay
- Plan cards showing data, validity, price, coverage
- `speedThrottle` warning rendered as an inline alert when present
- "Already in cart" state — button replaced with a confirmation badge + "View cart" link, preventing duplicate add errors from the API
- Dynamic `<title>` via `generateMetadata`

### Cart & Checkout (`/cart`)

- Cart summary with item-level remove (optimistic UI with rollback on failure)
- Multi-field checkout form: first name, last name, email, payment method
- **422 validation errors** from the API mapped inline to individual fields via `setError`
- Order confirmation receipt on success (order ID, items, total)

---

## Key Decisions & Trade-offs

### Why client-side rendering (CSR)?

**Motivation:** All three pages are either user-specific (`/cart`), interactive-first (`/`), or not meaningfully SEO-indexed for this project's scope. The destinations list is entirely driven by search and filter params that change per user input, which makes server-rendering the initial HTML only marginally useful — the content would differ on every request anyway. React Query provides skeleton-based loading states and background revalidation, so there is no perceived lag after the first fetch. CSR was the pragmatic choice given the time constraints of a take-home.

**What I'd change in production:** `/destinations/[slug]` is the strongest ISR candidate. See the _What I'd Do With More Time_ section for the full migration plan.

### Why Zustand only stores `cartId`?

Cart data lives on the server. Persisting a full cart object locally creates staleness problems — prices can change, an item might become unavailable. Storing only the `cartId` in `localStorage` means the cart survives a page refresh while all item data is always fetched fresh from the API.

**Trade-off:** One extra GET `/api/cart/:id` request on each page load. Acceptable — the cart rarely has more than a handful of items.

### Why MUI over Tailwind CSS?

MUI ships a complete component library (`TextField`, `Chip`, `Card`, `Badge`, `Alert`, `Skeleton`) with ARIA attributes and focus management already handled. The custom `createTheme` produces a single source of truth for brand colours, typography, and border-radius without building those primitives from scratch.

**Trade-off:** Larger bundle (~80 KB gzipped for MUI + Emotion). Justified by the accessibility baseline, development speed, and consistent design tokens.

### Why no optimistic add-to-cart?

Adding to cart is a server mutation that can fail (duplicate plan, network error). Showing the item before server confirmation would produce an inconsistent UI. The button shows a loading spinner and is disabled during the request.

### Why optimistic remove-from-cart?

Removing an item is deterministic — there is no server-side reason the delete would fail for a valid `itemId`. The cache is updated immediately and rolled back via `onError` if the request does fail, so the user never sees a stuck state.

### Why native `fetch` over Axios?

The API surface is seven endpoints. A 40-line typed `apiFetch<T>()` wrapper with a custom `ApiError` class covers every need without adding a dependency. Axios would be justified with request interceptors, upload progress, or token refresh logic — none of which apply here.

---

## What I'd Do With More Time

---

### 1. ISR for `/destinations/[slug]`

The destination page currently makes two separate API calls for the same data, one server-side inside `generateMetadata` and one client-side inside the component. Converting to ISR would collapse both into a single server fetch, eliminate the skeleton-flash on first load, and make plan content indexable by search engines. The page would become a Server Component that `await`s `getDestination(slug)` directly, with `revalidate = 60` to keep prices fresh and `generateStaticParams` to pre-build popular destinations at build time. Only `PlanCard` would remain `'use client'` since it owns the add-to-cart mutation.

---

### 2. Sort dropdown

Users have no way to order results: cheapest first, most data, A–Z. I'd add a `sort` URL param and apply sorting client-side with `useMemo` on the React Query result (the API doesn't support server-side sort), surfaced as a MUI `Select` next to the region filter chips. URL-driven state means the sorted view is shareable and survives a refresh.

---

### 3. Dark mode

MUI supports dark mode natively via `colorSchemes` and `useColorScheme`. I'd extend `theme.ts` with a dark colour scheme, add a toggle `IconButton` to the header, and let MUI persist the user's preference in `localStorage` automatically with no extra state management needed.

---

### 4. `aria-label` on the cart icon

The cart `IconButton` in the header has no accessible label so screen readers announce it as an unlabelled button. Adding a dynamic `aria-label` that includes the item count is a one-line fix and a meaningful accessibility baseline improvement.

---

### 5. Bundle analysis

MUI is a large dependency. Running `@next/bundle-analyzer` would identify which MUI components are actually contributing to the bundle and whether tree-shaking is working correctly. Some components (like `Grid`, `Typography`) are used heavily while others could be replaced with lighter alternatives.

---

### 6. Lighthouse CI

Adding Lighthouse CI to the GitHub Actions pipeline would track Core Web Vitals (LCP, CLS, INP) on every PR and surface regressions before they reach production. Given MUI's bundle size, LCP and INP are the most at-risk metrics.

---

### 7. `next/image` placeholder on the hero image

The destination hero image loads after the page renders, causing a visible layout jump. Adding a `blurDataURL` placeholder to the `<Image>` component would eliminate the shift and improve perceived load performance with a single prop change.

---

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint — zero warnings policy
npm run type-check   # TypeScript strict check
npm run format       # Prettier format all files
```
