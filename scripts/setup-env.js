#!/usr/bin/env node
/**
 * Génère les fichiers .env de chaque service à partir du .env racine.
 * Usage : npm run setup
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ROOT_ENV = path.join(ROOT, '.env');

if (!fs.existsSync(ROOT_ENV)) {
  console.error('Fichier .env introuvable à la racine. Copier .env.example en .env et le compléter.');
  process.exit(1);
}

function parseEnv(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return acc;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return acc;
      acc[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      return acc;
    }, {});
}

const root = parseEnv(ROOT_ENV);

const DB_USER = root['DB_USER'] ?? 'root';
const DB_PASSWORD = root['DB_PASSWORD'] ?? '1234';
const JWT_SECRET = root['JWT_SECRET'] ?? 'changeme';
const RABBITMQ_USER = root['RABBITMQ_USER'] ?? 'guest';
const RABBITMQ_PASS = root['RABBITMQ_PASS'] ?? 'guest';
const RABBITMQ_URL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@localhost:5672`;

const services = [
  {
    dir: 'apps/user-service',
    env: [
      `PORT=3001`,
      `DB_HOST=localhost`,
      `DB_PORT=3310`,
      `DB_USER=${DB_USER}`,
      `DB_PASSWORD=${DB_PASSWORD}`,
      `DB_NAME=user_db`,
      `DB_SYNCHRONIZE=true`,
      `JWT_SECRET=${JWT_SECRET}`,
      `RABBITMQ_URL=${RABBITMQ_URL}`,
    ],
  },
  {
    dir: 'apps/catalog-service',
    env: [
      `PORT=3002`,
      `DB_HOST=localhost`,
      `DB_PORT=3307`,
      `DB_USER=${DB_USER}`,
      `DB_PASSWORD=${DB_PASSWORD}`,
      `DB_NAME=catalog_db`,
      `DB_SYNCHRONIZE=true`,
    ],
  },
  {
    dir: 'apps/cart-service',
    env: [
      `PORT=3003`,
      `DB_HOST=localhost`,
      `DB_PORT=3308`,
      `DB_USER=${DB_USER}`,
      `DB_PASSWORD=${DB_PASSWORD}`,
      `DB_NAME=cart_db`,
      `DB_SYNCHRONIZE=true`,
      `RABBITMQ_URL=${RABBITMQ_URL}`,
      `CATALOG_SERVICE_URL=http://localhost:3002`,
    ],
  },
  {
    dir: 'apps/order-service',
    env: [
      `PORT=3004`,
      `DB_HOST=localhost`,
      `DB_PORT=3309`,
      `DB_USER=${DB_USER}`,
      `DB_PASSWORD=${DB_PASSWORD}`,
      `DB_NAME=order_db`,
      `DB_SYNCHRONIZE=true`,
      `RABBITMQ_URL=${RABBITMQ_URL}`,
      `CART_SERVICE_URL=http://localhost:3003`,
    ],
  },
];

for (const service of services) {
  const envPath = path.join(ROOT, service.dir, '.env');
  fs.writeFileSync(envPath, service.env.join('\n') + '\n', 'utf8');
  console.log(`✓ ${service.dir}/.env généré`);
}

console.log('\nSetup terminé. Tu peux maintenant lancer docker compose up ou npm run dev dans chaque service.');
