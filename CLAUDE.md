# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack technique

**Front :** React · TypeScript (strict) · Tailwind CSS · Redux Toolkit · GSAP · Vite  
**Back :** Express · TypeScript (strict) · TypeORM · MySQL · JWT (jsonwebtoken) · Argon2 · Inversify  
**Tests :** Vitest + Cypress (front) · Jest (back)  
**Validation :** Zod (front) · class-validator + class-transformer (back)  
**Tooling :** npm · ESLint + Prettier · Conventional Commits

---

## Commandes essentielles

```bash
# Front (depuis le répertoire front/)
npm run dev          # Vite dev server (port 5173)
npm run build        # Build production
npm run test         # Vitest (watch)
npm run test:run     # Vitest (single run)
npx vitest run src/path/to/file.test.ts  # Un seul fichier de test
npm run test:e2e     # Cypress
npm run lint         # ESLint
npm run format       # Prettier

# Back (depuis le répertoire back/)
npm run dev          # ts-node-dev (port 3000)
npm run build        # tsc
npm run test         # Jest (watch)
npm run test:run     # Jest (single run)
npx jest src/path/to/file.test.ts        # Un seul fichier de test
npm run migration:run    # TypeORM migrations
npm run migration:revert # Rollback dernière migration
```

---

## Architecture

Lire le fichier d'architecture **avant** de générer du code :

- **Front** → @docs/architecture-front.md — Clean Architecture fonctionnelle (fonctions + hooks, pas de classes)
- **Back** → @docs/architecture-back.md — Clean Architecture en classes (Express + Inversify)

Couches front : `domain → application → infrastructure → ui`  
Couches back : `domain → application → interface → infrastructure`

### Back — IoC (Inversify)

Symbols dans `app/types.ts`, bindings dans `app/container.ts`. Les use-cases et repositories sont `@injectable()`. Injecter via `@inject(TYPES.X)` dans les constructeurs. Ne jamais résoudre depuis le container dans les tests — injecter directement le fake.

### Back — mappers TypeORM obligatoires

Les entités TypeORM (`infrastructure/database/entities/`) ne sortent jamais de `infrastructure/`. Utiliser un mapper (`UserMapper.ts`) pour convertir vers/depuis l'entité domaine.

---

## Approche de développement

**TDD obligatoire** — voir @docs/tdd-workflow.md.  
Cycle : Red → Green → Refactor. Un commit par étape.  
Fakes in-memory pour les repositories, `vi.fn()` / `jest.fn()` pour les services externes.

---

## Skills disponibles

- `@docs/skills/generate-feature-front.md` — génère une feature front complète (domain → infra → application → ui) en TDD

---

## Conventions de code

- **Nommage :** PascalCase composants React, camelCase utilitaires, kebab-case routes Express
- **Imports :** toujours nommés — default export seulement pour les pages/routes
- **TypeScript :** strict, pas de `any`, pas de `!`, retours de fonctions explicitement typés
- **Pas de `console.log`** — utiliser le logger custom
- **Variables d'environnement :** uniquement via `process.env`

---

## Règles importantes

- Ne JAMAIS mélanger logique métier et couche présentation / infrastructure
- Les entités TypeORM ne sortent JAMAIS des repositories
- Redux store = état UI global uniquement — pas de données serveur brutes
- Un test = un comportement observable, pas une implémentation
