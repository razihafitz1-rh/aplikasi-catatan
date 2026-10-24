# Aplikasi Catatan

Aplikasi berbasis web untuk mengelola catatan pribadi yang dibangun menggunakan React dan Vite.

## Deskripsi
Aplikasi ini memungkinkan pengguna untuk membuat, menyimpan, dan mengelola catatan secara efisien dengan antarmuka yang modern dan responsif.

## Teknologi yang Digunakan
- React (UI Library)
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Lucide React (Iconography)
- Three.js (Grafika 3D)

## Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal:

### 1. Prasyarat
Pastikan Anda telah menginstal Node.js di komputer Anda.

### 2. Kloning Repositori
Salin proyek ini ke direktori lokal Anda:
```bash
git clone <url-repositori>
cd aplikasi-catatan
```

### 3. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal semua paket yang diperlukan:
```bash
npm install
```
atau jika menggunakan bun:
```bash
bun install
```

### 4. Menjalankan Aplikasi
Untuk memulai server pengembangan, gunakan perintah:
```bash
npm run dev
```
Setelah perintah dijalankan, buka browser dan akses URL yang tertera pada terminal (biasanya http://localhost:5173).

## Panduan Penggunaan

### Membuat Catatan
1. Buka aplikasi melalui browser.
2. Cari tombol tambah atau area input catatan baru.
3. Masukkan judul dan isi catatan Anda.
4. Simpan catatan tersebut.

### Mengelola Catatan
- Gunakan fitur pencarian atau kategori untuk menemukan catatan lama.
- Edit catatan yang sudah ada untuk memperbarui informasi.
- Hapus catatan yang sudah tidak diperlukan lagi.

## Perintah Pengembangan Lainnya

### Membangun Proyek untuk Produksi
Untuk membuat versi produksi yang teroptimasi, jalankan:
```bash
npm run build
```
Hasil build akan berada di dalam folder dist.

### Pratinjau Hasil Build
Untuk melihat hasil build produksi secara lokal:
```bash
npm run preview
```

### Pemeriksaan Kode (Linting)
Untuk memeriksa kualitas kode dan mencari kesalahan penulisan:
```bash
npm run lint
```
