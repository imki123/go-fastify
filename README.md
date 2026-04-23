# go-fastify

Simple server with fastify.

## Documentation

- Project docs index: [docs/index.md](./docs/index.md)

## How to start

```bash
npm i -g pnpm
pnpm i
cp .env.example .env
pnpm dev
open http://localhost:4000
```

## How to build

```bash
pnpm build:ts
pnpm start
```

## Environment variables

This project loads environment variables from `.env` via `dotenv`.

```bash
NODE_ENV=development
MAIN_SERVER_URL=http://localhost:3000
SUB_SERVER_URL=http://localhost:4000
```

- `MAIN_SERVER_URL`: main Express server URL
- `SUB_SERVER_URL`: sub Fastify server URL used by the sleep prevention plugin

## Deploy on Render

Use separate build and start commands in Render.

```bash
# Build Command
pnpm install --frozen-lockfile && pnpm build:ts

# Start Command
pnpm start
```

## How to check code quality

```bash
pnpm check:all
```

## How to test

```bash
pnpm test
```

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
