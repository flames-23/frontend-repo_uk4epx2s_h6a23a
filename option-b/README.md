# Agrawal Frankie Food App (Option B)

This folder contains a complete React Native (Expo + TypeScript) mobile app and a Node.js (Express + TypeScript) backend ready for production.

Structure
- frontend/ — Expo + TypeScript app with nativewind, React Navigation, Zustand, Socket.IO, Maps
- backend/ — Express + TypeScript api with Mongoose, JWT auth, Socket.IO, Cloudinary, Stripe, Docker, seed, tests

Getting Started
1) Backend
- Copy backend/.env.example to backend/.env
- docker-compose up --build (starts MongoDB & API)
- npm run -w backend seed (optional) or from backend folder: npm run seed

2) Mobile app
- Copy frontend/.env.example to frontend/.env and set API_URL=http://localhost:4000
- npm install in frontend
- npm run start in frontend, then open iOS/Android

Docs
- See backend README and frontend README inside their folders for environment variables and integration notes (FCM, Cloudinary, Stripe).

Postman
- Import backend/src/postman/Agrawal-Frankie.postman_collection.json

