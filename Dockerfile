FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG APP_VERSION=dev
ENV NUXT_PUBLIC_APP_VERSION=$APP_VERSION

RUN bun run build

# ---- runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./output
COPY --from=builder /app/server/db/migrations ./server/db/migrations

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "./output/server/index.mjs"]
