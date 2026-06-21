import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Animated } from 'react-native'; // Tambahkan Animated

const { width } = Dimensions.get('window');

export default function SensorCard({ icon, label, value, unit, device, historyData, onPress }) {
    // 1. Inisialisasi nilai opacity dan posisi vertikal untuk animasi
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current; // Mulai dari 30 piksel di bawah

    useEffect(() => {
        // 2. Jalankan animasi fade-in dan slide-up secara bersamaan saat komponen dimuat
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500, // Durasi 0.5 detik
                useNativeDriver: true, // Memaksa komputasi berjalan di hardware acceleration HP
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        // 3. Ubah TouchableOpacity atau View terluar menjadi Animated.View
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
                <View style={styles.cardTopRow}>
                    <Image source={icon} style={styles.cardIconImage} resizeMode="contain" />
                    <Text style={styles.cardDevice}>{device}</Text>
                </View>

                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardValue}>
                    {value} <Text style={styles.cardUnit}>{unit}</Text>
                </Text>

                <View style={styles.chartContainer}>
                    {historyData.map((val, index) => (
                        <View key={index} style={[styles.chartBar, { height: `${val}%` }]} />
                    ))}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        width: (width - 64) / 2,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    cardIconImage: { width: 26, height: 26 },
    cardDevice: { fontFamily: 'Roboto_700Bold', fontSize: 9, color: '#F25C05', backgroundColor: '#FFF0E6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    cardLabel: { fontFamily: 'Roboto_500Medium', fontSize: 13, color: '#888888', marginTop: 12 },
    cardValue: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: '#1A1A1A', marginTop: 2 },
    cardUnit: { fontSize: 14, fontFamily: 'Roboto_500Medium', color: '#666666' },
    chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 35, marginTop: 14, paddingHorizontal: 2, width: '100%' },
    chartBar: { width: 6, backgroundColor: '#F25C05', borderRadius: 3, opacity: 0.7 },
});