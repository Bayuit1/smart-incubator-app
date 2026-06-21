import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function SkeletonCard() {
    return (
        <View style={styles.skeletonCard}>
            <View style={styles.topRowLayout}>
                <View style={styles.circlePlaceholder} />
                <View style={styles.badgePlaceholder} />
            </View>
            <View style={styles.linePlaceholderShort} />
            <View style={styles.linePlaceholderLong} />
            <View style={styles.chartPlaceholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    skeletonCard: {
        backgroundColor: '#EAEFF5', // Warna abu-abu dasar pemuatan data
        width: (width - 64) / 2,
        height: 150,
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        opacity: 0.6
    },
    topRowLayout: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    circlePlaceholder: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#CBD5E1' },
    badgePlaceholder: { width: 45, height: 15, borderRadius: 6, backgroundColor: '#CBD5E1' },
    linePlaceholderShort: { width: '60%', height: 12, borderRadius: 4, backgroundColor: '#CBD5E1', marginTop: 16 },
    linePlaceholderLong: { width: '40%', height: 20, borderRadius: 4, backgroundColor: '#CBD5E1', marginTop: 6 },
    chartPlaceholder: { width: '100%', height: 30, borderRadius: 6, backgroundColor: '#CBD5E1', marginTop: 16 }
});