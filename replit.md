# Jacadi Paris Saudi Catalogue

A React storefront for browsing the Jacadi Paris Saudi product catalogue, with linked product imagery, collection filters, search, wishlist, and a shortlist/cart flow.

## Run & Operate

- Install the workspace dependencies with `pnpm install --frozen-lockfile`.
- Start the storefront preview with the managed `artifacts/lille-nest: web` workflow. It runs `pnpm --filter @workspace/lille-nest run dev` with the artifact's `PORT` and `BASE_PATH` environment.
- `pnpm --filter @workspace/lille-nest run typecheck` — typecheck the storefront.
- `pnpm --filter @workspace/lille-nest run test` — run the storefront Vitest suite. Currently blocked at startup because `@testing-library/dom` is missing.
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `python artifacts/lille-nest/scripts/import-jacadi-catalog.py --resume` — refresh the English product catalog and public page text in `artifacts/lille-nest/src/data/jacadi-catalog.json`. The importer checks `robots.txt`, waits at least 0.8 seconds between requests, and records public product image URLs without downloading image files. Use `--resume` to continue after an interrupted run.
- `python artifacts/lille-nest/scripts/import-jacadi-catalog.py --images-only --resume` — populate or resume product image URL references in the existing catalog without re-importing product data. Image bytes remain hosted by Jacadi.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
