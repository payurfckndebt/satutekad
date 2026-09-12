# SatuTekad

Try out sertifikasi PCAM 9 & MLE 2026 — penerus dari aplikasi AALKADA, dibangun ulang dari nol
(React + Vite, siap deploy statis ke Vercel).

## Tiga Mode

- **Try Out Keseluruhan** — simulasi ujian bertimer, campuran seluruh 206 soal (existing + buatan Claude), pilih 20/40/60 soal, KKM 75.
- **YDBBA** — latihan fokus hanya ke 91 soal yang sudah ada di file materi kalian (tidak dicampur soal buatan Claude), bisa per kategori atau semua sekaligus.
- **JWARA** — mode game ringan ala Duolingo: 5 nyawa, streak/combo, progress bar, dan 5 jenis micro-interaction (Rapid Elimination, Tap-to-Fill, True/False Swipe, Match Pairs, Drag-and-Sort/susun urutan). Salah di ronde pertama mengurangi nyawa dan soal itu masuk antrian "Ulangi" di akhir level.

## Data Soal — 206 total, 15 kategori

`src/data/questions.json` dan `src/data/categories.json`. Tiap soal punya field `source`:

- `"existing"` (91 soal) — diekstrak otomatis dari file Kahoot/Quizizz/Latihan Soal kalian (kunci jawaban dibaca dari format **bold** di dokumen asli, sudah diverifikasi manual).
- `"generated"` (115 soal) — dibuat Claude dari 9 topik yang belum ada bank soalnya, dengan membaca penuh materi PDF-nya (bukan cuma judul topik). Termasuk kategori "Siklus Pengawasan Bidang Pasar Modal" yang menggantikan file sumber `Kahoot & Kisi - Pengawasan SRO Lembaga Penunjang (PMDK).docx` — file itu kosong teks soalnya (cuma opsi A/B/C/D tanpa pertanyaan), jadi kategori itu digenerate ulang dari materi PDF Pasar Modal.

`src/data/sequences.json` berisi 10 urutan tahapan (dipakai khusus untuk template Drag-and-Sort di JWARA), disusun manual dari fakta yang sama dengan materi — bukan hasil ekstraksi otomatis.

**Catatan jujur soal kualitas data:** penjelasan singkat yang muncul di bottom sheet JWARA ("Betul — ...", "Jawaban yang tepat: ...") dibangun otomatis dari stem+opsi soal, bukan penjelasan konseptual yang ditulis manual per soal. Kalau mau penjelasan yang lebih kaya, perlu ditambahkan field `explanation` per soal di `questions.json`.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel via GitHub

1. Push folder ini ke repo GitHub baru (root repo = folder ini, bukan subfolder).
2. Di Vercel: **Add New Project** → import repo tsb.
3. Vercel otomatis mendeteksi Vite (`vercel.json` sudah menyertakan `buildCommand`/`outputDirectory` untuk jaga-jaga). Tidak ada environment variable yang dibutuhkan — semua data soal statis, tidak ada backend.
4. Deploy. Selesai.

## Struktur Proyek

```
src/
  data/            questions.json, categories.json, sequences.json
  lib/utils.js     shuffle, KKM, dsb
  components/      komponen shared (ProgressBar, LivesBar, McqRunner, dst)
  screens/
    HomeScreen.jsx
    TryOutScreen.jsx
    YdbbaScreen.jsx
    jwara/
      JwaraMap.jsx       peta unit (per kategori, dikelompokkan per Day 1-4)
      JwaraSession.jsx   state machine: forward pass, retry-at-end, nyawa, streak
      levelBuilder.js    generator 1 level (6 langkah) dari pool soal kategori
      steps/             5 komponen micro-interaction
```

## Yang belum/bisa dikembangkan lagi

- Progress JWARA (level mana yang sudah selesai) belum persisten — reset tiap reload, sesuai pola AALKADA lama yang juga pakai sessionStorage-only tanpa akun/login.
- Explanation text di JWARA masih auto-generated dari data soal (lihat catatan di atas).
- Day 5 materi belum tersedia dari OJK saat ini — belum ada kategori untuk itu.
