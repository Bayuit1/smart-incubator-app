import React, { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';

import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';



// --- IMPORT ASYNC STORAGE & CONFIG FIRESTORE ---

import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../config/firebaseConfig';

import { collection, query, where, getDocs } from 'firebase/firestore';



export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false); // State untuk animasi loading memutar



    let [fontsLoaded] = useFonts({

        Roboto_400Regular,

        Roboto_500Medium,

        Roboto_700Bold,

    });



    // --- LOGIKA MENGECEK DATA LOGIN KE FIRESTORE ---

    const handleLogin = async () => {

        const cleanEmail = email.trim().toLowerCase();

        const cleanPassword = password.trim();



        // Validasi input jika kosong

        if (!cleanEmail || !cleanPassword) {

            Alert.alert('Error', 'Silakan masukkan alamat email dan kata sandi Anda.');

            return;

        }



        setLoading(true);



        try {

            // Mencari dokumen di koleksi "users" yang kolom email-nya sama dengan input

            const usersRef = collection(db, 'users');

            const q = query(usersRef, where('email', '==', cleanEmail));

            const querySnapshot = await getDocs(q);



            // Jika email tidak ditemukan di database

            if (querySnapshot.empty) {

                Alert.alert('Gagal Masuk', 'Alamat email belum terdaftar.');

                setLoading(false);

                return;

            }



            let userData = null;

            querySnapshot.forEach((doc) => {

                userData = doc.data();

            });



            // Validasi kecocokan password teks polos (Plain Text)

            if (userData.password === cleanPassword) {

                // --- SIMPAN DATA SESI GLOBAL SECARA LOKAL ---

                await AsyncStorage.setItem('isLoggedIn', 'true');

                await AsyncStorage.setItem('userName', userData.name); // Nama ini yang akan dibaca di DashboardScreen



                Alert.alert('Sukses', 'Selamat datang kembali!', [

                    { text: 'Lanjut', onPress: () => navigation.replace('Dashboard') }

                ]);

            } else {

                Alert.alert('Gagal Masuk', 'Kata sandi yang Anda masukkan salah.');

            }



        } catch (error) {

            console.error("Firestore Login Error: ", error);

            Alert.alert('Error', 'Terjadi kesalahan jaringan atau masalah pada database.');

        } finally {

            setLoading(false);

        }

    };



    if (!fontsLoaded) {

        return null;

    }



    return (

        <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

            style={styles.container}

        >

            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />



            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.headerContainer}>

                    <Image

                        source={require('../../assets/logo.png')}

                        style={styles.logoImage}

                        resizeMode="contain"

                    />

                    <Text style={styles.welcomeText}>Selamat Datang Kembali!</Text>

                    <Text style={styles.subWelcomeText}>Silakan masuk untuk memantau inkubator Anda.</Text>

                </View>



                <View style={styles.formContainer}>

                    {/* Input Email */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.inputLabel}>Alamat Email</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="Masukkan email Anda"

                            placeholderTextColor="#999"

                            value={email}

                            onChangeText={setEmail}

                            keyboardType="email-address"

                            autoCapitalize="none"

                            editable={!loading} // Kunci input saat sedang loading

                        />

                    </View>



                    {/* Input Password */}

                    <View style={styles.inputGroup}>

                        <Text style={styles.inputLabel}>Kata Sandi</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="Masukkan kata sandi"

                            placeholderTextColor="#999"

                            value={password}

                            onChangeText={setPassword}

                            secureTextEntry

                            autoCapitalize="none"

                            editable={!loading} // Kunci input saat sedang loading

                        />

                    </View>



                    {/* TOMBOL MASUK DENGAN LOADING INDICATOR */}

                    <TouchableOpacity

                        style={[styles.loginButton, loading && { backgroundColor: '#FFA066' }]}

                        activeOpacity={0.85}

                        onPress={handleLogin}

                        disabled={loading}

                    >

                        {loading ? (

                            <ActivityIndicator color="#FFFFFF" size="small" />

                        ) : (

                            <Text style={styles.loginButtonText}>Masuk</Text>

                        )}

                    </TouchableOpacity>

                </View>



                {/* Footer Link Pendaftaran */}

                <View style={styles.footerContainer}>

                    <Text style={styles.footerText}>Belum memiliki akun? </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>

                        <Text style={styles.registerLink}>Daftar Sekarang</Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </KeyboardAvoidingView>

    );

}



const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#FFFFFF',

    },

    scrollContainer: {

        flexGrow: 1,

        justifyContent: 'center',

        paddingHorizontal: 28,

        paddingVertical: 40,

    },

    headerContainer: {

        alignItems: 'center',

        marginBottom: 35,

    },

    logoImage: {

        width: 90,

        height: 90,

        marginBottom: 16,

    },

    welcomeText: {

        fontFamily: 'Roboto_700Bold',

        fontSize: 24,

        color: '#1A1A1A',

        marginBottom: 6,

        textAlign: 'center',

    },

    subWelcomeText: {

        fontFamily: 'Roboto_400Regular',

        fontSize: 14,

        color: '#666666',

        lineHeight: 20,

        textAlign: 'center',

    },

    formContainer: {

        width: '100%',

    },

    inputGroup: {

        marginBottom: 20,

    },

    inputLabel: {

        fontFamily: 'Roboto_500Medium',

        fontSize: 14,

        color: '#333333',

        marginBottom: 8,

    },

    input: {

        width: '100%',

        backgroundColor: '#F9F9F9',

        borderWidth: 1,

        borderColor: '#E0E0E0',

        borderRadius: 12,

        paddingHorizontal: 16,

        paddingVertical: 14,

        fontSize: 15,

        fontFamily: 'Roboto_400Regular',

        color: '#1A1A1A',

    },

    loginButton: {

        width: '100%',

        backgroundColor: '#F25C05',

        paddingVertical: 16,

        borderRadius: 12,

        marginTop: 10,

        alignItems: 'center',

        shadowColor: '#F25C05',

        shadowOffset: { width: 0, height: 4 },

        shadowOpacity: 0.2,

        shadowRadius: 6,

        elevation: 4,

    },

    loginButtonText: {

        fontFamily: 'Roboto_700Bold',

        fontSize: 16,

        color: '#FFFFFF',

        letterSpacing: 0.5,

    },

    footerContainer: {

        flexDirection: 'row',

        justifyContent: 'center',

        alignItems: 'center',

        marginTop: 40,

    },

    footerText: {

        fontFamily: 'Roboto_400Regular',

        fontSize: 14,

        color: '#666666',

    },

    registerLink: {

        fontFamily: 'Roboto_700Bold',

        fontSize: 14,

        color: '#F25C05',

    },

});