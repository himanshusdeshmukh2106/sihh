# SIH App Installation Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd frontend/SIHApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   If you encounter dependency conflicts, try:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For web: `npm run web`

## Troubleshooting

### Dependency Conflicts

If you see ERESOLVE errors, try:
```bash
npm install --legacy-peer-deps --force
```

### Camera Permissions

Make sure to grant camera permissions when prompted on your device.

### Metro Bundle Issues

If you encounter Metro bundler issues:
```bash
npx expo start --clear
```

### Android Build Issues

If Android build fails:
1. Make sure Android Studio is installed
2. Set up Android SDK
3. Create an Android Virtual Device (AVD)

### iOS Build Issues (macOS only)

If iOS build fails:
1. Make sure Xcode is installed
2. Install iOS Simulator
3. Run `npx pod-install` in the ios directory if it exists

## Features Implemented

✅ **Core Navigation**
- Home screen
- Sports selection grid
- Sport detail configuration
- Pushup assessment screen
- Results display

✅ **Pushup Assessment**
- Camera integration with permissions
- Mock pose detection system
- Real-time feedback and counting
- Session controls (start/pause/stop)
- Performance metrics

✅ **Data Management**
- Local storage with AsyncStorage
- Assessment history
- User statistics
- Progress tracking

✅ **Error Handling**
- Comprehensive error boundaries
- Graceful fallbacks
- Performance monitoring
- User-friendly error messages

## Development Notes

- The current implementation uses a **mock pose detection system** for demonstration
- For production, you would need to integrate actual computer vision libraries like:
  - MediaPipe (recommended for React Native)
  - TensorFlow Lite
  - Custom pose detection models

- The app is designed to work with Expo managed workflow
- All camera processing happens locally on the device
- No external API calls are required for the core functionality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── CameraView.tsx  # Camera component
│   ├── PoseOverlay.tsx # Pose visualization
│   └── ErrorBoundary.tsx
├── screens/            # Screen components
├── services/           # Business logic services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types.ts            # TypeScript definitions
└── navigation/         # Navigation configuration
```

## Next Steps for Production

1. **Replace Mock Detection**: Integrate real pose detection library
2. **Add Authentication**: Implement user login/registration
3. **Cloud Sync**: Add backend API for data synchronization
4. **Enhanced Analytics**: Add detailed performance analytics
5. **Multiple Exercises**: Extend beyond pushups to other exercises
6. **Social Features**: Add sharing and competition features