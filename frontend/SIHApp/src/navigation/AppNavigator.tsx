/**
 * Navigation Configuration
 * React Navigation v6 with TypeScript
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { SportsGridScreen } from '../screens/SportsGridScreen';
import { SportDetailScreen } from '../screens/SportDetailScreen';
import { PushupAssessmentScreen } from '../screens/PushupAssessmentScreen';
import { AssessmentResultsScreen } from '../screens/AssessmentResultsScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import UsersScreen from '../screens/UsersScreen';
import UserDetailScreen from '../screens/UserDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'SIH App' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ 
            title: 'Profile Setup',
            headerStyle: {
              backgroundColor: '#3498DB',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="SportsGrid"
          component={SportsGridScreen}
          options={{ 
            title: 'Choose Your Sport',
            headerStyle: {
              backgroundColor: '#3498DB',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="SportDetail"
          component={SportDetailScreen}
          options={{ 
            title: 'Sport Assessment',
            headerStyle: {
              backgroundColor: '#27AE60',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="PushupAssessment"
          component={PushupAssessmentScreen}
          options={{ 
            title: 'Pushup Assessment',
            headerShown: false, // Hide header for full-screen camera view
          }}
        />
        <Stack.Screen
          name="AssessmentResults"
          component={AssessmentResultsScreen}
          options={{ 
            title: 'Assessment Results',
            headerStyle: {
              backgroundColor: '#3498DB',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
        <Stack.Screen
          name="Items"
          component={ItemsScreen}
          options={{ title: 'Items' }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={{ title: 'Item Details' }}
        />
        <Stack.Screen
          name="Users"
          component={UsersScreen}
          options={{ title: 'Users' }}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={{ title: 'User Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;