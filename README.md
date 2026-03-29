# ViaOptima - Optimisation de Tournées de Livraison

ViaOptima est une plateforme intelligente permettant d'optimiser les parcours de livraison pour les livreurs tout en offrant un suivi en temps réel pour les clients.

## Architecture du Projet

Le projet est divisé en deux parties principales :
- **Frontend** : Application React avec Vite, Tailwind CSS et Shadcn UI.
- **Backend** : Configuration Supabase (Base de données PostgreSQL, Auth, Policies).

## Fichiers Essentiels à Comprendre

Pour bien maîtriser ce projet, voici les fichiers clés :

1.  **`package.json`** : Gère les dépendances (React, Supabase, Tailwind) et les scripts de démarrage.
2.  **`src/main.tsx`** : Point d'entrée React qui lance l'application.
3.  **`src/App.tsx`** : Composant racine qui gère la structure globale et le routage des pages.
4.  **`src/integrations/supabase/client.ts`** : Initialise la connexion avec votre base de données Supabase.
5.  **`src/hooks/useAuth.tsx`** : Gère toute la logique d'authentification (connexion, déconnexion, session utilisateur).
6.  **`src/pages/`** : Contient les différentes pages de l'application (Dashboard, Login, Signup).
7.  **`backend/migrations/`** : Contient les scripts SQL définissant la structure de votre base de données.
8.  **`.env`** : Contient vos clés secrètes Supabase (URL et Clé API).
9.  **`tailwind.config.ts`** : Définit le système de design et les thèmes de couleurs.

## Comment Lancer le Projet

1.  Installer les dépendances : `npm install`
2.  Lancer le serveur de développement : `npm run dev`
