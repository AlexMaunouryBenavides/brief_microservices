FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/order-service/ apps/order-service/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/order-service

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/order-service/package.json apps/order-service/

RUN npm ci --workspace=apps/order-service --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/order-service/dist apps/order-service/dist

EXPOSE 3004
CMD ["node", "apps/order-service/dist/main"]
