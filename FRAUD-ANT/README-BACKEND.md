# Fraud-Ant — backend foundation

Frontend asli dipertahankan. Backend awal ditambahkan di `server/`.

## Prasyarat
- Node.js 20 atau lebih baru
- npm

## Menjalankan frontend
Dari root proyek:
```bash
npm install
npm run dev
```

## Menjalankan backend
Terminal kedua:
```bash
cd server
npm install
```
Salin `.env.example` menjadi `.env` bila ingin mengubah konfigurasi. Lalu:
```bash
npm run dev
```

Cek kesehatan API: `http://localhost:4000/api/health`

## Endpoint
- `GET /api/health`
- `POST /api/scan` — multipart/form-data, field `image`, maksimal 5 MB; OCR Indonesia + Inggris, kemudian rule-based scan.
- `POST /api/url-check` — JSON `{ "url": "https://example.com" }`; pemeriksaan karakteristik URL secara lokal.

Vite meneruskan request `/api` ke backend port 4000.

## Batasan keamanan dan akurasi
- Analisis teks adalah rule-based heuristic, bukan AI dan bukan bukti bahwa suatu pesan pasti penipuan.
- Pemeriksaan URL saat ini belum mengecek reputasi global atau mengunjungi URL. Respons `externalReputationChecked` bernilai `false`.
- Jangan menganggap URL aman hanya karena hasil lokal rendah.
- Upload gambar diproses di memori dan tidak disimpan ke disk.
- Untuk produksi, tambahkan autentikasi/kuota, pemantauan, logging yang aman, pembatasan ukuran, dan konfigurasi CORS sesuai domain produksi.
- Integrasi API reputasi eksternal akan dibuat pada tahap berikutnya setelah konfigurasi kunci dan kebijakan privasi ditetapkan.

## Status integrasi
Tahap ini menyiapkan backend dan proxy Vite. Frontend `App.tsx` masih memakai simulasi lama; tahap integrasi berikutnya mengganti simulasi dengan request ke endpoint di atas dan mengaktifkan input file pada UI TrapScan.
