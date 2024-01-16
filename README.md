# t3-turbo-lucia

## Installation

Use Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/noxify/t3-turbo-lucia
```

## About

It uses [Turborepo](https://turborepo.org) and contains:

```text
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ next.js
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC v11 router definition
  ├─ auth
  |   └─ Authentication using lucia-auth@v3
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Planetscale
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

To get it running, follow the steps below.

The db is currently configured for `mysql`.

Feel free to change.

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

## Some notes

- Github Auth is working incl. additional api call to get the user email ( inspired by authjs ;) )
- Logout seems to be buggy - maybe it must be called as server action instead a direct call ( `/auth/logout` )
  - Sometimes you get redirected, sometimes...not
- app feels a bit slow in dev mode - Possible that this is a local hardware problem ( 2017 MBP i7 )
  - Not sure if safari could be a problem, too
  - anyway.. it's working :D
- trpc isn't working currently - deactivated it for now to make my life easier :D

## References

The stack originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
