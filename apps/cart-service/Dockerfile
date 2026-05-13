FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/cart-service/ apps/cart-service/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/cart-service

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/cart-service/package.json apps/cart-service/

RUN npm ci --workspace=apps/cart-service --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/cart-service/dist apps/cart-service/dist

EXPOSE 3003
CMD ["node", "apps/cart-service/dist/main"]
