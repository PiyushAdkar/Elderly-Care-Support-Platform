# 🌿 Elderly Care — Elder Companion Platform

A complete, accessible React.js + Tailwind CSS platform designed for elderly users.

---

## 📁 Project Structure

```
elder-companion/
├── public/
│   └── index.html
├── src/
│   ├── index.js                  ← App entry point
│   ├── index.css                 ← Global styles + Tailwind + animations
│   ├── App.jsx                   ← Router + AuthContext + global overlays
│   │
│   ├── data/
│   │   └── dummyData.js          ← All dummy data (medicines, doctors, etc.)
│   │
│   ├── components/
│   │   ├── Layout.jsx            ← Top navbar + page outlet
│   │   ├── UI.jsx                ← Reusable components (Card, Badge, StatCard…)
│   │   ├── SOSButton.jsx         ← Floating global SOS button
│   │   └── VoiceAssistant.jsx    ← Voice assistant modal with mic animation
│   │
│   └── pages/
│       ├── HomePage.jsx          ← Landing page with features
│       ├── LoginPage.jsx         ← Login with OTP option
│       ├── SignupPage.jsx        ← New user registration
│       ├── DashboardPage.jsx     ← Main hub with quick actions + stats
│       ├── MedicinePage.jsx      ← Add/edit/delete medicines + reminders
│       ├── TelemedicinePage.jsx  ← Doctor list + booking + video call UI
│       ├── ActivityPage.jsx      ← Steps tracker + Recharts bar chart
│       ├── DocumentsPage.jsx     ← Upload/view/download documents
│       ├── EntertainmentPage.jsx ← Music, stories, brain games
│       └── ContactsPage.jsx      ← Family + doctor contacts + one-tap call
│
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Setup Instructions

### Step 1 — Create React App
```bash
npx create-react-app elder-companion
cd elder-companion
```

### Step 2 — Install Dependencies
```bash
npm install react-router-dom recharts lucide-react
npm install -D tailwindcss autoprefixer postcss
```

### Step 3 — Copy All Files
Replace all files in `src/` and root config files with the ones provided.

### Step 4 — Run
```bash
npm start
```
App opens at **http://localhost:3000**

---

## ✨ Features

| Page | Features |
|------|----------|
| **Home** | Hero, feature grid, CTA, footer |
| **Login** | Phone + password, OTP login option |
| **Signup** | Name, age, phone, password |
| **Dashboard** | Greeting, quick actions, step progress, medicine summary |
| **Medicine** | Add/delete/mark-taken, multi-time reminders, status badges |
| **Telemedicine** | Doctor cards, slot picker, mock video call UI, report upload |
| **Activity** | Weekly Recharts bar chart, today's vitals grid, step progress bar |
| **Documents** | Drag-to-upload zone, search, download/share/delete |
| **Entertainment** | Music player with now-playing UI, audio stories, 4 brain games |
| **Contacts** | Family + doctor tabs, one-tap call modal, emergency numbers |
| **SOS Button** | Fixed floating red button (global), pulsing animation, alert modal |
| **Voice Assistant** | Mic animation rings, simulated recognition, AI response |

---

## 🎨 Design System

- **Font**: Nunito (rounded, readable, friendly)
- **Base font size**: 18px+ throughout
- **Primary color**: Blue `#1860d4`
- **Secondary**: Sage green `#2a9d68`
- **SOS**: Red `#dc2626` with pulsing glow
- **Buttons**: Rounded-3xl, large tap targets (min 44px)
- **Cards**: White, soft shadow, rounded-3xl
- **Animations**: fade-in, slide-up, float, pulse-sos, mic-ring

---

## 🔐 Auth Flow

- `AuthContext` in `App.jsx` manages `user` state globally
- Login/Signup set the user and redirect to `/dashboard`
- Protected routes redirect to `/login` if no user
- Logout clears user and returns to homepage

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `recharts` | Activity bar chart |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility CSS framework |

---

*Designed with ❤️ for senior citizens — accessibility first.*
