import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- IMPORT FIREBASE AUTH DARI CONFIG ---
import { auth } from './src/config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Import halaman-halaman pendukung
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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // --- LOGIKA LISTENER SESI GLOBAL (MANAJEMEN SESI) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Mengisi state user jika ada sesi login aktif
      setIsLoading(false);  // Mematikan layar loading
    });

    return unsubscribe; // Membersihkan fungsi listener saat unmount
  }, []);

  // Menampilkan indikator loading saat aplikasi mengecek status autentikasi
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F25C05" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        // Auto-Login: Jika sesi user aktif langsung ke Dashboard, jika tidak mulai dari GetStarted
        initialRouteName={user ? "Dashboard" : "GetStarted"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="SensorDetail" component={SensorDetailScreen} />
        <Stack.Screen name="Weather" component={WeatherSystemScreen} />
        <Stack.Screen name="Log" component={LogScreen} />
        <Stack.Screen name="Harga" component={HargaScreen} />
        <Stack.Screen name="Tengkulak" component={TengkulakScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});