import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

// --- 1. IMPORT FIRESTORE DB BERDASARKAN STRUKTUR FOLDER ANDA ---
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State untuk efek loading

    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    // --- 2. LOGIKA MENYIMPAN DATA REGISTRASI KE FIRESTORE ---
    const handleRegister = async () => {
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        // Validasi input kosong
        if (!cleanName || !cleanEmail || !cleanPassword) {
            Alert.alert('Error', 'Harap isi semua kolom form pendaftaran!');
            return;
        }

        // Validasi panjang password minimal (contoh: 6 karakter)
        if (cleanPassword.length < 6) {
            Alert.alert('Error', 'Kata sandi minimal harus terdiri dari 6 karakter.');
            return;
        }

        setLoading(true);

        try {
            const usersRef = collection(db, 'users');
            
            // Pengecekan: Apakah email sudah terdaftar sebelumnya?
            const q = query(usersRef, where('email', '==', cleanEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                Alert.alert('Gagal Daftar', 'Alamat email ini sudah terdaftar. Gunakan email lain.');
                setLoading(false);
                return;
            }

            // Simpan data user baru ke Firestore
            await addDoc(usersRef, {
                name: cleanName,
                email: cleanEmail,
                password: cleanPassword, // Catatan: Plain text, untuk produksi disarankan Firebase Auth
                createdAt: new Date().toISOString()
            });

            // Berhasil mendaftar
            Alert.alert('Sukses', 'Akun Anda berhasil dibuat!', [
                { text: 'Login Sekarang', onPress: () => navigation.navigate('Login') }
            ]);

            // Reset Form setelah sukses
            setName('');
            setEmail('');
            setPassword('');

        } catch (error) {
            console.error("Firestore Register Error: ", error);
            Alert.alert('Error', 'Terjadi kesalahan saat mendaftarkan akun. Silakan coba lagi.');
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
                {/* Header Bagian Atas */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.welcomeText}>Buat Akun</Text>
                    <Text style={styles.subWelcomeText}>untuk mengakses sistem inkubator cerdas</Text>
                </View>

                {/* Form Input */}
                <View style={styles.formContainer}>
                    {/* Input Nama Lengkap */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nama Lengkap</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan nama lengkap Anda"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                            editable={!loading} // Kunci form saat loading
                        />
                    </View>

                    {/* Input Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukkan email Anda"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Input Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Buat password baru"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Tombol Daftar dengan Loading State */}
                    <TouchableOpacity
                        style={[styles.registerButton, loading && { backgroundColor: '#FFA066' }]}
                        activeOpacity={0.85}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.registerButtonText}>Daftar</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer: Kembali ke Login */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Sudah memiliki akun? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                        <Text style={styles.loginLink}>Login di sini</Text>
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
    registerButton: {
        width: '100%',
        backgroundColor: '#F25C05',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#F25C05',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    registerButtonText: {
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
    loginLink: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 14,
        color: '#F25C05',
    },
});