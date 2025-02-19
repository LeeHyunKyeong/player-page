import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import * as Font from 'expo-font';

import PlayerPage from './pages/player-page';
import KaKaoLoginPage from './pages/kakaologin-page';
import MainPage from './pages/main-page';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    Font.loadAsync({
      WantedSansRegular: require('./assets/font/WantedSans-Regular.ttf'),
      WantedSansSemiBold: require('./assets/font/WantedSans-SemiBold.ttf'),
      WantedSansBold: require('./assets/font/WantedSans-Bold.ttf'),
    });
  }, []);

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainPage} />
          <Stack.Screen name="KaKaoLogin" component={KaKaoLoginPage} />
          <Stack.Screen name="Player" component={PlayerPage} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D0F',
  },
});