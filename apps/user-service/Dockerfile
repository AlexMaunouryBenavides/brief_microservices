FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/user-service/ apps/user-service/

RUN npm ci
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/user-service

FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY packages/ packages/
COPY apps/user-service/package.json apps/user-service/

RUN npm ci --workspace=apps/user-service --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/apps/user-service/dist apps/user-service/dist

EXPOSE 3001
CMD ["node", "apps/user-service/dist/main"]
