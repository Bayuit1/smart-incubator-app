import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

export default function SkeletonCard() {
    // 1. Inisialisasi nilai animasi awal (opacity 0.4)
    const fadeAnim = useRef(new Animated.Value(0.4)).current;

    // 2. Jalankan animasi looping saat komponen dimuat
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1, // Berubah menjadi terang (opacity 1)
                    duration: 800, // Kecepatan transisi dalam milidetik
                    useNativeDriver: true, // Menggunakan Native Driver untuk performa aplikasi yang lebih mulus
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.4, // Kembali meredup (opacity 0.4)
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        // 3. Ubah tag View terluar menjadi Animated.View dan masukkan style fadeAnim
        <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim }]}>
            <View style={styles.topRowLayout}>
                <View style={styles.circlePlaceholder} />
                <View style={styles.badgePlaceholder} />
            </View>
            <View style={styles.linePlaceholderShort} />
            <View style={styles.linePlaceholderLong} />
            <View style={styles.chartPlaceholder} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    skeletonCard: {
        backgroundColor: '#EAEFF5', 
        width: (width - 64) / 2, // Mengikuti ukuran grid/kartu Anda
        height: 150,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        // Hapus opacity statis di sini karena sekarang diatur dinamis oleh fadeAnim
    },
    topRowLayout: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%' 
    },
    circlePlaceholder: { 
        width: 26, 
        height: 26, 
        borderRadius: 13, 
        backgroundColor: '#CBD5E1' 
    },
    badgePlaceholder: { 
        width: 45, 
        height: 15, 
        borderRadius: 6, 
        backgroundColor: '#CBD5E1' 
    },
    linePlaceholderShort: { 
        width: '60%', 
        height: 12, 
        borderRadius: 4, 
        backgroundColor: '#CBD5E1', 
        marginTop: 16 
    },
    linePlaceholderLong: { 
        width: '40%', 
        height: 20, 
        borderRadius: 4, 
        backgroundColor: '#CBD5E1', 
        marginTop: 6 
    },
    chartPlaceholder: { 
        width: '100%', 
        height: 30, 
        borderRadius: 6, 
        backgroundColor: '#CBD5E1', 
        marginTop: 16 
    }
});