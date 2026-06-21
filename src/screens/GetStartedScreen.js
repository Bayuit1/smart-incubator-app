import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function GetStartedScreen({ navigation }) {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Mengatur StatusBar agar menyatu dengan warna background */}
            <StatusBar barStyle="light-content" backgroundColor="#F25C05" translucent />

            {/* Konten Atas & Tengah (Logo + Judul) */}
            <View style={styles.topContent}>
                <View style={styles.logoOuterRing}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <Text style={styles.brandName}>E-NDOG</Text>
                <Text style={styles.systemDescription}>Smart Incubator & Hatchery System</Text>
            </View>

            {/* Konten Bawah (Tombol) */}
            <View style={styles.bottomContent}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F25C05',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        alignSelf: 'stretch', // Memaksa kontainer utama melebar penuh menutupi sisa layar putih
    },
    topContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 40, // Memberikan jarak dari batas atas status bar
    },
    logoOuterRing: {
        padding: 8,
        borderRadius: 99,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginBottom: 24,
    },
    logoWrapper: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    logoImage: {
        width: 130,
        height: 130,
    },
    brandName: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 50,
        color: '#FFFFFF',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    systemDescription: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 14,
        color: '#F2A505',
        textAlign: 'center',
        marginTop: 4,
        letterSpacing: 0.5,
    },
    bottomContent: {
        width: '100%',
        paddingHorizontal: 32,
        paddingBottom: 60, // Mengunci posisi tombol agar pas di bawah layout
    },
    button: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 16,
        color: '#F25C05',
        letterSpacing: 0.5,
    },
});