# StreamVerse

StreamVerse is a full-stack streaming companion that pairs an Expo-powered mobile experience with an Express/TypeScript API. The app curates trending movies, music, and podcasts, lets users build favourites, and keeps profile data (including Cloudinary-hosted avatars) in sync with a MongoDB backend.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Data and State Flow](#data-and-state-flow)
- [Testing and Quality](#testing-and-quality)
- [Troubleshooting](#troubleshooting)

## Overview

The client is an Expo Router application that targets iOS, Android, and web. Redux Toolkit slices coordinate authentication, catalogue ingestion, and favourite management, while AsyncStorage keeps tokens available between launches. The server is a stateless REST API that issues JWTs, persists users and favourites in MongoDB, and stores profile avatars in Cloudinary.

## Features

- **Cross-platform app**: Expo Router navigation with tabbed browsing (Home, Search, Favourites, Profile) and detail screens for movies, music, and podcasts.
- **Curated catalogue**: Aggregates data from TMDB, iTunes, and Listen Notes, normalizing them into a single item model with genre metadata.
- **Authentication and profile management**: Email/username-based sign up + login, profile updates, avatar uploads, and account deletion backed by JWT auth.
- **Favourites sync**: Persist favourites on the API, keep Redux state in sync, and surface the status across cards and lists.
- **Theming and UI polish**: Glassmorphism-inspired gradients, neon buttons, and a theme context that centralizes color usage.
- **Cloud-ready backend**: Health checks, structured error handling, and secure credential management via environment variables.

## Tech Stack

- **Mobile client**: Expo 54, React Native 0.81, Expo Router, Redux Toolkit, React Navigation, AsyncStorage, TypeScript.
- **Server**: Express 5, TypeScript, ts-node-dev, Mongoose, JWT, bcrypt, Cloudinary SDK, Listen Notes/Podcast API helpers.

## Repository Layout

```text
StreamVerse/
├── client/    # Expo app (screens in app/, state in src/)
└── server/    # Express + MongoDB API written in TypeScript
```

## Requirements

- Node.js 18+ and npm (or yarn/pnpm) installed locally.
- Expo CLI (`npm install -g expo-cli`) for the best developer experience.
- Access to a MongoDB deployment (Atlas or local).
- Cloudinary account for avatar storage.
- Listen Notes API key and TMDB API key for content ingestion.
- iOS Simulator, Android Emulator, or physical devices with Expo Go installed.

## Environment Variables

Define your variables before running either project.

### Client (`client/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | Recommended | Base URL for the Express API. Defaults to `http://localhost:4000`, but set this when testing on a device. |
| `EXPO_PUBLIC_TMDB_API_KEY` | Yes | API key used to pull trending movies from TMDB. |
| `EXPO_PUBLIC_LISTEN_NOTES_API_KEY` | Yes | API key for Listen Notes to fetch top podcasts. |

Example:

```bash
# client/.env
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000
EXPO_PUBLIC_TMDB_API_KEY=tmdb_key_here
EXPO_PUBLIC_LISTEN_NOTES_API_KEY=listen_notes_key_here
```

### Server (`server/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port, defaults to `4000`. |
| `MONGODB_URI` | Yes | Connection string for MongoDB. |
| `JWT_SECRET` | Recommended | Secret used to sign auth tokens (falls back to `change-this-secret`). |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`). |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud identifier. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret. |
| `CLOUDINARY_UPLOAD_FOLDER` | No | Folder prefix for assets (defaults to `streamverse`). |

Example:

```bash
# server/.env
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-string
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=abc123
CLOUDINARY_API_SECRET=xyz789
CLOUDINARY_UPLOAD_FOLDER=streamverse
```

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/JalinaH/StreamVerse.git
cd StreamVerse

# Client deps
cd client
npm install

# Server deps
cd ../server
npm install
```

### 2. Configure environment

Create the `.env` files shown above (`client/.env` and `server/.env`).

### 3. Run the API

```bash
cd server
npm run dev
```

- Builds the TypeScript sources in memory and runs the API with `ts-node-dev`.
- Visit `http://localhost:4000/health` to confirm the server is live.

### 4. Run the mobile app

```bash
cd client
npx expo start
```

- Press `i` for iOS Simulator, `a` for Android Emulator, `w` for web, or scan the QR code using Expo Go.
- Make sure `EXPO_PUBLIC_API_URL` points to an address reachable from the device (e.g., your machine's LAN IP).

## Available Scripts

### Client (`client/`)

| Command | Description |
| --- | --- |
| `npm start` | Launch Expo dev tools (metro bundler + QR code). |
| `npm run android` | Start the app directly on an Android emulator/device. |
| `npm run ios` | Start the app on the iOS simulator. |
| `npm run web` | Run the project in a web browser. |
| `npm run lint` | Run ESLint via `expo lint`. |
| `npm run reset-project` | Replace the current `app/` directory with a blank Expo template. |

### Server (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with `ts-node-dev` and live reload. |
| `npm run build` | Emit compiled JavaScript into `dist/`. |
| `npm start` | Run the compiled server from `dist/`. |

## API Overview

Protected routes require a `Bearer <token>` header from the login/register response.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe. |
| `POST` | `/api/auth/register` | Create a new user account. |
| `POST` | `/api/auth/login` | Exchange credentials for a JWT + profile payload. |
| `GET` | `/api/profile/me` | Fetch the authenticated user profile. |
| `PUT` | `/api/profile` | Update profile fields and upload avatar imagery (base64). |
| `DELETE` | `/api/profile` | Permanently delete the current account. |
| `GET` | `/api/favourites` | Retrieve all saved favourites for the user. |
| `POST` | `/api/favourites` | Save or update a favourite item. |
| `DELETE` | `/api/favourites/:itemId` | Remove a favourite by `itemId`. |

## Data and State Flow

- **Catalogue ingestion**: `dataSlice.fetchData` fans out to TMDB (movies), iTunes Search (music), and Listen Notes (podcasts), mapping every payload to a common `Item` model with genre annotations.
- **Authentication**: `authSlice` wraps the `/api/auth` endpoints, persists tokens and user profiles to AsyncStorage, and exposes profile update/delete thunks.
- **Favourites**: `favouritesSlice` mirrors backend state. Actions optimistically sync UI state after successful POST/DELETE calls.
- **Profile media**: Avatar uploads are sent as base64 strings, then stored and versioned in Cloudinary via the API utilities.
- **Navigation & UI**: Expo Router files in `client/app/` drive the tabbed layout, while shared UI primitives (glass view, gradients, neon buttons) live under `client/src/components`.

## Testing and Quality

- Automated tests are not yet implemented. The `server` package ships with a placeholder npm script, and the client currently relies on manual regression.
- Run `npm run lint` from `client/` to catch common issues.
- Recommended: add integration tests around the Express routes and unit tests for Redux slices before shipping to production.

## Troubleshooting

- **Expo app cannot reach the API**: Ensure the server is running on a reachable IP and set `EXPO_PUBLIC_API_URL` to `http://<your-ip>:4000` (Expo defaults to localhost, which devices cannot access).
- **MongoDB connection failures**: Double-check `MONGODB_URI`, IP safelists in Atlas, and that your network allows outbound connections on port 27017.
- **Cloudinary errors**: Verify each `CLOUDINARY_*` variable and confirm the configured folder exists or that your account has rights to create it.
- **Missing Listen Notes/TMDB keys**: The catalogue fetch will reject without these keys; populate them before starting the client.

Happy streaming!
