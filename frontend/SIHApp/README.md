# SIH App - React Native Frontend

A modern React Native application built with TypeScript and the latest 2024 best practices.

## 🚀 Features

- **React Native 0.81** with Expo SDK 54
- **TypeScript 5.9** for full type safety
- **React Navigation 6** for navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **Modern UI** with responsive design

## 📱 Screens

- **Home Screen**: Main dashboard with backend status
- **Login Screen**: User authentication
- **Items Screen**: Browse and manage items
- **Profile Screen**: User profile management
- **Navigation**: Type-safe navigation throughout

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio / Xcode (for device testing)

### Setup
```bash
npm install
npm start
```

### Commands
- `npm start`: Start Expo development server
- `npm run android`: Run on Android device/emulator
- `npm run ios`: Run on iOS device/simulator
- `npm run web`: Run in web browser

## 📁 Project Structure

```
src/
├── navigation/     # Navigation configuration
├── screens/        # App screens
├── services/       # API service layer
├── types/          # TypeScript type definitions
└── components/     # Reusable UI components
```

## 🔧 Configuration

### API Configuration
Update `src/services/api.ts` to point to your backend:
```typescript
const API_BASE_URL = 'http://your-backend-url:8000';
```

### Environment Variables
Create a `.env` file for environment-specific configuration.

## 🎨 UI Design

The app follows modern mobile design principles:
- Clean, minimalist interface
- Consistent color scheme
- Responsive layouts
- Smooth animations
- Accessible components

## 🔐 Authentication

The app includes JWT-based authentication:
- Login/logout functionality
- Token storage with AsyncStorage
- Automatic token refresh
- Protected routes

## 📊 State Management

Currently uses React's built-in state management:
- `useState` for local state
- `useEffect` for side effects
- Context API for global state (future)

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📦 Building

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
expo build:android --release-channel production
expo build:ios --release-channel production
```

## 🚀 Deployment

### Expo Deployment
```bash
expo publish
```

### Standalone Apps
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)