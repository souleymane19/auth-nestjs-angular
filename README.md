# Auth-NestJS-Angular

Ce projet est une application d'authentification basée sur **NestJS** (backend) et **Angular** (frontend). Il fournit une architecture robuste et modulaire pour gérer l'authentification des utilisateurs.

## Structure du projet

Le projet est organisé en deux répertoires principaux :

- **backend/** : Serveur API construit avec NestJS.
- **frontend/** : Interface utilisateur développée avec Angular.

## Prérequis

Avant de commencer, assure-toi d'avoir installé :
- **Node.js** (dernière version recommandée)
- **npm** ou **yarn**
- **Angular CLI** pour le frontend

## Installation

Clone le projet et installe les dépendances :

```bash
# Cloner le dépôt
git clone https://github.com/ton-utilisateur/auth-nestjs-angular.git
cd auth-nestjs-angular

# Installer les dépendances du backend
cd backend
npm install

# Installer les dépendances du frontend
cd ../frontend
npm install
```

## Démarrer l'application

### Backend (NestJS)

Lancer le serveur NestJS en mode développement :
```bash
cd backend
npm run start:dev
```
L'API sera accessible sur `http://localhost:3000/`

### Frontend (Angular)

Lancer l'application Angular :
```bash
cd frontend
ng serve
```
L'application sera accessible sur `http://localhost:4200/`

## Commandes utiles

### Backend

- **Démarrer en mode production** :
  ```bash
  npm run start:prod
  ```
- **Exécuter les tests unitaires** :
  ```bash
  npm run test
  ```
- **Exécuter les tests end-to-end** :
  ```bash
  npm run test:e2e
  ```

### Frontend

- **Générer un composant Angular** :
  ```bash
  ng generate component nom-du-composant
  ```
- **Construire le projet** :
  ```bash
  ng build
  ```
- **Exécuter les tests unitaires** :
  ```bash
  ng test
  ```

## Déploiement

Avant de déployer, génère une version optimisée de l'application Angular :
```bash
ng build --configuration=production
```
Le dossier `dist/` contiendra les fichiers prêts à être déployés.

Pour le backend, configure un serveur comme **Heroku, AWS, ou un VPS** et utilise :
```bash
npm run start:prod
```

## Ressources utiles

- [Documentation NestJS](https://docs.nestjs.com)
- [Documentation Angular](https://angular.dev/)
- [CLI Angular](https://angular.dev/tools/cli)

---

Ce projet est sous licence **MIT**. N'hésite pas à contribuer en proposant des améliorations ! 🚀

