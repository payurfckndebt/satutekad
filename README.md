# SatuTekad

Try out sertifikasi PCAM 9 & MLE 2026 — React + Vite, siap deploy statis ke Vercel.
Palet warna merah + putih, dominan putih.

## Lima Mode

- **FullTek** — simulasi ujian bertimer, gaya ujian asli: jawaban tidak langsung dikoreksi, ada penanda soal (flag), navigator untuk lompat ke soal manapun, skor baru muncul di akhir. Bisa keluar kapan saja tapi dikonfirmasi dulu. Ada peringatan saat waktu tersisa <1 menit.
- **JWARA** — mode game ala Duolingo: 5 nyawa, streak/combo, 5 jenis micro-interaction. Tiap unit punya 3 tingkat kesulitan (Mudah → Sedang → Sulit) yang harus dibuka berurutan — Sedang/Sulit terkunci sampai tingkat sebelumnya selesai.
- **Latihan Harian** — materi dikelompokkan per 4 hari pelatihan; sama gaya exam-runner-nya seperti FullTek (tanpa timer).
- **YDBBA** — latihan fokus ke subset soal tertentu, per kategori atau semua sekaligus, gaya exam-runner sama.
- **Bank Soal** — daftar semua 206 soal, bisa dicari & difilter per kategori, expand untuk lihat jawaban benar + pembahasan.

**Riwayat** — setiap try out (FullTek/YDBBA/Harian) yang selesai otomatis tersimpan: skor, jumlah benar/salah, dan lama pengerjaan. Tersimpan di `localStorage` perangkat masing-masing user — tidak ada database/backend, jadi tidak sinkron antar perangkat. Diakses lewat tombol "Riwayat" di pojok kanan atas Home.

## Data Soal — 206 total, 15 kategori

`src/data/questions.json` — tiap soal punya:
- `source`: `"existing"` (91 soal dari file kalian) atau `"generated"` (115 soal, dibuat dari materi PDF untuk 9 topik yang belum ada bank soalnya). Dipakai untuk logika internal YDBBA, **tidak ditampilkan di UI**.
- `pembahasan`: penjelasan singkat, dibangun otomatis dari stem+jawaban (bukan ditulis manual per soal — lihat catatan kualitas data).
- `difficulty`: `easy`/`medium`/`hard`, hasil klasifikasi heuristik (panjang soal, ada kata "kecuali", kemiripan opsi jawaban, dst) — dipakai untuk gating tingkat di JWARA.

`src/data/matchsets.json` — 4 pasangan istilah pendek per kategori, ditulis manual khusus untuk template Match Pairs di JWARA (bukan diambil dari soal MCQ yang bisa kepanjangan/kepotong).

`src/data/sequences.json` — 10 urutan tahapan untuk template Drag-and-Sort, juga ditulis manual.

**Catatan jujur soal kualitas data:** `pembahasan` dan `difficulty` adalah hasil generate/heuristik otomatis, bukan hand-crafted per soal. Kalau mau lebih akurat/kaya, itu pekerjaan lanjutan yang perlu ditulis manual.

## Menjalankan di lokal

\`\`\`bash
npm install
npm run dev
\`\`\`

## Deploy ke Vercel via GitHub

1. Push folder ini ke repo GitHub (root repo = folder ini, bukan subfolder).
2. Di Vercel: **Add New Project** → import repo tsb. `vercel.json` sudah menyertakan `buildCommand`/`outputDirectory`. Tidak ada environment variable yang dibutuhkan.
3. **Kalau mengganti koneksi repo di project Vercel yang sudah ada**: ganti koneksi itu sendiri TIDAK otomatis memicu build baru. Push commit baru atau klik "Redeploy" manual di tab Deployments.

## Struktur Proyek

\`\`\`
src/
  data/            questions.json, categories.json, matchsets.json, sequences.json
  lib/
    utils.js       shuffle, KKM
    history.js     localStorage read/write untuk Riwayat
  components/
    ExamRunner.jsx     runner gaya ujian asli (flag, navigator, timer, exit-confirm) — dipakai FullTek/YDBBA/Harian
    ResultCard.jsx, ProgressBar.jsx, LivesBar.jsx, StreakToast.jsx, Confetti.jsx, ExplanationSheet.jsx
  screens/
    HomeScreen.jsx
    TryOutScreen.jsx     (mode FullTek)
    YdbbaScreen.jsx
    HarianScreen.jsx     (mode Latihan Harian)
    BankSoalScreen.jsx
    HistoryScreen.jsx
    jwara/
      JwaraMap.jsx       daftar unit per Day 1-4
      JwaraUnitPath.jsx  peta 3 tingkat (Mudah/Sedang/Sulit) per unit, dengan gating
      JwaraSession.jsx   state machine: forward pass, retry-at-end, nyawa, streak
      levelBuilder.js    generator 1 level per tingkat kesulitan
      steps/             5 komponen micro-interaction
\`\`\`

## Yang belum/bisa dikembangkan lagi

- Progress tingkat JWARA (Mudah/Sedang/Sulit mana yang terbuka) hanya bertahan selama sesi aplikasi terbuka, belum persisten ke localStorage seperti Riwayat.
- `pembahasan` dan `difficulty` masih hasil heuristik/auto-generate (lihat catatan di atas).
- Day 5 materi belum tersedia dari OJK saat ini.
