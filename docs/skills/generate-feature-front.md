# skill: generate-feature-front

Génère une feature front complète en suivant @docs/architecture-front.md et @docs/tdd-workflow.md.

## Informations à collecter avant de commencer

Si l'une de ces infos est manquante, la demander avant de générer quoi que ce soit :
- Nom de la feature (ex: `UserProfile`)
- Données manipulées (types, champs)
- Actions disponibles (ex: fetch, update, delete)
- La feature nécessite-t-elle un état global Redux ? (oui / non)

## Ordre de génération strict (TDD)

### 1. Domain
- `src/domain/models/[name].model.ts` — type métier pur
- `src/domain/errors/[Name]Error.ts` — si une erreur métier est nécessaire

### 2. Infrastructure
- `src/infrastructure/api/[name].api.ts` — appels HTTP, mapper vers le type domaine

### 3. Application — RED en premier
- `src/application/use-cases/[name].usecase.test.ts` — écrire les tests, vérifier qu'ils échouent
- `src/application/use-cases/[name].usecase.ts` — implémenter jusqu'au GREEN
- Si état global : `src/application/store/[name].slice.ts` + `[name].selectors.ts`

### 4. UI — RED en premier
- `src/ui/features/[Name]/use[Name].test.ts` — tester le hook, vérifier qu'il échoue
- `src/ui/features/[Name]/use[Name].ts` — implémenter jusqu'au GREEN
- `src/ui/features/[Name]/[Name].test.tsx` — tester le composant, vérifier qu'il échoue
- `src/ui/features/[Name]/[Name].tsx` — implémenter jusqu'au GREEN
- `src/ui/pages/[Name]Page.tsx` — page associée si nécessaire (default export)

### 5. Refactor
- Supprimer la duplication, améliorer la lisibilité
- Relancer tous les tests — ils doivent rester verts

## Règles à respecter

- Ne jamais générer le code de prod avant le test correspondant
- L'adapter API est toujours mocké dans les tests (`vi.mock`)
- Le hook `use[Name].ts` contient toute la logique — le composant n'a que du JSX
- Aucune classe — uniquement des fonctions et hooks
- Tous les exports sont nommés sauf la page

## Commits attendus

```
test(feature): [Name] use-case + hook + composant (RED)
feat(feature): [Name] use-case + hook + composant (GREEN)
refactor(feature): [Name]
```
