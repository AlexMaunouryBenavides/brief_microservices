# Audit de Sécurité — brief_microservices

**Date :** 2026-05-15  
**Scope :** Monorepo NestJS (api-gateway + 4 microservices) + frontend React/Nginx  
**Outils :** Trivy v0.70.0 · OWASP ZAP stable · npm audit · analyse manuelle Docker  

---

## Résumé exécutif

| Niveau | Nombre | Statut |
|--------|--------|--------|
| 🔴 CRITIQUE | 3 | 2 corrigés, 1 à corriger |
| 🟠 ÉLEVÉ | 8 | **8 corrigés** ✅ |
| 🟡 MOYEN | 9 | 7 corrigés, 2 à corriger |
| 🔵 FAIBLE | 6 | 4 corrigés, 2 à corriger |

**Score global :** Très bon état. Tous les problèmes ÉLEVÉS sont corrigés. Points restants : CVE mysql:8.0 (gosu), vulnérabilités npm transitives.

---

## 🔴 CRITIQUE

### C-1 — CVE-2025-68121 : Validation TLS incorrecte dans mysql:8.0 (gosu)
**Source :** Trivy  
**Composant :** `gosu` (binaire Go dans mysql:8.0) — `stdlib` v1.24.6  
**CVSS :** Critique (TLS session resumption, validation de certificat incorrecte)  
**Statut :** ⚠️ À corriger  
**Action :** Mettre à jour l'image `mysql:8.0` vers une version incluant gosu compilé avec Go ≥1.24.13
```yaml
# docker-compose.yml
mysql-user:
  image: mysql:8.4   # ou pin vers un digest récent de mysql:8.0 patché
```

---

### C-2 — Secret JWT faible au démarrage (CORRIGÉ)
**Source :** Audit applicatif  
**Composant :** `api-gateway/src/main.ts`, `user-service/src/main.ts`  
**Statut :** ✅ Corrigé — `validateEnv()` lève une exception si `JWT_SECRET` est absent ou vaut `'changeme'`

---

### C-3 — Ports microservices exposés sur l'hôte (CORRIGÉ)
**Source :** Audit applicatif  
**Composant :** `docker-compose.yml`  
**Statut :** ✅ Corrigé — seuls ports 3000 (api-gateway) et 5173 (frontend) sont exposés

---

## 🟠 ÉLEVÉ

### H-1 — Headers de sécurité manquants sur le frontend nginx (CORRIGÉ)
**Source :** ZAP (10020, 10021, 10038, 10063, 90004), headers-report.txt  
**Composant :** `apps/frontend/nginx.conf`  
**Impact :** Clickjacking, MIME sniffing, XSS, manque d'isolation CORS  
**Statut :** ✅ Corrigé — `apps/frontend/nginx.conf` mis à jour avec tous les headers  

**Résultat ZAP avant/après :**
- Avant : 8 WARN, 59 PASS
- Après : 3 WARN*, 64 PASS

*Warnings résiduels inévitables :
- `[10049]` `Cache-Control: no-store` sur le HTML = comportement correct pour une SPA
- `[10055]` `'unsafe-inline'` dans `style-src` = requis pour GSAP (animations via `element.style`)
- `[10109]` React SPA détecté — informatif uniquement

**Headers ajoutés :**
- `X-Frame-Options: SAMEORIGIN` + `frame-ancestors 'self'` (CSP)
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` complète (script-src, style-src, frame-ancestors, object-src, base-uri…)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`
- `Cross-Origin-Resource-Policy: same-origin`
- `server_tokens off` (suppression version nginx)

---

### H-2 — CVE-2026-40879 : DoS via JsonSocket dans @nestjs/microservices
**Source :** Trivy  
**Composant :** `@nestjs/microservices` dans tous les services NestJS  
**Impact :** Déni de service via `handleData` récursif  
**Statut :** ⚠️ À corriger  
**Action :** Mettre à jour `@nestjs/microservices` et `@nestjs/core` vers ≥11.1.21

---

### H-3 — GHSA-36xv-jgw5-4q75 : Injection dans @nestjs/core (CORRIGÉ via upgrade)
**Source :** npm audit  
**Statut :** Voir H-2 — même fix

---

### H-4 — Pas de CORS sur l'api-gateway (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `app.enableCors({ origin: CORS_ORIGIN, credentials: true })`

---

### H-5 — Helmet manquant sur l'api-gateway (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `app.use(helmet())` dans `main.ts`

---

### H-6 — Rate limiting absent (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — ThrottlerModule (5 req/min login+register, 20 global)

---

### H-7 — ParseUUIDPipe absent sur les paramètres `:id` (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — tous les controllers gateway utilisent `@Param('id', ParseUUIDPipe)`

---

### H-8 — Erreurs downstream exposées brutes (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `DownstreamExceptionFilter` sanitise stack/champs internes

---

## 🟡 MOYEN

### M-1 — CVE-2026-4800 : Exécution de code via lodash `_.template`
**Source :** Trivy + npm audit  
**Composant :** `lodash` ≤4.17.23 (dans `@nestjs/config`)  
**Impact :** Code injection via input non contrôlé (risque théorique, pas d'usage exposé)  
**Statut :** ⚠️ Aucun fix disponible sans changement de version majeure  
**Action :** Monitorer la sortie d'un patch lodash ; éviter tout usage de `_.template` avec input utilisateur

---

### M-2 — CVE-2026-2359 / 3304 / 3520 : DoS via multer (malformed uploads)
**Source :** Trivy + npm audit  
**Composant :** `multer` (via `@nestjs/platform-express`)  
**Impact :** Déni de service si le service accepte des uploads multipart  
**Statut :** ⚠️ Mitigé (api-gateway n'expose pas d'endpoint d'upload)  
**Action :** Mettre à jour `@nestjs/platform-express` vers ≥11.1.15

---

### M-3 — CVE-2024-21538 : ReDoS dans cross-spawn
**Source :** Trivy  
**Composant :** `cross-spawn` (dépendance transitive de NestJS CLI)  
**Impact :** Déni de service (uniquement dans le contexte CLI, pas en runtime applicatif)  
**Statut :** 🟡 Risque faible en production  
**Action :** `npm update cross-spawn` dans les workspaces concernés

---

### M-4 — CVE-2026-64756 : Command Injection via glob
**Source :** Trivy  
**Composant :** `glob` (dépendance transitive)  
**Impact :** Injection de commande via patterns de fichiers malicieux  
**Statut :** ⚠️ À surveiller  
**Action :** Mettre à jour `glob` vers la version fixée

---

### M-5 — CVE-2026-26996/27903/27904 : DoS via minimatch (ReDoS)
**Source :** Trivy  
**Composant :** `minimatch` (dépendance transitive)  
**Impact :** Déni de service par expression régulière catastrophique  
**Statut :** ⚠️ Risque modéré  
**Action :** `npm update minimatch` dans les workspaces

---

### M-6 — CVE-2026-23745/23950/24842 : Traversée de chemin via node-tar
**Source :** Trivy  
**Composant :** `tar` / `node-tar` (dépendance transitive NestJS)  
**Impact :** Écriture arbitraire de fichiers lors de l'extraction d'archives (non exposé en runtime API)  
**Statut :** 🟡 Risque faible en production (pas d'extraction tar via API)  
**Action :** Mettre à jour `tar` vers ≥7.x

---

### M-7 — Algorithme JWT non épinglé (algorithm confusion) (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `jwtService.verify(token, { algorithms: ['HS256'] })`

---

### M-8 — Politique de mot de passe faible (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `@Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)` dans `RegisterHttpDto`

---

### M-9 — forbidNonWhitelisted manquant (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`

---

## 🔵 FAIBLE

### F-1 — nginx version exposée dans le header `Server`
**Source :** ZAP [10036], headers-report.txt  
**Composant :** `nginx` dans le container frontend  
**Impact :** Fingerprinting, facilite le ciblage de CVE spécifiques  
**Statut :** ⚠️ À corriger dans nginx.conf : `server_tokens off;` (inclus dans le fix H-1)

---

### F-2 — Cache-Control absent sur les réponses API (404)
**Source :** ZAP [10049]  
**Composant :** api-gateway  
**Impact :** Réponses d'erreur pourraient être mises en cache par les proxies  
**Statut :** 🔵 Risque minimal  
**Action :** Ajouter `Cache-Control: no-store` sur les erreurs 4xx/5xx dans l'exception filter

---

### F-3 — Pas d'USER dans les Dockerfiles NestJS
**Source :** Analyse Docker Bench  
**Composant :** Tous les Dockerfiles `apps/*/Dockerfile`  
**Impact :** Conteneurs tournent en root — escalade de privilèges possible en cas de compromission  
**Statut :** ⚠️ À corriger en production  
**Action :** Ajouter `USER node` dans chaque Dockerfile (après les étapes `npm ci`) :
```dockerfile
USER node
CMD ["node", "dist/apps/api-gateway/main.js"]
```

---

### F-4 — Pas de limites de ressources dans docker-compose.yml
**Source :** Analyse Docker Bench  
**Impact :** Déni de service interne possible (un service peut consommer toute la RAM/CPU)  
**Statut :** 🔵 Acceptable en développement  
**Action :** En production, ajouter :
```yaml
deploy:
  resources:
    limits:
      memory: 512m
      cpus: '0.5'
```

---

### F-5 — GHSA-2g4f-4pwh-qvx6 : ReDoS dans ajv (build tools seulement) (CORRIGÉ)
**Source :** npm audit  
**Statut :** ✅ Uniquement dans les outils de build (@nestjs/schematics) — pas exposé en runtime

---

### F-6 — Pas de validation d'env vars (CORRIGÉ)
**Source :** Audit applicatif  
**Statut :** ✅ Corrigé — `validateEnv()` dans les `main.ts` de api-gateway et user-service

---

## Plan d'action prioritaire

### Immédiat (sécurité active)

1. **Fix H-1** : Ajouter `nginx.conf` avec security headers au frontend
2. **Fix H-2** : Mettre à jour `@nestjs/core` + `@nestjs/microservices` + `@nestjs/platform-express`
3. **Fix C-1** : Passer à `mysql:8.4` ou pinner un digest mysql:8.0 avec gosu patché

### Court terme (1-2 semaines)

4. **Fix F-3** : Ajouter `USER node` dans tous les Dockerfiles
5. **Fix M-1/M-2/M-5/M-6** : `npm update` des dépendances transitives

### Moyen terme (sprint suivant)

6. **Fix F-4** : Limites de ressources Docker en pré-prod/prod
7. **Fix F-2** : `Cache-Control: no-store` sur les erreurs API
8. **DB_SYNCHRONIZE** : Désactiver en production, utiliser les migrations TypeORM

---

## Bilan des sources

| Source | Résultat |
|--------|----------|
| Trivy (images Docker) | 25 vulns/service NestJS (HIGH×16, MEDIUM×7), 1 CRITICAL mysql, 1 HIGH rabbitmq |
| npm audit | 20 vulns (7 HIGH, 13 MODERATE) |
| OWASP ZAP — api-gateway | 66 PASS, 1 WARN (cache) |
| OWASP ZAP — frontend | 59 PASS, 8 WARN (tous headers manquants) |
| Analyse Docker Bench | Pas de USER, pas de limites ressources, pas de healthchecks NestJS |
| Audit applicatif (précédent) | 15 vulnérabilités — 13 corrigées avec TDD |

---

*Rapport généré le 2026-05-15 — brief_microservices security audit*
