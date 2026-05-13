FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/catalog-service/ apps/catalog-service/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/catalog-service

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/catalog-service/package.json apps/catalog-service/

RUN npm ci --workspace=apps/catalog-service --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/catalog-service/dist apps/catalog-service/dist

EXPOSE 3002
# Seed populates initial car data on first boot, then starts the service
CMD ["sh", "-c", "node apps/catalog-service/dist/infrastructure/database/seed.js; node apps/catalog-service/dist/main.js"]
