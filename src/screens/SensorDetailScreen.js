import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';

const { width } = Dimensions.get('window');

export default function SensorDetailScreen({ route, navigation }) {
    const { title, value, unit, icon, device } = route.params;

    const chartData = [
        { tanggal: '20 Jun', waktu: '22:00', nilai: (parseFloat(value) - 0.4).toFixed(1), tinggi: 45 },
        { tanggal: '20 Jun', waktu: '23:00', nilai: (parseFloat(value) - 0.2).toFixed(1), tinggi: 60 },
        { tanggal: '21 Jun', waktu: '00:00', nilai: (parseFloat(value) + 0.3).toFixed(1), tinggi: 85 },
        { tanggal: '21 Jun', waktu: '01:00', nilai: (parseFloat(value) - 0.1).toFixed(1), tinggi: 55 },
        { tanggal: '21 Jun', waktu: '01:35', nilai: parseFloat(value).toFixed(1), tinggi: 75 },
    ];

    const historyLogs = [
        { tanggal: '21 Jun', waktu: '01:35', data: value },
        { tanggal: '21 Jun', waktu: '01:30', data: (parseFloat(value) - 0.2).toFixed(1) },
        { tanggal: '21 Jun', waktu: '01:25', data: (parseFloat(value) + 0.1).toFixed(1) },
        { tanggal: '21 Jun', waktu: '01:20', data: (parseFloat(value) - 0.1).toFixed(1) },
    ];

    let yAxisLabels = ['100', '75', '50', '25', '0'];
    if (unit === '°C') {
        yAxisLabels = ['40', '38', '36', '34', '32'];
    } else if (unit === 'LxF') {
        yAxisLabels = ['600', '450', '300', '150', '0'];
    }

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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Parameter</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View style={styles.statusCard}>
                    <Image source={icon} style={styles.detailIconImage} resizeMode="contain" />
                    <Text style={styles.sensorTitle}>{title}</Text>
                    <Text style={styles.sensorValue}>{value} <Text style={styles.sensorUnit}>{unit}</Text></Text>
                    <Text style={styles.sensorDevice}>Hardware: {device}</Text>
                </View>

                <Text style={styles.sectionTitle}>Grafik Tren Telemetri</Text>
                <View style={styles.largeChartContainer}>
                    <View style={styles.chartMainWrapper}>
                        <View style={styles.yAxisWrapper}>
                            {yAxisLabels.map((label, i) => (
                                <Text key={i} style={styles.yAxisText}>{label}</Text>
                            ))}
                        </View>

                        <View style={styles.chartRightContent}>
                            <View style={styles.chartFrame}>
                                {chartData.map((item, index) => (
                                    <View key={index} style={styles.chartColGroup}>
                                        <Text style={styles.barValueTooltip}>{item.nilai}</Text>
                                        <View style={[styles.largeChartBar, { height: `${item.tinggi}%` }]} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.xAxisWrapper}>
                        <View style={{ width: 32 }} />
                        <View style={styles.xAxisLabelsRow}>
                            {chartData.map((item, index) => (
                                <View key={index} style={styles.xAxisContainer}>
                                    <Text style={styles.chartXDate}>{item.tanggal}</Text>
                                    <Text style={styles.chartXTime}>{item.waktu}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Log Riwayat Pengukuran</Text>
                <View style={styles.tableCard}>
                    <View style={styles.tableHeaderRow}>
                        <Text style={styles.tableHeadText}>Waktu Pengambilan</Text>
                        <Text style={[styles.tableHeadText, { textAlign: 'right' }]}>Nilai Terbaca</Text>
                    </View>
                    {historyLogs.map((log, index) => (
                        <View key={index} style={styles.tableDataRow}>
                            <View style={styles.timeCellWrapper}>
                                <Text style={styles.tableCellTime}>{log.tanggal} - {log.waktu} WIB</Text>
                            </View>
                            <Text style={styles.tableCellData}>{log.data} {unit}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EAEAEA',
    },
    backButton: { paddingVertical: 6 },
    backText: { fontFamily: 'Roboto_700Bold', color: '#F25C05', fontSize: 14 },
    headerTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1A1A1A' },
    scrollContainer: { padding: 24 },
    statusCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        elevation: 2,
    },
    detailIconImage: {
        width: 48,
        height: 48,
        marginBottom: 10,
    },
    sensorTitle: { fontFamily: 'Roboto_500Medium', fontSize: 15, color: '#888888' },
    sensorValue: { fontFamily: 'Roboto_700Bold', fontSize: 38, color: '#1A1A1A', marginTop: 4 },
    sensorUnit: { fontSize: 20, color: '#F25C05' },
    sensorDevice: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#999999', marginTop: 10, backgroundColor: '#F9F9F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    sectionTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#1A1A1A', marginBottom: 14 },
    largeChartContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingTop: 24, paddingBottom: 16, paddingHorizontal: 16, marginBottom: 24, elevation: 2 },
    chartMainWrapper: { flexDirection: 'row', height: 160, width: '100%' },
    yAxisWrapper: { width: 32, height: 135, justifyContent: 'space-between', alignItems: 'flex-start' },
    yAxisText: { fontFamily: 'Roboto_500Medium', fontSize: 11, color: '#A0AEC0' },
    chartRightContent: { flex: 1, height: 135, borderLeftWidth: 1.5, borderBottomWidth: 1.5, borderColor: '#E2E8F0', paddingLeft: 10 },
    chartFrame: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', width: '100%' },
    chartColGroup: { alignItems: 'center', flex: 1 },
    barValueTooltip: { fontFamily: 'Roboto_700Bold', fontSize: 10, color: '#F25C05', marginBottom: 4 },
    largeChartBar: { width: 14, backgroundColor: '#F25C05', borderTopLeftRadius: 4, borderTopRightRadius: 4, opacity: 0.85 },
    xAxisWrapper: { flexDirection: 'row', marginTop: 8, width: '100%' },
    xAxisLabelsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 10 },
    xAxisContainer: { alignItems: 'center', flex: 1 },
    chartXDate: { fontSize: 9, color: '#4A5568', fontFamily: 'Roboto_500Medium' },
    chartXTime: { fontSize: 9, color: '#A0AEC0', fontFamily: 'Roboto_400Regular', marginTop: 1 },
    tableCard: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, elevation: 2 },
    tableHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    tableHeadText: { fontFamily: 'Roboto_700Bold', fontSize: 12, color: '#666666' },
    tableDataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#FDFDFD' },
    timeCellWrapper: { flexDirection: 'row', alignItems: 'center' },
    tableCellTime: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#333333' },
    tableCellData: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#1A1A1A' },
});