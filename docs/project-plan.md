# Plan — Site e-commerce voitures électriques (microservices)

## Context

Création from scratch d'un site de vente de voitures électriques en architecture microservices. Le repo existe mais ne contient que de la documentation. L'objectif est de scaffolder l'intégralité du projet : monorepo npm workspaces, 5 services NestJS, 1 frontend React, Docker Compose, et d'implémenter toutes les features en TDD.

---

## Structure du monorepo

```
brief_microservices/
├── package.json                  # root — npm workspaces
├── tsconfig.json                 # strict: true, path aliases @shared/*
├── .eslintrc.js / .prettierrc
├── docker-compose.yml
├── packages/
│   └── shared/                   # interfaces TypeScript partagées
│       └── src/
│           ├── interfaces/       # ICar, IOption, IUser, ICart, IOrder
│           └── events/           # types des events RabbitMQ
└── apps/
    ├── api-gateway/              # port 3000
    ├── user-service/             # port 3001
    ├── catalog-service/          # port 3002
    ├── cart-service/             # port 3003
    ├── order-service/            # port 3004
    └── frontend/                 # port 5173
```

Chaque service NestJS suit l'architecture `docs/architecture-back.md` :
`domain → application → interface → infrastructure`

---

## Services et responsabilités

### api-gateway (port 3000)
- Seul point d'entrée public pour le frontend
- Vérifie le JWT (`JwtAuthGuard`), applique les rôles (`RolesGuard`)
- Proxie toutes les requêtes vers les services internes via `HttpModule`
- Ajoute les headers `X-User-Id` et `X-User-Role` après vérification du token
- **Pas de base de données. Pas de logique métier.**

### user-service (port 3001)
- Register / Login (signe le JWT ici), Get/Update profile
- Publie `user.registered` sur RabbitMQ après inscription

### catalog-service (port 3002)
- CRUD voitures + options (routes admin protégées via `X-User-Role`)
- `CalculatePriceUseCase` : source de vérité du prix = `basePrice + Σ(options sélectionnées)`
- Exposé aussi aux autres services en interne (cart-service y fait des appels HTTP)

### cart-service (port 3003)
- Panier par userId (une entrée en base par user)
- `AddToCartUseCase` appelle catalog-service pour valider les options et obtenir le prix final
- Stocke un snapshot JSON du véhicule + options (immunise contre les changements de catalogue)
- Consomme l'event `order.created` → vide le panier

### order-service (port 3004)
- `CreateOrderUseCase` appelle cart-service pour lire le panier, crée l'ordre, publie `order.created`
- `GetUserOrdersUseCase` / `GetOrderByIdUseCase`

---

## Modèles de données clés

| Service | Entités |
|---|---|
| user-service | `User` (id, email, passwordHash, firstName, lastName, role, createdAt) |
| catalog-service | `Car` (id, brand, model, year, rangeKm, powerKw, basePrice, imageUrl), `Option` (id, carId, name, additionalPrice) |
| cart-service | `Cart` (userId PK, updatedAt), `CartItem` (id, carId, carSnapshot JSON, selectedOptions JSON, totalPrice, quantity) |
| order-service | `Order` (id, userId, totalAmount, status, createdAt), `OrderItem` (id, orderId, carId, carSnapshot JSON, selectedOptions JSON, unitPrice, quantity) |

Les snapshots JSON dans cart et order protègent contre les changements de prix ultérieurs.

---

## Endpoints publics (api-gateway → frontend)

| Method | Path | Auth | Service cible |
|---|---|---|---|
| POST | `/api/auth/register` | Non | user-service |
| POST | `/api/auth/login` | Non | user-service |
| GET | `/api/users/me` | Oui | user-service |
| PATCH | `/api/users/me` | Oui | user-service |
| GET | `/api/catalog/cars` | Non | catalog-service |
| GET | `/api/catalog/cars/:id` | Non | catalog-service |
| GET | `/api/catalog/cars/:id/price?optionIds=` | Non | catalog-service |
| POST/PUT/DELETE | `/api/catalog/cars*` | Admin | catalog-service |
| GET/POST/DELETE/PATCH | `/api/cart/items*` | Oui | cart-service |
| POST | `/api/orders` | Oui | order-service |
| GET | `/api/orders` | Oui | order-service |
| GET | `/api/orders/:id` | Oui | order-service |

---

## Events RabbitMQ

Exchange `direct` nommé `ev.platform`. Queues durables, acquittement manuel.

| Event | Publisher | Consumer | Payload |
|---|---|---|---|
| `user.registered` | user-service | _(réservé)_ | `{ userId, email, firstName }` |
| `order.created` | order-service | cart-service | `{ orderId, userId, totalAmount }` |

---

## Auth flow

1. `POST /api/auth/login` → api-gateway proxie vers user-service → user-service signe le JWT (`{ sub, email, role }`) → retourne `{ accessToken, user }`
2. Requêtes protégées : `JwtAuthGuard` dans api-gateway vérifie le token → injecte `X-User-Id` + `X-User-Role` dans la requête forwarded
3. Services internes lisent ces headers directement (jamais de JWT côté services)
4. `JWT_SECRET` partagé entre user-service (signe) et api-gateway (vérifie) via variables d'env

---

## Docker Compose

12 conteneurs :
- **RabbitMQ** (management UI sur 15672)
- **4 instances MySQL** : `mysql-user:3306`, `mysql-catalog:3307`, `mysql-cart:3308`, `mysql-order:3309`
- **5 services NestJS** + **1 frontend**

Chaque service NestJS a son `Dockerfile` multi-stage (build avec `node:20-alpine`, prod copie `dist/`).

---

## Ordre d'implémentation

### Phase 0 — Infrastructure (prérequis)
1. `package.json` root avec npm workspaces (`apps/*`, `packages/*`)
2. `tsconfig.json` root strict
3. ESLint + Prettier root
4. `packages/shared` — interfaces + event types, build et vérification
5. `docker-compose.yml` — MySQL × 4 + RabbitMQ
6. Scaffold des 5 apps NestJS (`nest new`) et du frontend (`npm create vite`)

### Phase 1 — user-service
TDD strict (RED → GREEN → REFACTOR par use-case) :
1. Entité `User` + port `IUserRepository` + erreurs domaine
2. `RegisterUserUseCase` avec `InMemoryUserRepository`
3. `LoginUserUseCase` (argon2 verify + JwtService.sign)
4. `GetProfileUseCase` + `UpdateProfileUseCase`
5. `UserEntity` TypeORM + `UserMapper` + `TypeOrmUserRepository`
6. `UserController` + DTOs HTTP (class-validator)
7. `UserEventsPublisher` (RabbitMQ)
8. Test e2e supertest + MySQL Docker

### Phase 2 — catalog-service
1. Entités + ports + value-object `Price`
2. Use-cases lecture : `ListCars`, `GetCarById`
3. `CalculatePriceUseCase` — cas nominaux + edge cases (optionId invalide, option d'un autre véhicule)
4. Use-cases écriture : `CreateCar`, `UpdateCar`, `DeleteCar`, `AddOption`, `UpdateOption`, `DeleteOption`
5. TypeORM + mappers + controllers
6. Seed script pour données initiales

### Phase 3 — api-gateway
1. `JwtAuthGuard` + `RolesGuard` + `@Roles()` decorator
2. `HttpProxyService` générique (forward headers + body + params)
3. Contrôleurs proxy (thin layer)
4. Global exception filter (normalise les erreurs des services aval)
5. Tests d'intégration

À ce stade : register + login + catalog = fonctionnel end-to-end.

### Phase 4 — cart-service
1. Entités `Cart` + `CartItem` + port `ICartRepository`
2. `AddToCartUseCase` — injecter port `ICatalogClient` (fake dans les tests, impl HTTP en prod)
3. `RemoveFromCart`, `UpdateQuantity`, `ClearCart`, `GetCart`
4. TypeORM avec colonnes JSON
5. `CartEventsConsumer` RabbitMQ (`order.created` → clear cart)

### Phase 5 — order-service
1. Entités `Order` + `OrderItem` + port
2. `CreateOrderUseCase` — injecter port `ICartClient` (fake dans les tests)
3. `GetUserOrdersUseCase` + `GetOrderByIdUseCase`
4. TypeORM avec colonnes JSON
5. `OrderEventsPublisher` RabbitMQ (`order.created`)

### Phase 6 — frontend
Suivre `docs/skills/generate-feature-front.md` pour chaque feature :

Ordre : Auth → Catalog + Configurateur → Cart → Orders → Profile → Admin

Features clés :
- `useConfigurator` : toggle d'options avec recalcul de prix en temps réel (appel `/api/catalog/cars/:id/price` à chaque changement)
- `auth.slice` : stocke `{ accessToken, user }` dans Redux + persiste le token dans `localStorage`
- Guard de route React : redirige vers login si non authentifié pour `/cart`, `/orders`, `/profile`
- Pages admin protégées par vérification du rôle dans le router

---

## Règles critiques

- **Prix** : jamais faire confiance aux valeurs de prix envoyées par le navigateur — toujours recalculer côté catalog-service
- **Snapshots** : cart et order stockent des snapshots JSON figés au moment de l'action
- **TypeORM** : `synchronize: false` partout — migrations obligatoires
- **RabbitMQ** : queues durables + `persistent: true` + acquittement manuel
- **Réseau Docker** : services internes sur un réseau privé, seul api-gateway expose un port public
- **Tests** : use-cases testés avec faux repositories injectés directement (pas de container NestJS)

---

## Vérification end-to-end

1. `docker-compose up` → tous les conteneurs démarrent sans erreur
2. `POST /api/auth/register` → reçoit un JWT
3. `GET /api/catalog/cars` → retourne la liste des voitures
4. `GET /api/catalog/cars/:id/price?optionIds=...` → retourne un prix calculé
5. `POST /api/cart/items` (avec JWT) → retourne le panier mis à jour
6. `POST /api/orders` → crée l'ordre, cart est vidé (via event RabbitMQ)
7. `GET /api/orders` → retourne la liste des commandes de l'utilisateur
