/**
 * Tree Selling App
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import UserTypeScreen from './src/screens/UserTypeScreen';
import MapScreen from './src/screens/MapScreen';

export type RootStackParamList = {
  UserType: undefined;
  MapScreen: {
    userType: 'buyer' | 'seller';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="UserType" 
              component={UserTypeScreen} 
              options={{ title: 'Welcome' }}
            />
            <Stack.Screen 
              name="MapScreen" 
              component={MapScreen} 
              options={{ title: 'Select Location' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
