# Gym Admin Dashboard

A responsive admin dashboard for managing gym members and subscriptions, built with React and a clean MUI + Tailwind interface. Designed as the frontend client for a separate gym-management backend API.

## Features

- 🏋️ **Member Management** — add, view, update, and track gym members
- 💳 **Subscription Tracking** — manage membership plans and renewal status
- 📷 **Profile Photo Capture** — capture or upload member ID/profile photos directly from the browser using the device webcam
- 🔐 **Multi-page Navigation** — client-side routing across dashboard sections
- 📡 **REST API Integration** — communicates with a separate backend service via Axios
- 🎨 **Modern UI** — built with Material UI components styled on top of Tailwind CSS

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4, Material UI (MUI) v7 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Camera/Photo Capture | react-webcam |
| Icons | Lucide React, React Icons |
| Linting | ESLint |

## Architecture

This repository contains **only the frontend**. It is designed to be paired with a separate backend API (gym member/subscription data, auth, etc.) that this app communicates with over REST using Axios.

## Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the [backend API](#) *(link your backend repo here)*

### Installation

```bash
git clone https://github.com/dawit-808/admin.git
cd admin
npm install
```

### Configure the API

Update the Axios base URL / environment variable to point to your backend API instance (e.g. via a `.env` file or the relevant config/service file in `src/`).

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Status

🚧 Frontend client — pairs with a separate backend service (not included in this repo).

## License

This project currently has no license specified.
