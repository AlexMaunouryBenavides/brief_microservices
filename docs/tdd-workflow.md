# Workflow TDD

> Charger via `@docs/tdd-workflow.md`. Appliquer à toute nouvelle fonctionnalité ou bug.

## Cycle Red → Green → Refactor

**Red** — Écrire un test qui échoue. Vérifier qu'il échoue pour la bonne raison.  
**Green** — Écrire le minimum de code pour le faire passer. Pas d'optimisation.  
**Refactor** — Améliorer sans casser les tests. Committer après chaque étape.

> Ne jamais refactorer code de prod et tests en même temps — une seule cible par commit.

## Règles fondamentales (Uncle Bob)

1. Ne pas écrire de code de production sans un test qui échoue d'abord
2. Ne pas écrire plus de test que nécessaire pour échouer
3. Ne pas écrire plus de code que nécessaire pour faire passer le test

## Avant d'écrire quoi que ce soit

Clarifier : cas nominal, cas d'erreur, edge cases.  
**Ne pas commencer sans ces réponses.**

## Structure d'un test (AAA)

```ts
it('description du comportement observable', async () => {
  // Arrange — données et dépendances
  // Act     — action testée
  // Assert  — vérification du résultat
});
```

## Nommage des tests

```ts
// ✅ Comportement
it('retourne une erreur si l'email est déjà utilisé')

// ❌ Implémentation
it('appelle userRepository.findByEmail()')
```

## Fakes > Mocks

Préférer les fakes in-memory pour les use-cases, mocks (`jest.fn()` / `vi.fn()`) pour les services externes.

```ts
// Fake repository — injecté directement dans le constructeur, jamais via le container
class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];
  async findByEmail(email: string) { return this.users.find(u => u.email === email) ?? null; }
  async save(user: User) { this.users.push(user); }
}
```

## Front (Vitest + RTL)

- `getByRole` > `getByLabelText` > `getByTestId`
- `userEvent` > `fireEvent`
- Mocker les adapters API avec `vi.mock`
- Tester ce que l'utilisateur voit, jamais les détails d'implémentation

## Commits

```bash
git commit -m "test(user): CreateUserUseCase — email déjà utilisé (RED)"
git commit -m "feat(user): CreateUserUseCase (GREEN)"
git commit -m "refactor(user): CreateUserUseCase"
```

## Checklist avant de passer à la suite

- [ ] Tous les tests passent
- [ ] Lint sans erreur
- [ ] Edge cases couverts
- [ ] Pas de `console.log` oublié
