export type RiskLevel = "low" | "medium" | "high" | "critical";

type Indicator = {
  id: string;
  label: string;
  points: number;
  patterns: RegExp[];
  // A match is ignored when it is clearly negated or discussed as a warning.
  negationPatterns?: RegExp[];
};

const indicators: Indicator[] = [
  {
    id: "credential_request",
    label: "Meminta OTP, PIN, kata sandi, atau kode verifikasi",
    points: 35,
    patterns: [
      /(?:berikan|kirim|sebutkan|masukkan|bagikan|konfirmasi|input)\s+(?:kode\s+)?(?:otp|pin|password|kata sandi|kode verifikasi|cvv)/i,
      /(?:otp|pin|password|kata sandi|kode verifikasi|cvv).{0,45}(?:kepada kami|ke nomor ini|melalui link|untuk verifikasi)/i,
    ],
    negationPatterns: [
      /(?:jangan|tidak|tak boleh|dilarang|hindari).{0,45}(?:memberikan|mengirim|membagikan|menyebutkan|memasukkan|klik).{0,25}(?:otp|pin|password|kata sandi|kode verifikasi|cvv)/i,
      /(?:otp|pin|password|kata sandi|kode verifikasi).{0,35}(?:jangan pernah|tidak boleh|rahasia|jangan dibagikan)/i,
    ],
  },
  {
    id: "money_request",
    label: "Meminta transfer uang atau pembayaran",
    points: 25,
    patterns: [
      /(?:transfer|kirim|bayar|setor)\s+(?:uang|dana|rp|sejumlah|biaya|admin)?/i,
      /(?:biaya admin|biaya aktivasi|biaya pencairan|uang muka|deposit|top[\s-]?up)/i,
      /(?:rekening|e-wallet).{0,40}(?:transfer|kirim|bayar)/i,
    ],
    negationPatterns: [
      /(?:jangan|tidak perlu|tanpa perlu).{0,35}(?:transfer|kirim uang|bayar|biaya admin)/i,
    ],
  },
  {
    id: "threat",
    label: "Ancaman pemblokiran atau penutupan akun",
    points: 20,
    patterns: [
      /(?:akun|rekening|kartu).{0,45}(?:diblokir|dibekukan|ditutup|dinonaktifkan|ditangguhkan)/i,
      /(?:diblokir|dibekukan|ditutup|dinonaktifkan|ditangguhkan).{0,45}(?:akun|rekening|kartu)/i,
      /(?:sanksi|tindakan hukum|akses dihentikan)/i,
    ],
  },
  {
    id: "urgency",
    label: "Tekanan waktu atau desakan untuk segera bertindak",
    points: 12,
    patterns: [
      /(?:segera|sekarang juga|secepatnya|hari ini|dalam\s+\d+\s+jam|maksimal\s+\d+\s+menit|kesempatan terakhir)/i,
      /(?:jangan sampai terlambat|akan hangus|akan berakhir|batas waktu)/i,
    ],
  },
  {
    id: "prize_bait",
    label: "Iming-iming hadiah atau keuntungan tidak terduga",
    points: 12,
    patterns: [
      /(?:selamat|anda terpilih).{0,60}(?:menang|pemenang|hadiah|undian|voucher|bonus)/i,
      /(?:menang|memenangkan|hadiah gratis|undian|giveaway|voucher).{0,60}(?:klaim|ambil|cairkan|klik|transfer)/i,
      /(?:hadiah|bonus|uang gratis|keuntungan besar)/i,
    ],
  },
  {
    id: "suspicious_link",
    label: "Ajakan membuka tautan untuk klaim atau verifikasi",
    points: 15,
    patterns: [
      /(?:klik|buka|kunjungi|akses).{0,35}(?:https?:\/\/|www\.|link|tautan)/i,
      /https?:\/\/[^\s]+/i,
      /(?:verifikasi|klaim|pulihkan akun).{0,45}(?:link|tautan|website|situs)/i,
    ],
  },
  {
    id: "impersonation",
    label: "Mengaku sebagai bank, instansi, atau layanan resmi",
    points: 20,
    patterns: [
      /(?:kami dari|atas nama|mengatasnamakan|customer service|cs resmi|tim keamanan).{0,60}(?:bank|bri|bca|bni|mandiri|ovo|dana|shopee|tokopedia|pajak|bea cukai)/i,
      /(?:bank|bri|bca|bni|mandiri|ovo|dana|shopee|tokopedia).{0,50}(?:meminta|mohon|wajib|segera).{0,40}(?:data|otp|pin|transfer|verifikasi)/i,
    ],
  },
  {
    id: "secrecy",
    label: "Meminta korban merahasiakan proses atau tidak menghubungi pihak lain",
    points: 15,
    patterns: [
      /(?:jangan beri tahu|jangan memberitahu|rahasiakan|jangan hubungi).{0,50}(?:siapa pun|pihak bank|keluarga|orang lain|customer service)/i,
    ],
  },
];

function isNegated(text: string, indicator: Indicator): boolean {
  return indicator.negationPatterns?.some((pattern) => pattern.test(text)) ?? false;
}

export function analyzeText(input: string) {
  const text = input.replace(/\s+/g, " ").trim();
  const flags: string[] = [];
  let score = 0;
  const matched = new Set<string>();

  for (const indicator of indicators) {
    const hasMatch = indicator.patterns.some((pattern) => pattern.test(text));
    if (hasMatch && !isNegated(text, indicator)) {
      matched.add(indicator.id);
      flags.push(indicator.label);
      score += indicator.points;
    }
  }

  // Bonus only for combinations that suggest a coherent scam flow.
  if (matched.has("prize_bait") && matched.has("money_request")) score += 10;
  if (matched.has("suspicious_link") && (matched.has("credential_request") || matched.has("impersonation"))) score += 10;
  if (matched.has("threat") && matched.has("urgency")) score += 8;

  score = Math.min(100, score);
  const riskLevel: RiskLevel =
    score >= 75 ? "critical" :
    score >= 50 ? "high" :
    score >= 25 ? "medium" : "low";

  const summary = flags.length
    ? `Ditemukan ${flags.length} kelompok indikator dengan skor risiko ${score}/100. Penilaian didasarkan pada pola teks dan konteks sederhana, bukan bukti pasti penipuan.`
    : `Tidak ditemukan indikator kuat dari aturan yang tersedia (skor ${score}/100). Hasil rendah bukan jaminan pesan aman.`;

  return {
    riskLevel,
    score,
    flags,
    summary,
    actions: [
      "Jangan pernah membagikan OTP, PIN, kata sandi, atau kode verifikasi kepada siapa pun.",
      "Jangan transfer uang atau membayar biaya untuk hadiah yang belum diverifikasi.",
      "Verifikasi pengirim melalui nomor atau situs resmi yang dicari secara mandiri.",
      "Jangan membuka tautan dari pesan yang tidak diminta; ketik alamat situs resmi sendiri.",
    ],
    limitations: "Analisis otomatis berbasis pola teks. Sistem dapat melewatkan modus baru dan dapat menghasilkan peringatan keliru; verifikasi secara mandiri sebelum mengambil keputusan.",
  };
}

export function analyzeUrl(raw: string) {
  const url = new URL(raw);
  const flags: string[] = [];
  let score = 0;
  const add = (condition: boolean, label: string, points: number) => {
    if (condition) {
      flags.push(label);
      score += points;
    }
  };

  add(url.protocol !== "https:", "Situs tidak menggunakan HTTPS", 10);
  add(Boolean(url.username || url.password), "URL memuat informasi login sebelum nama host", 30);
  add(url.hostname.split(".").some((part) => part.startsWith("xn--")), "Domain menggunakan format Punycode yang perlu diperiksa", 25);
  add(/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname), "Alamat menggunakan IP secara langsung", 25);
  add(url.hostname.split(".").length > 4, "Subdomain sangat panjang", 15);
  add(url.hostname.includes("-") && /(bank|login|secure|verify|account|gift|claim)/i.test(url.hostname),
    "Nama domain menggabungkan kata sensitif dan tanda hubung", 15);
  add(/(login|verify|hadiah|gift|bank|account|secure|claim|otp|password)/i.test(`${url.hostname}${url.pathname}`),
    "URL mengandung kata yang sering dimanfaatkan dalam umpan phishing", 10);
  add(url.hostname.length > 35, "Nama host relatif panjang", 10);

  score = Math.min(100, score);
  const riskLevel: RiskLevel =
    score >= 75 ? "critical" :
    score >= 50 ? "high" :
    score >= 25 ? "medium" : "low";

  return {
    url: url.href,
    hostname: url.hostname,
    score,
    riskLevel,
    flags,
    summary: flags.length
      ? `Ditemukan ${flags.length} karakteristik URL yang perlu diperiksa (skor ${score}/100). Ini bukan verifikasi reputasi global.`
      : "Tidak ditemukan karakteristik mencurigakan dari pemeriksaan lokal. Ini bukan jaminan situs aman.",
    actions: [
      "Periksa ejaan domain dan pastikan sesuai situs resmi.",
      "Jangan masukkan kata sandi atau OTP dari tautan yang dikirim orang lain.",
      "Jika ragu, buka situs resmi dengan mengetik alamatnya sendiri.",
    ],
    limitations: "Pemeriksaan ini menggunakan aturan lokal dan tidak mengecek daftar reputasi global atau isi situs secara langsung.",
  };
}
