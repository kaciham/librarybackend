# Projet - Backend d'un site de notation de livres

## Description
Ce projet est une application web qui permet aux utilisateurs de gérer des livres. Les utilisateurs peuvent créer, lire, mettre à jour, supprimer et noter des livres. L'application prend également en charge le téléchargement d'images pour les couvertures de livres, qui sont optimisées et converties au format WebP pour de meilleures performances.

## Fonctionnalités
- Création, lecture, mise à jour et suppression de livres.
- Téléchargement et optimisation des images de couverture des livres.
- Conversion des images téléchargées au format WebP.
- Notation des livres et calcul des notes moyennes.
- Récupération des livres par les meilleures notes.

## Technologies utilisées
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB
- **Traitement des images** : Multer, Sharp
- **Authentification** : JSON Web Tokens (JWT)

## Installation

1. Clonez le dépôt :
   git clone https://github.com/kaciham/librarybackend.git
   cd projet7

    2 Installez les dépendances
   npm install

   3 Configurez les variables d'environnement : Créez un fichier  .env à la racine du projet (exemple sur .env.github) et ajoutez les lignes suivantes :

   # URL de connexion à votre base de données MongoDB
DATABASE_CONNEXION=votre_url_de_connexion_mongodb

# Clé secrète pour la génération et la vérification des tokens JWT
ACCESS_TOKEN_SECRET=votre_secret_access_token

# Clé secrète pour les tokens de rafraîchissement
REFRESH_TOKEN_SECRET=votre_secret_refresh_token

# Port sur lequel le serveur écoute
PORT=4000

   4 Démarrez le serveur :
   npm run start
 
 #  Points de terminaison de l'API
Utilisateurs
POST /auth/signup : Inscription d'un nouvel utilisateur.
POST /auth/login : Connexion d'un utilisateur et génération d'un token JWT.

Livres
GET /books : Récupérer tous les livres.
GET /books/:id : Récupérer un livre par son ID.
POST /books : Créer un nouveau livre (nécessite une authentification).
PUT /books/:id : Mettre à jour un livre par son ID (nécessite une authentification).
DELETE /books/:id : Supprimer un livre par son ID (nécessite une authentification).
Notes
POST /books/:id/rate : Noter un livre (nécessite une authentification).

Livres par meilleures notes
GET /books/best-rating : Récupérer les 3 livres avec les meilleures notes.

# Téléchargement d'images

Les images sont téléchargées à l'aide de Multer et stockées dans le répertoire "uploads"    .
Les images téléchargées sont optimisées et converties au format WebP à l'aide de Sharp.