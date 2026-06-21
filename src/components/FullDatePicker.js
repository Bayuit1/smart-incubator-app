import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FullDatePicker({ selectedDate, onDateChange }) {
    const [modalVisible, setModalVisible] = useState(false);

    // Generator data array tanggal (1 - 31)
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // Data nama bulan standar Indonesia
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Data rentang tahun inkubator operasional
    const years = [2024, 2025, 2026, 2027];

    const handleSelect = (type, value) => {
        onDateChange({ ...selectedDate, [type]: value });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Filter Pengamatan Global</Text>

            <TouchableOpacity
                style={styles.pickerTriggerButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.pickerTriggerText}>
                    📅 {selectedDate.day} {selectedDate.month} {selectedDate.year}
                </Text>
                <Text style={styles.changeText}>Ubah</Text>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>

                        <Text style={styles.modalHeaderTitle}>Pilih Waktu Log</Text>

                        <View style={styles.columnsWrapper}>

                            <View style={styles.columnGroup}>
                                <Text style={styles.columnLabel}>Tgl</Text>
                                <ScrollView showsVerticalScrollIndicator={false} style={styles.columnScroll}>
                                    {days.map((d) => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[styles.itemRow, selectedDate.day === d && styles.itemRowActive]}
                                            onPress={() => handleSelect('day', d)}
                                        >
                                            <Text style={[styles.itemText, selectedDate.day === d && styles.itemTextActive]}>{d}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.columnGroupLines}>
                                <Text style={styles.columnLabel}>Bulan</Text>
                                <ScrollView showsVerticalScrollIndicator={false} style={styles.columnScroll}>
                                    {months.map((m) => (
                                        <TouchableOpacity
                                            key={m}
                                            style={[styles.itemRow, selectedDate.month === m && styles.itemRowActive]}
                                            onPress={() => handleSelect('month', m)}
                                        >
                                            <Text style={[styles.itemText, selectedDate.month === m && styles.itemTextActive]}>{m}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.columnGroup}>
                                <Text style={styles.columnLabel}>Tahun</Text>
                                <ScrollView showsVerticalScrollIndicator={false} style={styles.columnScroll}>
                                    {years.map((y) => (
                                        <TouchableOpacity
                                            key={y}
                                            style={[styles.itemRow, selectedDate.year === y && styles.itemRowActive]}
                                            onPress={() => handleSelect('year', y)}
                                        >
                                            <Text style={[styles.itemText, selectedDate.year === y && styles.itemTextActive]}>{y}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                        </View>

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setModalVisible(false)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.closeModalButtonText}>Terapkan Waktu</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20, paddingHorizontal: 24 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#4A5568', marginBottom: 10 },
    pickerTriggerButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
    },
    pickerTriggerText: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#2D3748' },
    changeText: { fontFamily: 'Roboto_700Bold', fontSize: 12, color: '#F25C05' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        width: width - 48,
        height: height * 0.48,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        elevation: 10,
    },
    modalHeaderTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1A1A1A', marginBottom: 16 },
    columnsWrapper: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    columnGroup: { flex: 1, backgroundColor: '#FFFFFF' },
    columnGroupLines: { flex: 1.4, backgroundColor: '#FFFFFF', borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E2E8F0' },
    columnLabel: { fontFamily: 'Roboto_700Bold', fontSize: 11, color: '#A0AEC0', textAlign: 'center', paddingVertical: 6, backgroundColor: '#F7FAFC', borderBottomWidth: 1, borderColor: '#E2E8F0' },
    columnScroll: { flex: 1 },
    itemRow: { width: '100%', paddingVertical: 10, alignItems: 'center' },
    itemRowActive: { backgroundColor: '#FFF0E6' },
    itemText: { fontFamily: 'Roboto_500Medium', fontSize: 13, color: '#4A5568' },
    itemTextActive: { color: '#F25C05', fontFamily: 'Roboto_700Bold' },
    closeModalButton: { backgroundColor: '#F25C05', width: '100%', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    closeModalButtonText: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#FFFFFF' },
});