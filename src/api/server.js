const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware wajib agar React Native diizinkan mengambil data
app.use(cors());
app.use(express.json());

// ==========================================
// DATA DUMMY (Sinkron dengan HargaScreen.js)
// ==========================================

// Data struktur objek untuk 3 jenis komoditas telur beserta tren & histori grafiknya
const dataHargaTelur = {
    ras: { 
        nama: 'Telur Ayam Ras', 
        harga: 28000, 
        satuan: 'kg', 
        tren: 'Meningkat', 
        history: [40, 55, 65, 60, 85] 
    },
    kampung: { 
        nama: 'Telur Ayam Kampung', 
        harga: 2500, 
        satuan: 'butir', 
        tren: 'Stabil', 
        history: [70, 70, 65, 75, 70] 
    },
    bebek: { 
        nama: 'Telur Bebek', 
        harga: 3200, 
        satuan: 'butir', 
        tren: 'Menurun', 
        history: [90, 80, 75, 65, 55] 
    }
};

// Data Tengkulak Sekitar (Tetap dipertahankan untuk screen Tengkulak nanti)
const dataTengkulakSekitar = [
    { 
        "id": "T01", 
        "nama": "Pak Budi (Agen Telur)", 
        "jarak": "1.2 km", 
        "latitude": -7.2510, 
        "longitude": 112.7690, 
        "status": "Buka" 
    },
    { 
        "id": "T02", 
        "nama": "Bu Siti (Grosir)", 
        "jarak": "2.5 km", 
        "latitude": -7.2490, 
        "longitude": 112.7650, 
        "status": "Tutup" 
    },
    { 
        "id": "T03", 
        "nama": "CV. Unggas Makmur", 
        "jarak": "4.0 km", 
        "latitude": -7.2550, 
        "longitude": 112.7720, 
        "status": "Buka" 
    }
];

// ==========================================
// PEMBUATAN JALUR API (ENDPOINTS)
// ==========================================

// Endpoint 1: Mengambil data harga 3 jenis telur sekaligus
app.get('/api/harga', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET Request masuk ke /api/harga`);
    
    res.json({ 
        success: true, 
        data: dataHargaTelur 
    });
});

// Endpoint 2: Untuk mengambil data koordinat tengkulak sekitar
app.get('/api/tengkulak-sekitar', (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] GET Request masuk ke /api/tengkulak-sekitar`);
    
    res.json({ 
        success: true, 
        data: dataTengkulakSekitar 
    });
});

// Endpoint Root (Cek kesehatan server)
app.get('/', (req, res) => {
    res.send('Server API E-NDOG Smart Incubator Berjalan Normal!');
});

// ==========================================
// MENJALANKAN SERVER
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=============================================`);
    console.log(`🚀 Server API Niaga berhasil menyala!`);
    console.log(`   Berjalan di port: ${PORT}`);
    console.log(`   URL Harga Telur   : http://localhost:${PORT}/api/harga`);
    console.log(`   URL Maps Tengkulak: http://localhost:${PORT}/api/tengkulak-sekitar`);
    console.log(`=============================================`);
    console.log(`Menunggu request dari aplikasi...`);
});