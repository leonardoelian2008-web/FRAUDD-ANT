import { useRef, useState } from 'react';
import CardNav from './CardNav';
import './App.css';

import {
  ShieldAlert,
  Search,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  Lock,
} from 'lucide-react';

type Tab = 'home' | 'trapscan' | 'traplink' | 'result';

interface ResultData {
  riskLevel: string;
  summary: string;
  redFlags: string[];
  actions: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState<'image' | 'url'>('image');
  const [inputVal, setInputVal] = useState('');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format gambar harus PNG, JPG, JPEG, atau WEBP.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5 MB.');
      setSelectedFile(null);
      return;
    }

    setUploadError('');
    setSelectedFile(file);
  };

  const handleImageScan = async () => {
    if (!selectedFile) {
      setUploadError('Pilih screenshot terlebih dahulu.');
      return;
    }

    setLoading(true);
    setScanType('image');
    setUploadError('');
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await fetch('/api/scan', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menganalisis gambar.');

      const analysis = data.analysis;
      setExtractedText(data.extractedText || '');
      setResultData({
        riskLevel: analysis.riskLevel === 'critical'
          ? 'Kritis (Critical Risk)'
          : analysis.riskLevel === 'high'
            ? 'Tinggi (High Risk)'
            : analysis.riskLevel === 'medium'
              ? 'Sedang (Medium Risk)'
              : 'Rendah (Low Risk)',
        summary: analysis.summary,
        redFlags: analysis.flags?.length ? analysis.flags : ['Tidak ditemukan pola risiko dari aturan dasar yang tersedia.'],
        actions: analysis.actions || [],
      });
      setSelectedFile(null);
      setActiveTab('result');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Tidak dapat menghubungi backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCheck = async () => {
    if (!inputVal.trim()) {
      setUploadError('Masukkan alamat URL terlebih dahulu.');
      return;
    }

    setLoading(true);
    setScanType('url');
    setUploadError('');
    setExtractedText('');

    try {
      const response = await fetch('/api/url-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputVal.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal memeriksa URL.');

      const analysis = data.analysis;
      setResultData({
        riskLevel: analysis.riskLevel === 'critical'
          ? 'Kritis (Critical Risk)'
          : analysis.riskLevel === 'high'
            ? 'Tinggi (High Risk)'
            : analysis.riskLevel === 'medium'
              ? 'Sedang (Medium Risk)'
              : 'Rendah (Low Risk)',
        summary: `${analysis.summary} Pemeriksaan ini menggunakan aturan lokal; reputasi global belum diperiksa.`,
        redFlags: analysis.flags?.length ? analysis.flags : ['Tidak ditemukan karakteristik mencurigakan dari aturan lokal.'],
        actions: analysis.actions || [],
      });
      setActiveTab('result');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Tidak dapat menghubungi backend.');
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    setUploadError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fraud-app relative min-h-screen overflow-hidden bg-gradient-to-br from-lime-50 via-yellow-50 to-green-100 text-slate-800 flex flex-col font-sans">

      {/* =====================================
          ANIMATED BACKGROUND
      ===================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="fraud-blob fraud-blob-yellow absolute -top-32 -left-32 w-96 h-96 rounded-full bg-yellow-300/35 blur-3xl" />

        <div className="fraud-blob fraud-blob-green absolute top-20 -right-32 w-96 h-96 rounded-full bg-green-400/25 blur-3xl" />

        <div className="fraud-blob fraud-blob-lime absolute top-[40%] left-[10%] w-80 h-80 rounded-full bg-lime-300/25 blur-3xl" />

        <div className="fraud-blob fraud-blob-gold absolute bottom-0 right-[10%] w-96 h-96 rounded-full bg-yellow-300/30 blur-3xl" />

        <div className="fraud-blob fraud-blob-bottom absolute bottom-[-100px] left-[30%] w-96 h-96 rounded-full bg-green-300/25 blur-3xl" />

        {/* MOVING DOTS */}
        <div
          className="fraud-dots absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(#166534 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* LIGHT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-green-100/20" />
      </div>

      {/* =====================================
          MAIN WEBSITE
      ===================================== */}

      <div className="relative z-10 flex min-h-screen flex-col">

        {/* NAVBAR */}
        <CardNav
          logo="/logo-chattrap.png"
          logoAlt="Maskot Fraud-Ant"
          speed={500}
          stagger={120}
          maxWidth={1152}
          items={[
            {
              label: 'Navigasi',
              description: 'Jelajahi halaman utama Fraud-Ant.',
              links: [
                { label: 'Beranda', href: '#home' },
                { label: 'Tentang', href: '#about' },
                { label: 'Fitur Utama', href: '#features' },
              ],
            },
            {
              label: 'Keamanan Digital',
              description: 'Gunakan fitur perlindungan Fraud-Ant.',
              links: [
                { label: 'TrapScan', href: '#trapscan' },
                { label: 'TrapLink', href: '#traplink' },
              ],
            },
            {
              label: 'Informasi',
              description: 'Pelajari keamanan digital lebih lanjut.',
              links: [
                { label: 'Edukasi', href: '#education' },
                { label: 'FAQ', href: '#faq' },
              ],
            },
          ]}
          
          cta={{
            label: 'Mulai Sekarang',
            href: '#trapscan',
            onClick: () => navigateTo('trapscan'),
          }}
          
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col justify-center">

          {/* =====================================
              HOME PAGE
          ===================================== */}

          {activeTab === 'home' && (
            <div className="space-y-16 animate-fadeIn">

              {/* HERO */}
              <div
                id="home"
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-6"
              >
                <div className="lg:col-span-7 space-y-6">

                  <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-yellow-100/90 border border-yellow-300 text-green-900 text-xs font-bold tracking-wide shadow-sm">
                    <span>
                      MIT-WEEK 2026 — GUARDIANS OF THE DIGITAL SPACE
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                    Lindungi Ruang Digitalmu dari{' '}
                    <span className="text-green-700 underline decoration-yellow-400 decoration-wavy decoration-2">
                      Penipuan.
                    </span>
                  </h1>

                  <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                    Platform cerdas berbasis web untuk menganalisis screenshot
                    percakapan, memeriksa tautan mencurigakan, dan mengenali
                    indikasi penipuan secara instan, aman, dan transparan.
                  </p>

                  {/* TRUST BADGES */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-green-200">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Cepat & Akurat</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span>Aman & Privasi Terjaga</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <ShieldAlert className="w-4 h-4 text-green-600" />
                      <span>Mudah Digunakan</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span>Dirancang untuk Semua</span>
                    </div>
                  </div>
                </div>

                {/* HERO GRAPHIC */}
                <div className="lg:col-span-5">
                  <div className="relative p-6 rounded-3xl bg-gradient-to-br from-green-200/70 via-yellow-100/80 to-lime-100/70 border border-green-200 shadow-2xl shadow-green-900/10 backdrop-blur-sm">

                    <div className="bg-green-950 rounded-2xl p-4 shadow-xl border border-green-900 space-y-3">

                      <div className="flex items-center justify-between pb-2 border-b border-green-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>

                        <span className="text-[10px] text-green-200/70 font-mono">
                          Fraud-Ant Security Shield
                        </span>
                      </div>

                      <div className="p-3 bg-green-900/70 rounded-xl border border-green-700 text-xs text-green-100 space-y-1">
                        <p className="font-semibold text-yellow-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                          Scam Alert Detected
                        </p>

                        <p className="text-green-100/70">
                          "Selamat! Anda memenangkan hadiah 🎁 Klik link ini sekarang!"
                        </p>
                      </div>

                      <div className="p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/30 text-xs text-yellow-100 flex items-center justify-between">
                        <span>https://hadiah-gratis-co/...</span>
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">
                          Phishing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                <button
                  onClick={() => navigateTo('trapscan')}
                  className="text-left p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-green-100 hover:border-green-400 shadow-sm hover:shadow-xl hover:shadow-green-900/10 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
                      <Upload className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Mulai TrapScan (Screenshot)
                    </h3>

                    <p className="text-sm text-slate-500">
                      Unggah screenshot chat, postingan, atau tawaran mencurigakan.
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-green-800 text-white flex items-center justify-center group-hover:scale-110 transition shadow-md shadow-green-800/30">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('traplink')}
                  className="text-left p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-green-100 hover:border-yellow-400 shadow-sm hover:shadow-xl hover:shadow-yellow-900/10 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-green-800">
                      <LinkIcon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      Mulai TrapLink (URL Check)
                    </h3>

                    <p className="text-sm text-slate-500">
                      Masukkan tautan untuk memeriksa reputasi dan melihat isi halaman secara aman.
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-yellow-400 text-green-950 flex items-center justify-center group-hover:scale-110 transition shadow-md shadow-yellow-500/30">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* FEATURES */}
              <div id="features" className="space-y-8 pt-12">

                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-green-700">
                    — FITUR UTAMA FRAUD-ANT —
                  </span>

                  <h2 className="text-3xl font-extrabold text-slate-900">
                    Solusi Lengkap untuk Keamanan Digitalmu
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* FEATURE 1 */}
                  <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-green-100 shadow-sm space-y-4 hover:shadow-lg hover:shadow-green-900/10 transition">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
                      <FileText className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      TrapScan OCR
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      Ekstraksi teks otomatis dari gambar bukti chat untuk mendeteksi pola social engineering dan scam.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-green-100 text-xs font-medium text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Baca teks dari screenshot
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Deteksi kalimat mencurigakan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Penjelasan tanda bahaya
                      </li>
                    </ul>
                  </div>

                  {/* FEATURE 2 */}
                  <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-green-100 shadow-sm space-y-4 hover:shadow-lg hover:shadow-green-900/10 transition">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center text-green-800">
                      <Search className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      TrapLink & SafeView
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      Validasi URL terhadap indikasi phishing serta tinjau halaman secara aman tanpa risiko eksekusi langsung.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-green-100 text-xs font-medium text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Cek reputasi tautan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Lihat pratinjau halaman (SafeView)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Identifikasi pengalihan URL
                      </li>
                    </ul>
                  </div>

                  {/* FEATURE 3 */}
                  <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-green-100 shadow-sm space-y-4 hover:shadow-lg hover:shadow-green-900/10 transition">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-700">
                      <ShieldAlert className="w-7 h-7" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Guardian Action
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      Dapatkan rekomendasi langkah pengamanan akun, checklist verifikasi, serta panduan pelaporan resmi.
                    </p>

                    <ul className="space-y-2 pt-2 border-t border-green-100 text-xs font-medium text-slate-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Langkah penanganan sesuai kasus
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Tips menjaga keamanan akun
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Panduan pelaporan resmi
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================
              TRAPSCAN
          ===================================== */}

          {activeTab === 'trapscan' && (
            <div
              id="trapscan"
              className="max-w-xl mx-auto w-full py-8 space-y-6 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/10 animate-fadeIn"
            >
              <div>
                <h2 className="text-2xl font-bold text-green-950">
                  TrapScan — Analisis Screenshot
                </h2>

                <p className="text-slate-500 text-sm">
                  Unggah gambar bukti percakapan untuk mendeteksi potensi penipuan.
                </p>
              </div>

              <input
                id="trapscan-upload"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
              />

              <label
                htmlFor="trapscan-upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFileChange(event.dataTransfer.files?.[0]);
                }}
                className="border-2 border-dashed border-green-300 hover:border-green-600 transition rounded-2xl p-8 text-center bg-green-50/70 cursor-pointer flex flex-col items-center justify-center min-h-[185px]"
              >
                <Upload className="w-12 h-12 text-green-700 mb-3" />
                <p className="font-medium text-slate-700 break-all">
                  {selectedFile ? selectedFile.name : <>Seret file screenshot ke sini atau <span className="text-green-700 font-bold">telusuri</span></>}
                </p>
                <p className="text-xs text-slate-400 mt-2">Mendukung PNG, JPG, JPEG, WEBP (Maks. 5MB)</p>
                {selectedFile && <p className="text-xs text-green-700 mt-2 font-semibold">File berhasil dipilih ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
              </label>

              {uploadError && <p role="alert" className="text-sm text-red-600 font-medium">{uploadError}</p>}

              <button
                type="button"
                disabled={loading || !selectedFile}
                onClick={handleImageScan}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-green-800/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Analisis Screenshot Sekarang</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigateTo('home')}
                className="w-full text-center text-sm text-slate-500 hover:text-green-700"
              >
                ← Kembali ke Beranda
              </button>
            </div>
          )}

          {/* =====================================
              TRAPLINK
          ===================================== */}

          {activeTab === 'traplink' && (
            <div
              id="traplink"
              className="max-w-xl mx-auto w-full py-8 space-y-6 bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/10 animate-fadeIn"
            >
              <div>
                <h2 className="text-2xl font-bold text-green-950">
                  TrapLink — Pemeriksaan Tautan
                </h2>

                <p className="text-slate-500 text-sm">
                  Masukkan URL situs web untuk mendeteksi indikasi phishing atau penipuan.
                </p>
              </div>

              <div className="space-y-3">
                <label htmlFor="traplink-url" className="text-sm font-medium text-slate-700">
                  Alamat URL Web
                </label>

                <input
                  id="traplink-url"
                  type="url"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="https://contoh-situs-mencurigakan.com"
                  className="w-full bg-green-50/70 border border-green-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 shadow-inner"
                />
              </div>

              {uploadError && <p role="alert" className="text-sm text-red-600 font-medium">{uploadError}</p>}

              <button
                type="button"
                disabled={loading || !inputVal.trim()}
                onClick={handleUrlCheck}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-800 to-green-600 hover:from-green-700 hover:to-green-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-green-800/20 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Periksa Keamanan URL</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigateTo('home')}
                className="w-full text-center text-sm text-slate-500 hover:text-green-700"
              >
                ← Kembali ke Beranda
              </button>
            </div>
          )}

          {/* =====================================
              RESULT
          ===================================== */}

          {activeTab === 'result' && resultData && (
            <div className="max-w-2xl mx-auto w-full py-6 space-y-6 bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-green-200 shadow-xl shadow-green-900/10 animate-fadeIn">

              <div className="flex items-center justify-between pb-4 border-b border-green-100">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                    Hasil Pemeriksaan ({scanType.toUpperCase()})
                  </span>

                  <h2 className="text-2xl font-black text-red-600 flex items-center gap-2 mt-1">
                    <AlertTriangle className="w-6 h-6" />
                    {resultData.riskLevel}
                  </h2>
                </div>

                <button
                  onClick={() => navigateTo('home')}
                  className="text-xs px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-900 font-semibold transition"
                >
                  Pemeriksaan Baru
                </button>
              </div>

              {/* SUMMARY */}
              <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200 space-y-2">
                <h3 className="font-bold text-yellow-900 text-sm">
                  Ringkasan Analisis
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {resultData.summary}
                </p>
              </div>

              {scanType === 'image' && extractedText && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm">Teks yang Terbaca (OCR)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{extractedText}</p>
                </div>
              )}

              {/* RED FLAGS */}
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                <h3 className="font-bold text-red-700 flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  Red Flag Highlight
                </h3>

                <ul className="space-y-2">
                  {resultData.redFlags.map((flag, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-700 flex items-start gap-2"
                    >
                      <span className="text-red-600 font-bold">•</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GUARDIAN ACTION */}
              <div className="p-5 rounded-2xl bg-green-50 border border-green-200 space-y-3">
                <h3 className="font-bold text-green-800 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Guardian Action (Panduan Tindakan)
                </h3>

                <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700">
                  {resultData.actions.map((act, idx) => (
                    <li key={idx} className="py-1">
                      {act}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-green-200/70 py-8 text-center text-xs text-slate-600 bg-white/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              <strong className="text-green-900">
                FRAUD-ANT — Guardians of Digital Space.
              </strong>{' '}
              MIT-Week 2026.
            </p>

            <div className="flex items-center space-x-6">
              <span className="hover:text-green-700 cursor-pointer transition">
                Kebijakan Privasi
              </span>

              <span>|</span>

              <span className="hover:text-green-700 cursor-pointer transition">
                Syarat Penggunaan
              </span>

              <span>|</span>

              <span className="hover:text-green-700 cursor-pointer transition">
                Kontak
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}