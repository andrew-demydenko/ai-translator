FROM node:20-alpine AS base
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

RUN ls packages/config/

# Build variables for Vite
ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN pnpm turbo run build

# use pnpm deploy to build isolated api folder
RUN pnpm --filter api deploy --prod /app/deployed

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# Copy only the necessary files for the api to run
COPY --from=builder /app/deployed .
# Copy the built frontend to the path that the api expects it (according to app.ts)
COPY --from=builder /app/apps/web/dist ./web/dist

EXPOSE 3001
# Start the api from the root of the deployed folder
CMD ["node", "dist/index.js"]