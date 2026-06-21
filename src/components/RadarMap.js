import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// Tambahkan prop dataMitra untuk menangkap data dari TengkulakScreen
export default function RadarMap({ dataMitra = [], selectedTengkulak, onSelectTengkulak }) {
    
    // Mengubah array objek dari React Native menjadi string JSON agar bisa dibaca oleh JavaScript di dalam WebView
    const dataMitraJSON = JSON.stringify(dataMitra);

    const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #F5F7FA; }
        #map { height: 100%; width: 100%; }
        .leaflet-control-attribution { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(map);

        // Kordinat Pusat Inkubator
        var inkubatorCoords = [-7.4478, 112.7183];
        var allPoints = [inkubatorCoords];

        // 1. Marker Inkubator E-NDOG (Titik Pusat Utama)
        L.circleMarker(inkubatorCoords, {
          color: '#F25C05',
          fillColor: '#F25C05',
          fillOpacity: 0.85,
          radius: 9,
          weight: 3
        }).addTo(map);

        // 2. Menerima data dinamis dari React Native
        var mitraList = ${dataMitraJSON};
        var activeId = "${selectedTengkulak}";

        // 3. Looping untuk membuat marker sebanyak jumlah data dari API
        mitraList.forEach(function(mitra) {
            var coords = [mitra.latitude, mitra.longitude];
            allPoints.push(coords); // Simpan koordinat untuk keperluan auto-zoom nanti

            // Menentukan warna dan ukuran berdasarkan status seleksi
            var isSelected = String(mitra.id) === String(activeId);
            var pinColor = isSelected ? '#F2A505' : '#64748B';
            var pinRadius = isSelected ? 11 : 7;

            var marker = L.circleMarker(coords, {
                color: pinColor,
                fillColor: pinColor,
                fillOpacity: 0.9,
                radius: pinRadius,
                weight: 2
            }).addTo(map);

            // Menambahkan event klik untuk mengirim ID kembali ke React Native
            marker.on('click', function() { 
                window.ReactNativeWebView.postMessage(String(mitra.id)); 
            });
        });

        // 4. OTOMATIS LOCK DI TENGAH BERDASARKAN SELURUH ALAMAT MARKER
        if (allPoints.length > 0) {
            var bounds = L.latLngBounds(allPoints);
            map.fitBounds(bounds, { padding: [30, 30] });
        }
      </script>
    </body>
    </html>
  `;

    return (
        <View style={styles.mapContainer}>
            <WebView
                originWhitelist={['*']}
                source={{ html: leafletHTML }}
                style={styles.map}
                onMessage={(event) => {
                    // Menerima pesan ID dari dalam WebView dan meneruskannya ke state utama
                    const id = event.nativeEvent.data;
                    onSelectTengkulak(id);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        backgroundColor: '#FFFFFF',
        marginBottom: 6,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});