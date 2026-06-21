import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RadarMap({ selectedTengkulak, onSelectTengkulak }) {

    const colorTengkulak1 = selectedTengkulak === 1 ? '#F2A505' : '#64748B';
    const colorTengkulak2 = selectedTengkulak === 2 ? '#F2A505' : '#64748B';
    const colorTengkulak3 = selectedTengkulak === 3 ? '#F2A505' : '#64748B';

    const radius1 = selectedTengkulak === 1 ? 11 : 7;
    const radius2 = selectedTengkulak === 2 ? 11 : 7;
    const radius3 = selectedTengkulak === 3 ? 11 : 7;

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
        // Inisialisasi map tanpa memberikan parameter setView statis di awal
        var map = L.map('map', { zoomControl: false });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(map);

        // Kumpulan seluruh titik koordinat alamat (Index 0 = Inkubator, sisanya Tengkulak)
        var points = [
          [-7.4478, 112.7183], // Inkubator E-NDOG
          [-7.4121, 112.5872], // Haji Supriatna (Krian)
          [-7.3311, 112.7618], // PT Agro Telur Makmur (Rungkut)
          [-7.2847, 112.7964]  // Cak Mahmud Mandiri (Sukolilo)
        ];

        // 1. Marker Inkubator E-NDOG (Titik Pusat Utama)
        L.circleMarker(points[0], {
          color: '#F25C05',
          fillColor: '#F25C05',
          fillOpacity: 0.85,
          radius: 9,
          weight: 3
        }).addTo(map);

        // 2. Marker Tengkulak 1
        var m1 = L.circleMarker(points[1], {
          color: '${colorTengkulak1}',
          fillColor: '${colorTengkulak1}',
          fillOpacity: 0.9,
          radius: ${radius1},
          weight: 2
        }).addTo(map);
        m1.on('click', function() { window.ReactNativeWebView.postMessage('1'); });

        // 3. Marker Tengkulak 2
        var m2 = L.circleMarker(points[2], {
          color: '${colorTengkulak2}',
          fillColor: '${colorTengkulak2}',
          fillOpacity: 0.9,
          radius: ${radius2},
          weight: 2
        }).addTo(map);
        m2.on('click', function() { window.ReactNativeWebView.postMessage('2'); });

        // 4. Marker Tengkulak 3
        var m3 = L.circleMarker(points[3], {
          color: '${colorTengkulak3}',
          fillColor: '${colorTengkulak3}',
          fillOpacity: 0.9,
          radius: ${radius3},
          weight: 2
        }).addTo(map);
        m3.on('click', function() { window.ReactNativeWebView.postMessage('3'); });

        // OTOMATIS LOCK DI TENGAH BERDASARKAN SELURUH ALAMAT MARKER
        // Parameter padding [30, 30] berfungsi memberikan jarak napas agar pin di ujung tidak menempel ke tepi layar
        var bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [30, 30] });

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
                    const id = parseInt(event.nativeEvent.data);
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