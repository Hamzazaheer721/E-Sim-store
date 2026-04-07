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

These are improvements I'd prioritise next. Each is scoped to roughly one hour of work.

---

### 1. ISR for `/destinations/[slug]`

**Why it matters:** The destination page currently makes two separate API calls for the same data — one server-side for `generateMetadata` and one client-side for the page content. Converting to ISR eliminates both fetches into a single server render, removes the skeleton-flash on first load, and makes plan content indexable by search engines.

**How to implement:**

1. Convert `src/app/destinations/[slug]/page.tsx` from a `'use client'` component to a Server Component.
2. `await getDestination(slug)` directly in the page — Next.js deduplicates this with the `generateMetadata` call automatically.
3. Add `export const revalidate = 60` so the page rebuilds in the background every 60 seconds.
4. Add `generateStaticParams` to pre-render the most popular destinations at build time:

```ts
// src/app/destinations/[slug]/page.tsx
export const revalidate = 60;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.filter((d) => d.popular).map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await getDestination(slug);
  // ...render
}
```

5. Extract only `PlanCard` (the "Add to Cart" mutation) as `'use client'` — it's the only interactive island.

---

### 2. Sort dropdown on the destinations page

**Why it matters:** Users currently have no way to order results — most popular first, cheapest first, A–Z. Sorting by `startingFromPriceInCents` is valuable for price-sensitive shoppers.

**How to implement:**

Add a `sort` URL param alongside `search` and `region`. The sort is applied client-side on the array returned by the API (the API doesn't support a sort param):

```ts
// In DestinationsContent — add a sort select
const sort = searchParams.get('sort') ?? 'default';

const sorted = useMemo(() => {
  if (!destinations) return [];
  if (sort === 'price_asc')
    return [...destinations].sort(
      (a, b) => a.startingFromPriceInCents - b.startingFromPriceInCents,
    );
  if (sort === 'price_desc')
    return [...destinations].sort(
      (a, b) => b.startingFromPriceInCents - a.startingFromPriceInCents,
    );
  if (sort === 'name_asc') return [...destinations].sort((a, b) => a.name.localeCompare(b.name));
  return destinations; // default: API order (popular first)
}, [destinations, sort]);
```

Add a MUI `Select` component next to the `RegionFilter` that writes `?sort=price_asc` to the URL using `router.replace`.

---

### 3. Dark mode

**Why it matters:** MUI has first-class dark mode support. It's a visible quality-of-life feature and demonstrates knowledge of MUI's theming system.

**How to implement:**

1. Extend `theme.ts` with a `colorSchemes` option (MUI v6+):

```ts
export const theme = createTheme({
  colorSchemes: { dark: true },
  // existing palette stays as the light scheme
});
```

2. Replace `ThemeProvider` with `AppRouterCacheProvider` + `CssVarsProvider` from `@mui/material-nextjs`.
3. Add a toggle button to the `Header` using `useColorScheme()`:

```tsx
import { useColorScheme } from '@mui/material/styles';

function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
```

MUI persists the selected mode automatically in `localStorage`.

---

### 4. `notFound()` for invalid destination slugs

**Why it matters:** Visiting `/destinations/nonexistent` currently renders a generic error boundary. Next.js's `not-found.tsx` is cleaner and more user-friendly.

**How to implement:**

```ts
import { notFound } from 'next/navigation';

// In useDestination or in the page component on isError:
if (error instanceof ApiError && error.status === 404) {
  notFound();
}
```

---

### 5. Persist order confirmation across a page refresh

**Why it matters:** The order confirmation is currently stored in `useState`. Refreshing the page loses it and leaves the user with an empty cart screen.

**How to implement:**

After a successful order, redirect to a dedicated URL:

```ts
// In cart/page.tsx onSuccess handler
router.push(`/orders/${order.orderId}`);
```

Create `src/app/orders/[orderId]/page.tsx` that calls `GET /api/orders/:id` (if the API supports it) or stores the order object in sessionStorage before redirecting.

---

### 6. `aria-label` on header cart icon

**Why it matters:** The cart `IconButton` has no accessible label — screen readers announce it as an unlabelled button.

**Fix (one line):**

```tsx
<IconButton aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`} color="inherit" size="small">
```

---

### 7. Environment variable validation

**Why it matters:** `process.env.NEXT_PUBLIC_API_URL!` uses a non-null assertion — a misconfigured deploy silently produces `undefinedundefined` URLs at runtime. A Zod schema fails loudly at startup.

**Fix:**

```ts
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
```

Import `env.NEXT_PUBLIC_API_URL` in `api.ts` instead of `process.env.NEXT_PUBLIC_API_URL!`.

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
