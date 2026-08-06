# VDY Downloader

<div align="center">

Modern video downloader berbasis **Next.js 15** untuk mengekstraksi metadata, menganalisis sumber video, dan mengunduh media melalui direct stream maupun HLS.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8)
![FFmpeg](https://img.shields.io/badge/FFmpeg-Supported-green)

</div>

---

## ✨ Fitur

- Analisis URL video.
- Ekstraksi metadata video.
- Dukungan Direct MP4 dan HLS (.m3u8).
- Progress download real-time.
- Riwayat download.
- Skeleton loading.
- Responsive (Desktop, Tablet, Android, iPhone).
- Dark Mode.
- UI modern berbasis App Router.

---

# Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React
- React Hook Form
- Zod
- FFmpeg / FFprobe

---

# Arsitektur

```text
Browser
    │
    ▼
React Components
    │
    ▼
API Routes
    │
    ├── /api/extract
    ├── /api/download
    ├── /api/history
    └── /api/health
    │
    ▼
Utility Layer
    ├── Extract Engine
    ├── Download Engine
    ├── FFmpeg Helper
    └── History Manager
    │
    ▼
File System
```

---

# Struktur Proyek

```text
vdy-web
├── app
│   ├── api
│   │   ├── download
│   │   ├── extract
│   │   ├── history
│   │   └── health
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
│
├── components
│   ├── downloader
│   ├── layout
│   └── ui
│
├── hooks
│
├── lib
│
├── utils
│
├── middleware.ts
│
├── tailwind.config.ts
│
└── package.json
```

---

# API

## POST `/api/extract`

Menganalisis URL video dan mengembalikan metadata.

Request

```json
{
  "url": "https://vdy.to/e/xxxx"
}
```

---

## POST `/api/download`

Memulai proses download.

Request

```json
{
  "urlCdn": "...",
  "videoId": "...",
  "title": "...",
  "poster": "..."
}
```

---

## GET `/api/download/[id]`

Mengunduh file yang telah selesai diproses.

---

## GET `/api/history`

Mengambil riwayat download.

---

## DELETE `/api/history`

Menghapus seluruh riwayat download.

---

## GET `/api/health`

Health check server.

---

# Instalasi

Clone repository

```bash
git clone <repository-url>

cd vdy-web
```

Install dependency

```bash
npm install
```

Jalankan

```bash
npm run dev
```

Buka

```
http://localhost:3000
```

---

# Persyaratan

- Node.js 18+
- npm
- FFmpeg
- FFprobe

Android (Termux)

```bash
pkg update

pkg install ffmpeg
```

---

# Komponen

Project menggunakan reusable component seperti:

- Button
- Input
- Card
- Accordion
- Progress
- Skeleton
- Toast

serta komponen downloader:

- Download Form
- Video Info
- History List

---

# Hooks

Project memiliki custom hook:

- useDownload
- useExtract
- useHistory

---

# Utility

Utility utama:

- Download Engine
- Extract Engine
- Header Generator
- FFmpeg Helper
- History Manager

---

# Responsive

Dioptimalkan untuk:

- Android
- iPhone (Safari)
- Tablet
- Laptop
- Desktop
- Ultrawide

---

# Roadmap

- [ ] Batch Download
- [ ] Playlist Download
- [ ] Subtitle Download
- [ ] Resume Download
- [ ] Multi Thread Download
- [ ] Queue Download
- [ ] Docker Support

---

# Pengembangan

```bash
npm run lint

npm run build

npm run start
```

---

# Lisensi

MIT License

---

<div align="center">

Made with ❤️ using Next.js & TypeScript

</div>
