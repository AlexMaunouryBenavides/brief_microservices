# Architecture Front-end (React · Clean Architecture)

> Charger via `@docs/architecture-front.md` avant tout code front.

## Couches (de l'intérieur vers l'extérieur)

```
domain → application → infrastructure → ui
```

- **domain** : types et règles métier purs — aucune dépendance externe
- **application** : use-cases et état global (hooks, Redux slices)
- **infrastructure** : adapters vers l'extérieur (API HTTP, localStorage)
- **ui** : composants React — affichage uniquement

## Structure

```
src/
├── domain/
│   ├── models/          # Types métier purs (interfaces / types TS)
│   └── errors/          # Erreurs domaine typées
│
├── application/
│   ├── use-cases/       # Logique métier front (fonctions pures ou hooks)
│   └── store/           # Redux slices + selectors
│
├── infrastructure/
│   └── api/             # Appels HTTP (fetch / axios), adapters, mappers
│
├── ui/
│   ├── components/      # Composants réutilisables (atomiques)
│   ├── features/        # Composants liés à une feature + leur hook local
│   └── pages/           # Une page = un fichier, point d'entrée de la route
│
└── shared/
    ├── utils/           # Fonctions pures utilitaires
    └── constants/
```

## Règles de dépendances

- `ui` importe `application` et `infrastructure` — jamais l'inverse
- `application` importe `domain` uniquement
- `infrastructure` importe `domain` uniquement
- `domain` n'importe rien

## Conventions

- Tout en fonctions — pas de classes
- Export nommé partout, sauf les pages (default export pour le router)
- Un hook par feature dans `ui/features/` — il contient toute la logique du composant
- Redux = état UI global uniquement (pas de données serveur brutes)
- Selectors mémoïsés avec `createSelector` dans un fichier `*.selectors.ts`
- Tailwind en ligne dans le JSX, variants complexes via `cva()`
- GSAP : toujours nettoyer avec `ctx.revert()` dans le return du `useEffect`

## Nommage

| Élément | Convention |
|---|---|
| Composant React | `PascalCase.tsx` |
| Hook custom | `useCamelCase.ts` |
| Use-case | `camelCase.usecase.ts` |
| Adapter API | `camelCase.api.ts` |
| Test | même nom + `.test.ts(x)` |

## Tests (Vitest + RTL)

- Tester le comportement visible, jamais l'implémentation
- `userEvent` > `fireEvent`
- Sélecteurs par ordre de priorité : `getByRole` > `getByLabelText` > `getByTestId`
- Mocker les adapters API avec `vi.mock`

Voir @docs/tdd-workflow.md.
