# NMD COMPUTER Dashboard

Private admin dashboard for NMD COMPUTER premium code generation and user verification.

## Features
- Admin login with password `Nimesha00@@`
- Gmail OTP login flow for app users
- One active device per Gmail
- Premium code generation per verified email
- Manual WhatsApp premium request flow to the admin number
- 4-day inactivity lock logic
- Vercel-ready setup

## Required environment variables

Create `.env.local` or set these in Vercel:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nmd-computer
JWT_SECRET=change-me
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
GMAIL_FROM="NMD COMPUTER <your@gmail.com>"
DASHBOARD_PASSWORD=Nimesha00@@
ADMIN_WHATSAPP_NUMBER=+94726800969
```

## Local run

```bash
npm install
npm run dev
```

Then open:
- http://localhost:3000/login

## Dashboard flow

1. Login with password `Nimesha00@@`
2. Search user by email
3. If email is verified, generate premium code
4. If email already has active premium, return the existing code
5. App user can redeem the code in the app

## Notes
- For production, connect this dashboard to a real MongoDB cluster.
- This repo uses the manual WhatsApp flow: user sends a request to the admin number, and the admin checks the user email and generates a premium code in the dashboard.
- The app uses a heartbeat endpoint for inactivity lock after 4 days.

## Important
This repo is the dashboard/backend layer. The Android app itself is separate and should call these API endpoints.
