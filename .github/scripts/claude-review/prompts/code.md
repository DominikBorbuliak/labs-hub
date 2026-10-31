Check:

- Correctness: bugs, broken behaviour, unhandled failure paths, and changes that
  break existing callers.
- Next.js: server and client component boundaries, data loading, and routes that
  must stay in step with `lib/` and `proxies/`.
- Lecture availability: nothing may expose a lecture before its `availableFrom`
  date or bypass `proxies/lecture-availability.ts`.
- Security: injection, unsafe rendering of content, and leaked secrets. In
  workflows, also token permissions and untrusted input reaching a shell.
- Conventions in `CLAUDE.md` that tooling does not enforce, such as using pnpm,
  leaving `components/ui/**` alone for style changes, and not editing generated
  files by hand.

Trace a change through the code that uses it before reporting a problem.
