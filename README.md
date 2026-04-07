# eSIM Shop

A production-ready eSIM marketplace built with **Next.js 16**, **TypeScript (strict)**, and **MUI (Material UI)**.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required. `NEXT_PUBLIC_API_URL` defaults to the provided Cloudflare Workers endpoint.

---

## Tech Stack

| Layer         | Choice                   | Why                                                                   |
| ------------- | ------------------------ | --------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router)  | File-based routing, `next/image` optimisation, `generateMetadata`     |
| Language      | TypeScript (strict mode) | Zero `any`; `noUncheckedIndexedAccess` enabled for safer array access |
| Styling       | MUI v7 + custom theme    | Accessible components out-of-the-box, `createTheme` for brand tokens  |
| Data fetching | React Query v5           | Stale-while-revalidate caching, smart retry, devtools                 |
| Forms         | React Hook Form + Zod    | No re-renders per keystroke, schema validation, API 422 error mapping |
| Cart state    | Zustand (persist)        | Only `cartId` in localStorage; cart data is server-authoritative      |
| HTTP          | Native `fetch`           | Typed `apiFetch<T>()` wrapper with `ApiError` class, no Axios needed  |

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
- **Search** with 300ms debounce, URL-driven (`?search=germany`)
- **Region filter** chips, URL-driven (`?region=europe`)
- **Popular** badge on destinations marked popular by the API

### Destination Detail (`/destinations/:slug`)

- Hero image with gradient overlay
- Plan cards showing data, validity, price, coverage
- `speedThrottle` warning rendered as an inline alert when present
- "Already in cart" state: button replaced with a confirmation badge + "View cart" link, preventing duplicate add errors from the API
- Dynamic `<title>` via `generateMetadata`

### Cart & Checkout (`/cart`)

- Cart summary with item-level remove (optimistic UI with rollback on failure)
- Multi-field checkout form: first name, last name, email, payment method
- **422 validation errors** from the API mapped inline to individual fields via `setError`
- Order confirmation receipt on success (order ID, items, total)

---

## Key Decisions & Trade-offs

### Why client-side rendering (CSR) for the home and cart pages?

**Motivation:** The home page (`/`) is interactive-first, entirely driven by search and filter params that change on every user input, which makes server-rendering the initial HTML only marginally useful. The cart page (`/cart`) is user-specific. React Query provides skeleton-based loading states and background revalidation, so there is no perceived lag after the first fetch.

**`/destinations/[slug]` already uses ISR:** The destination detail page is a Server Component with `export const revalidate = 60` and `generateStaticParams`, which pre-renders all popular destinations at build time. Non-popular destinations are generated on demand on first request and then cached.

### Why Zustand only stores `cartId`?

Cart data lives on the server. Persisting a full cart object locally creates staleness problems: prices can change and an item might become unavailable. Storing only the `cartId` in `localStorage` means the cart survives a page refresh while all item data is always fetched fresh from the API.

**Trade-off:** One extra GET `/api/cart/:id` request on each page load. Acceptable; the cart rarely has more than a handful of items.

### Why MUI over Tailwind CSS?

MUI ships a complete component library (`TextField`, `Chip`, `Card`, `Badge`, `Alert`, `Skeleton`) with ARIA attributes and focus management already handled. The custom `createTheme` produces a single source of truth for brand colours, typography, and border-radius without building those primitives from scratch.

**Trade-off:** Larger bundle (~80 KB gzipped for MUI + Emotion). Justified by the accessibility baseline, development speed, and consistent design tokens.

### Why no optimistic add-to-cart?

Adding to cart is a server mutation that can fail (duplicate plan, network error). Showing the item before server confirmation would produce an inconsistent UI. The button shows a loading spinner and is disabled during the request.

### Why optimistic remove-from-cart?

Removing an item is deterministic; there is no server-side reason the delete would fail for a valid `itemId`. The cache is updated immediately and rolled back via `onError` if the request does fail, so the user never sees a stuck state.

### Why native `fetch` over Axios?

The API surface is seven endpoints. A 40-line typed `apiFetch<T>()` wrapper with a custom `ApiError` class covers every need without adding a dependency. Axios would be justified with request interceptors, upload progress, or token refresh logic, none of which apply here.

---

## What I'd Do With More Time

---

### 1. Sort dropdown

I'd add a sort dropdown to let users order results by price or data amount.

---

### 2. Dark mode

MUI supports dark mode natively via `colorSchemes` and `useColorScheme`. I'd extend `theme.ts` with a dark colour scheme, add a toggle `IconButton` to the header, and let MUI persist the user's preference in `localStorage` automatically with no extra state management needed.

---

### 3. `aria-label` on the cart icon

The cart `IconButton` in the header has no accessible label so screen readers announce it as an unlabelled button. Adding a dynamic `aria-label` that includes the item count is a one-line fix and a meaningful accessibility baseline improvement.

---

### 4. Bundle analysis

MUI is a large dependency. Running `@next/bundle-analyzer` would identify which MUI components are actually contributing to the bundle and whether tree-shaking is working correctly. Some components (like `Grid`, `Typography`) are used heavily while others could be replaced with lighter alternatives.

---

### 5. `next/image` placeholder on the hero image

The destination hero image loads after the page renders, causing a visible layout jump. Adding a `blurDataURL` placeholder to the `<Image>` component would eliminate the shift and improve perceived load performance with a single prop change.

---

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint, zero warnings policy
npm run type-check   # TypeScript strict check
npm run format       # Prettier format all files
```
