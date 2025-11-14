# Agrawal Frankie Mobile App (Expo)

Features
- React Native (Expo + TypeScript)
- nativewind (Tailwind-style utilities)
- React Navigation (stack)
- Zustand for global state (cart, auth)
- Socket.IO client for real-time orders
- React Native Maps for branches & delivery tracking
- Offline persistence for cart and last seen menu

Setup
1. Copy .env.example to .env and set API_URL=http://localhost:4000
2. npm install
3. npm run start

Notes
- iOS: requires CocoaPods install for maps. Android: include Google Maps API key in manifest as per docs.
- Reanimated requires babel plugin already set.
