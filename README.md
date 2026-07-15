# Gym Admin Dashboard

Frontend for a gym management system — lets staff register members and coaches, track subscriptions, verify payments, and see stats for the gym at a glance.

Built with React + Vite. Talks to a separate backend over REST (not included in this repo).

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

You'll need Node 18+ and the [backend](#) running somewhere.

\`\`\`bash
git clone https://github.com/dawit-808/admin.git
cd admin
npm install
npm run dev
\`\`\`

By default the app points at \`http://localhost:5000/api\` — change \`BASE_URL\` in \`src/api/api.js\` if your backend runs elsewhere. (This should probably be an env variable — on the todo list.)

## Scripts

- \`npm run dev\` — dev server
- \`npm run build\` — production build
- \`npm run preview\` — preview the build
- \`npm run lint\` — eslint

## Status

Frontend only, actively being built out alongside the backend. No license yet.
