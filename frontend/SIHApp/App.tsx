/**
 * SIH App - React Native TypeScript with FastAPI Backend
 * Latest 2024 patterns and best practices
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
