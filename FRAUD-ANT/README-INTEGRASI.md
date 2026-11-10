# Fraud-Ant — Frontend + Backend Integration

Paket ini mempertahankan desain frontend dan menambahkan integrasi API untuk TrapScan dan TrapLink.

## Persyaratan
- Node.js 20 atau lebih baru
- npm

## Instalasi pertama kali
Buka terminal pada folder `FRAUD-ANT`:

```powershell
npm install --legacy-peer-deps
```

Buka terminal kedua:

```powershell
cd server
npm install
```

## Menjalankan aplikasi
Terminal 1 — backend:

```powershell
cd server
npm run dev
```

Backend aktif di `http://localhost:4000`.
Periksa `http://localhost:4000/api/health` dan pastikan respons berisi `status: ok`.

Terminal 2 — frontend (jalankan dari folder utama `FRAUD-ANT`):

```powershell
npm run dev
```

Buka alamat Vite yang muncul, biasanya `http://localhost:5173`.

## Fitur yang sudah dihubungkan
- TrapScan: menerima PNG/JPG/WEBP maksimal 5 MB, drag-and-drop, OCR melalui Tesseract.js, lalu analisis teks berbasis aturan lokal.
- TrapLink: mengirim URL ke endpoint backend dan melakukan pemeriksaan karakteristik URL berbasis aturan lokal.
- Hasil: menampilkan level risiko, ringkasan, red flags, dan rekomendasi.
- Tombol CTA navbar “Mulai Sekarang” membuka halaman TrapScan.

## Batasan penting
- TrapScan menggunakan OCR dan aturan heuristik. Hasilnya adalah indikasi, bukan kepastian penipuan.
- TrapLink pada paket ini BELUM memeriksa reputasi global melalui Google Safe Browsing/VirusTotal dan BELUM melakukan crawling situs. Backend mengembalikan `externalReputationChecked: false`.
- Jangan gunakan hasil ini sebagai satu-satunya dasar keputusan keuangan atau keamanan.
- OCR bahasa Indonesia/Inggris mungkin mengunduh data bahasa saat pemakaian pertama, sehingga membutuhkan koneksi internet.

## Jika instalasi gagal
Untuk frontend gunakan `npm install --legacy-peer-deps` sesuai konflik peer dependency yang muncul pada konfigurasi paket saat ini. Jangan gunakan `--force` kecuali sudah diperiksa penyebab konfliknya.

## File utama yang diperbarui
- `src/App.tsx`
- `src/CardNav.tsx`
- `vite.config.ts`
- `server/src/` (API dan mesin analisis)


## Pembaruan mesin analisis risiko

Mesin aturan di `server/src/services/analyzer.ts` kini memakai indikator berbobot, bonus kombinasi, pemeriksaan negasi sederhana, serta empat level: low, medium, high, critical. Analisis tetap bersifat heuristik dan bukan bukti pasti atau pemeriksaan reputasi global.
