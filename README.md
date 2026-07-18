# Gym Admin Dashboard

Frontend for a gym management system lets staff register members and coaches, track subscriptions, verify payments, and see stats for the gym at a glance.

Built with React + Vite. Talks to a separate backend over REST.

Pairs with the [backend](https://github.com/yonatanfeseha/ras-new-backend) — that repo has the API and database, this one is just the UI.

## What it does

- Register and manage members and coaches, including profile photos (webcam capture or upload)
- Track subscriptions and renewal status
- Verify CBE / Telebirr payments against a member's account
- Dashboard with stats: revenue, gender split, coach workload, training activity
- Role-based routes (admin vs coach access)
- Dark mode

## Stack

React 19, Vite, Tailwind CSS, MUI, React Router, Axios, Recharts.

## Getting started

You'll need Node 18+ and the [backend](https://github.com/yonatanfeseha/ras-new-backend) running.

```bash
git clone https://github.com/dawit-808/admin.git
cd admin
npm install
npm run dev
```


## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run preview` — preview the build
- `npm run lint` — eslint


## Status

Production React dashboard used by Ras Hailu Gym staff to manage members, coaches, subscriptions, payment verification, and business reporting.
