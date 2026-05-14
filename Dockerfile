FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune api web --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN pnpm turbo run build
# Use pnpm deploy to build isolated api folder
RUN pnpm --filter api deploy --prod /app/deployed

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy the necessary files for the api to run
COPY --from=builder /app/deployed/dist ./dist
COPY --from=builder /app/deployed/node_modules ./node_modules
COPY --from=builder /app/deployed/package.json ./package.json

# Static frontend files
COPY --from=builder /app/apps/web/dist ./web/dist

EXPOSE 3001
CMD ["node", "dist/index.js"]