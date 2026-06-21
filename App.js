import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import halaman-halaman yang sudah kita buat
import GetStartedScreen from './src/screens/GetStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SensorDetailScreen from './src/screens/SensorDetailScreen';
import WeatherSystemScreen from './src/screens/WeatherScreen';
import LogScreen from './src/screens/LogScreen';
import HargaScreen from './src/screens/HargaScreen';
import TengkulakScreen from './src/screens/TengkulakScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{ headerShown: false }} // Menyembunyikan header bawaan yang kaku
      >
        {/* Daftarkan halaman Get Started */}
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />

        {/* Daftarkan halaman Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Daftarkan halaman Register */}
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Daftarkan halaman Dashboard */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        {/* Daftarkan halaman Detail Sensor */}
        <Stack.Screen name="SensorDetail" component={SensorDetailScreen} />

        {/* Daftarkan halaman Weather System */}
        <Stack.Screen name="Weather" component={WeatherSystemScreen} />

        {/* Daftarkan halaman Log */}
        <Stack.Screen name="Log" component={LogScreen} />

        {/* Daftarkan halaman Harga */}
        <Stack.Screen name="Harga" component={HargaScreen} />

        {/* Daftarkan halaman Tengkulak */}
        <Stack.Screen name="Tengkulak" component={TengkulakScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}