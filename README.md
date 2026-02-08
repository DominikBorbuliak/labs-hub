# Labs Hub

An educational platform for university seminars, built with Next.js and MDX.

## Purpose

This project was created with three goals in mind:

- **Better seminar materials** — PowerPoint is not ideal for teaching programming. Markdown (MDX) makes it easy to create well-structured lectures with properly rendered code examples. It also stands out from the usual slide decks, making seminars more engaging and enjoyable. Built for courses taught at Masaryk University.
- **Learning to use AI effectively** — Software engineering is shifting towards prompt engineering. Engineers need to use AI properly to stay competitive. This project serves as a playground for exploring different AI-assisted development approaches and techniques.
- **Refreshing Next.js skills** — Next.js is a powerful framework for building modern websites. Having used it only once before, this project is a practical way to relearn and solidify those concepts.

## Tech Stack

| Technology                                                       | Purpose                            |
| ---------------------------------------------------------------- | ---------------------------------- |
| [Next.js 16](https://nextjs.org/)                                | React framework with App Router    |
| [React 19](https://react.dev/)                                   | UI library                         |
| [MDX](https://mdxjs.com/)                                        | Markdown + JSX for lecture content |
| [Tailwind CSS](https://tailwindcss.com/)                         | Utility-first styling              |
| [shadcn/ui](https://ui.shadcn.com/)                              | Pre-built UI components (Radix UI) |
| [TypeScript](https://www.typescriptlang.org/)                    | Type safety                        |
| [rehype-highlight](https://github.com/rehypejs/rehype-highlight) | Syntax highlighting in code blocks |

## Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   └── courses/          # Course and lecture pages
├── components/           # React components
│   └── ui/               # shadcn/ui components
├── content/              # Lecture content (MDX files) and course metadata
│   └── lectures/         # MDX lecture files organized by course
├── lib/                  # Utility functions and data loaders
├── public/               # Static assets
└── .devcontainer/        # Dev container configuration
```

## Getting Started

For the best experience, use an editor or IDE that supports Dev Containers — everything needed to run this project is already preconfigured.

### Visual Studio Code

1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
2. Reopen the project folder in the dev container
3. Wait for the container to build and install dependencies
4. Run `pnpm dev`

## Available Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `pnpm dev`          | Start the development server |
| `pnpm build`        | Build for production         |
| `pnpm start`        | Start the production server  |
| `pnpm lint`         | Run ESLint                   |
| `pnpm lint:fix`     | Run ESLint with auto-fix     |
| `pnpm format`       | Format code with Prettier    |
| `pnpm format:check` | Check code formatting        |

## Future Plans

- **Database-backed content** — Migrate MDX storage from the filesystem to a database (likely [Turso](https://turso.tech/)) for more flexible content management
- **Authentication & authorization** — Add user login and role-based access control
- **Admin interface** — Dashboard for managing courses, lectures, and users
- **Online MDX editor** — Edit and preview lecture content directly in the browser
- **Multi-semester support** — Allow each course to span multiple semesters with separate content and scheduling
- **Seminar group support** — Organize students into seminar groups within each course

## shadcn/ui Components

The project uses [shadcn/ui](https://ui.shadcn.com/) to speed up frontend development. To add a new component:

```shell
pnpm dlx shadcn@latest add <component>
```
