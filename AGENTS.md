# AGENTS.md

Instructions for AI coding agents (Claude, Copilot, Codex, etc.) working in this repository.

## Project Overview

Labs Hub is an educational platform for university seminars, built with Next.js
(App Router), React, TypeScript, MDX and Tailwind CSS. See `README.md` for the
full tech stack and project structure.

## Committing

**Never run `git commit` (or otherwise create a commit) without explicit
approval from the user.** After staging/preparing changes, ask the user
whether to commit now or defer, and only commit once they confirm.

## Commit Message Format

This repository uses **Conventional Commits** with the following exact style
(match existing history in `git log`):

```
<type>: <Capitalized short description>[ (#<PR number>)]
```

- `<type>` is lowercase, e.g. `feat`, `fix`, `chore`, `docs`.
- The description starts with a capital letter and is written in a short,
  imperative/descriptive form (e.g. `Added lecture 9 to pb178 spring 2026`,
  `Fixed page width`).
- No scopes are used (e.g. not `feat(app): ...`).
- The `(#<PR number>)` suffix is **optional** when authoring commits
  directly — it's normally added automatically by GitHub when the PR is
  merged (squash merge), e.g. `(#24)`. Never add it yourself; just use
  `type: Capitalized description`.

Examples from history:

```
feat: Claude CLI in devcontainer (#24)
fix: Dates and links in lecture 1 of PV179 Autumn (#23)
feat: Added lecture 12 to pb178 spring 2026 (#19)
fix: Fixed page width (#6)
```

## Code Quality Requirements

Every code change must pass the same checks CI runs (see `CI` section below):

```bash
pnpm lint          # ESLint (eslint-config-next + eslint-config-prettier)
pnpm format:check  # Prettier check
pnpm build         # Next.js build
```

Use the fixer scripts to auto-resolve lint/format issues where possible:

```bash
pnpm lint:fix
pnpm format
```

This project uses **pnpm** as the package manager (see `pnpm-workspace.yaml` /
`pnpm-lock.yaml`) — do not use npm or yarn.

## Code Conventions

- **TypeScript everywhere**, `strict` mode is enabled. Path alias `@/*` maps
  to the repo root.
- Prefer `const`/`let` (`prefer-const`, `no-var` enforced); no `var`.
- Function components and utilities use **arrow function expressions**
  (`func-style: expression` enforced outside `components/ui/**`, which holds
  generated shadcn/ui components and is excluded from that rule).
- Avoid `console.log`; `console.warn`/`console.error` are allowed.
- Avoid `any` (warned) and array index as React `key` (error).
- Formatting is enforced by Prettier: double quotes, semicolons, 2-space
  indent, 80 print width, trailing commas (ES5), LF line endings. Don't
  hand-format — run `pnpm format` instead of manually matching style.
- Do not edit files under `components/ui/**` for style nits; they are
  shadcn/ui-generated components.

## Project Structure Conventions

- `app/` — Next.js App Router pages/layouts (route segments under
  `app/courses/[course]/...`).
- `components/` — shared React components; `components/ui/` holds shadcn/ui
  primitives (generated via `shadcn`, configured in `components.json`).
- `content/` — MDX lecture content and course metadata, organized per course
  folder (e.g. `content/lectures/pb178-spring-2026/`). Lecture frontmatter's
  `availableFrom` drives `content/lecture-schedule.json`, which is generated
  by `scripts/generate-lecture-schedule.mjs` (runs automatically before
  `pnpm dev` / `pnpm build` — do not hand-edit the generated schedule file).
- `lib/` — data loaders and utility functions (e.g. `lib/courses.ts`,
  `lib/lectures.ts`).
- `proxies/` — request-time guards (e.g. `proxies/lecture-availability.ts`
  enforces lecture route availability against the generated schedule).
- Lecture MDX files use top-level `#` headings for sections (the lecture page
  renders `frontmatter.title` separately), and typically introduce a numbered
  outline with a `# Agenda` heading.

## Authoring/Editing Lecture Content

- `content/lectures/example/showcase-lecture.mdx` is the reference for how
  lecture content should look — it demonstrates every supported MDX element
  and formatting option. Consult it when creating or restructuring lectures.
- Lecture frontmatter fields (see `LectureMetadata` in `lib/lectures.ts`):
  `title`, `description`, `order`, `recommendedStudyFrom`,
  `recommendedStudyTo`, `availableFrom`, `tags`.
- Whenever a lecture's content is added or changed, review its `title`,
  `description`, and `tags` frontmatter and update them if they no longer
  accurately reflect the content.

## Adding a New Course

Register new courses in `content/courses-metadata.json` (fields: `slug`,
`code`, `name`, `semester`), matching the folder name used under
`content/lectures/<slug>/`.

## CI

`.github/workflows/pr-check.yml` runs on every push to `main` and every PR,
using Node 24 and pnpm 10, and executes in order: `pnpm install --frozen-lockfile`,
`pnpm lint`, `pnpm format:check`, `pnpm build`. A PR is not mergeable unless
all of these succeed.

There are currently no automated tests in this repository.

## Validation Checklist for Changes

1. `pnpm lint`, `pnpm format:check`, and `pnpm build` all pass (see
   "Code Quality Requirements" above).
2. For lecture content changes, `title`, `description`, and `tags`
   frontmatter have been reviewed and updated if needed (see
   "Authoring/Editing Lecture Content" above).
3. Commit messages follow the format above.
