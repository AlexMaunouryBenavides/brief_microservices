FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/api-gateway/ apps/api-gateway/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/api-gateway

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/api-gateway/package.json apps/api-gateway/

RUN npm ci --workspace=apps/api-gateway --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/api-gateway/dist apps/api-gateway/dist

EXPOSE 3000
CMD ["node", "apps/api-gateway/dist/main"]
