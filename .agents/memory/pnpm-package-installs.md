---
name: pnpm package installs in Replit workspaces
description: Handling package installation when a Replit callback targets a pnpm monorepo root instead of the intended workspace.
---

When the general Node package installer runs `pnpm add` at the monorepo root and fails with `ERR_PNPM_ADDING_TO_ROOT`, install the dependency with a package filter, such as `pnpm --filter <workspace-package> add -D <package>`.

**Why:** The managed installer can lose the intended artifact scope in a pnpm workspace, while pnpm correctly refuses to add a package to the root by default.

**How to apply:** Use the package installer first; if it fails specifically because it selected the workspace root, target the owning package with `--filter`, then verify the package manifest and lockfile.