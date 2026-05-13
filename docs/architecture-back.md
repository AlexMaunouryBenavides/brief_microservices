# Architecture Back-end (Express · Clean Architecture)

> Charger via `@docs/architecture-back.md` avant tout code back.

## Couches (de l'intérieur vers l'extérieur)

```
domain → application → interface → infrastructure
```

- **domain** : entités et règles métier — aucune dépendance externe
- **application** : use-cases — orchestre le domaine via les ports
- **interface** : controllers, routes, DTOs HTTP — pont entre HTTP et application
- **infrastructure** : implémentations concrètes (TypeORM, services externes)

## Structure

```
src/
├── domain/
│   ├── entities/        # Classes métier pures (pas de décorateurs ORM)
│   ├── value-objects/   # Objets valeur immuables
│   ├── errors/          # Erreurs domaine typées
│   └── ports/           # Interfaces des repositories (IUserRepository…)
│
├── application/
│   └── use-cases/       # Une classe par use-case, @injectable()
│       └── CreateUser/
│           ├── CreateUserUseCase.ts
│           ├── CreateUserDto.ts     # DTO applicatif (type pur)
│           └── CreateUserUseCase.test.ts
│
├── interface/
│   ├── controllers/     # Fins : valider → use-case → formater
│   ├── dtos/            # DTOs HTTP décorés (class-validator)
│   ├── middlewares/     # auth, validate, error
│   └── routes/
│
├── infrastructure/
│   ├── database/
│   │   ├── entities/    # Entités TypeORM (@Entity, @Column…)
│   │   ├── repositories/# Implémentent les ports du domaine
│   │   ├── mappers/     # Domain Entity ↔ ORM Entity
│   │   └── data-source.ts
│   └── services/        # Services tiers (mail, storage…)
│
└── app/
    ├── types.ts          # Symbols Inversify (TYPES)
    ├── container.ts      # ContainerModules — bindings par feature
    ├── inversify.config.ts
    ├── server.ts
    └── main.ts           # reflect-metadata en PREMIER import absolu
```

## Règles de dépendances

- `infrastructure` et `interface` importent `application` et `domain`
- `application` importe `domain` uniquement (via les ports)
- `domain` n'importe rien

## Conventions

- `@injectable()` sur use-cases et repositories
- `@inject(TYPES.X)` dans les constructeurs
- Les entités TypeORM **ne sortent jamais** de `infrastructure/` (mapper obligatoire)
- DTOs HTTP (`interface/dtos/`) décorés class-validator — ne traversent pas vers `application/`
- DTOs applicatifs (`application/use-cases/`) = types purs, pas de décorateurs
- Migrations obligatoires — `synchronize: true` interdit hors dev local
- Erreurs domaine uniquement dans les use-cases — jamais de codes HTTP

## Nommage

`User.ts` (domaine) · `UserEntity.ts` (TypeORM) · `CreateUserUseCase.ts` · `IUserRepository.ts` (port) · `CreateUserHttpDto.ts` · `UserController.ts` · `UserMapper.ts` · `TYPES.IUserRepository` (symbol IoC)

## Tests (Jest)

- Unitaires : faux repositories in-memory injectés directement dans le constructeur — pas de container
- Intégration : `supertest` + base PostgreSQL de test isolée

Voir @docs/tdd-workflow.md.
