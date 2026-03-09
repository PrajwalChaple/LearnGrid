<p align="center">
  <img src="https://www.learngrid.online/bookmark-25.svg" alt="LearnGrid Logo" width="60" />
</p>

<h1 align="center">LearnGrid</h1>

<p align="center">
  <b>Smart Learning Dashboard for Students</b><br/>
  Manage assignments, organize notes, track deadlines & boost academic productivity — all in one place.
</p>

<p align="center">
  <a href="https://www.learngrid.online">🌐 Live Website</a> ·
  <a href="https://www.learngrid.online/features">✨ Features</a> ·
  <a href="https://www.learngrid.online/about">📖 About</a> ·
  <a href="https://www.learngrid.online/help">❓ Help</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" />
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Pages & Routes](#-pages--routes)
- [Integrations](#-integrations)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🎯 About

**LearnGrid** is a free, modern, full-stack web application designed to help college and school students manage their academic life more efficiently. It provides a centralized dashboard where students can track assignments with deadlines, upload & organize PDF notes, receive class announcements, sync events with Google Calendar, and interact with an AI-powered 3D buddy — all within a beautiful, responsive interface.

Built as a solo project by **Prajwal Chaple**, LearnGrid focuses on real-world student problems: missed deadlines, scattered notes, and lack of a unified academic hub.

---

## ✨ Key Features

### 📊 Smart Dashboard
- Academic overview with pending tasks, upcoming deadlines & recent activity
- Real-time data updates using Firestore listeners
- Quick-access cards for all major modules

### 📝 Notes Management
- Upload, search & view PDF notes anytime
- Cloud-backed storage via Cloudinary
- Class-isolated: only see notes relevant to your class/section

### 📚 Assignment Tracking
- Upload assignment PDFs with deadlines
- Track completion status (Pending / Submitted / Late)
- Automatic Google Calendar event sync for deadlines
- Confetti celebration on task completion 🎉

### 📢 Announcements
- Broadcast important updates to your entire class or specific audience
- Dynamic audience targeting (by institution, branch, year, division, section)
- Real-time delivery with email notifications

### 📅 Calendar View
- Visual monthly calendar showing all assignment deadlines
- Google Calendar integration for two-way sync
- Color-coded events by status

### 🤖 AI Buddy (3D Interactive)
- Interactive 3D model powered by Spline
- AI-generated motivational messages in Hinglish
- Powered by **Google Gemini API** (primary) with **OpenAI API** fallback
- Context-aware: reacts to your pending tasks, workload & progress
- Automatic caching to minimize API calls
- Hidden on mobile devices for performance

### 🔔 Notification System
- In-app notification center with history
- Email notifications via EmailJS for new notes, assignments & announcements
- Desktop notification support

### 👤 Profile & Settings
- Profile management with avatar upload (Cloudinary)
- Theme toggle (Light/Dark mode)
- Account settings including account deletion
- Onboarding flow for new users

### 🔐 Authentication
- Google Sign-In (OAuth 2.0)
- Email/Password registration with email verification
- Protected routes with auth guards
- Seamless session management via Firebase Auth

### 🎨 Design & UX
- Modern glassmorphism UI with vibrant gradients
- Smooth page transitions with Framer Motion
- Fully responsive (mobile, tablet, desktop)
- Dark mode support
- Custom loading states & error boundaries

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, JSX |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4, Vanilla CSS |
| **Animations** | Framer Motion |
| **3D Graphics** | Spline (@splinetool/react-spline) |
| **Routing** | React Router DOM 7 |
| **Authentication** | Firebase Auth (Google OAuth + Email/Password) |
| **Database** | Cloud Firestore (real-time NoSQL) |
| **File Storage** | Cloudinary (PDFs, images, avatars) |
| **AI Services** | Google Gemini API (primary), OpenAI API (fallback) |
| **Calendar Sync** | Google Calendar API (OAuth 2.0) |
| **Email** | EmailJS |
| **Icons** | Lucide React |
| **Hosting** | Vercel |
| **Security** | Firestore Security Rules |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (React SPA)            │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Pages    │  │Components│  │  Context      │  │
│  │(Dashboard │  │(AiBuddy, │  │(AuthContext,  │  │
│  │ Notes,    │  │ Notifs,  │  │ ThemeContext) │  │
│  │ Assign..) │  │ Calendar)│  │              │  │
│  └─────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│        │             │               │          │
│  ┌─────▼─────────────▼───────────────▼───────┐  │
│  │          Service Layer (lib/)              │  │
│  │  firestore.js │ cloudinary.js │ email.js   │  │
│  │  googleCalendar.js │ storage.js            │  │
│  └────────────────────┬───────────────────────┘  │
└───────────────────────┼──────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  ┌──────────┐   ┌──────────┐   ┌──────────────┐
  │ Firebase │   │Cloudinary│   │ Google APIs   │
  │ Auth +   │   │ (Files)  │   │ (Calendar,   │
  │ Firestore│   │          │   │  Gemini AI)  │
  └──────────┘   └──────────┘   └──────────────┘
```

### Data Isolation
LearnGrid implements **class-level data isolation** — students only see notes, assignments, and announcements relevant to their institution, branch/standard, year, and division/section. This is enforced at both the query level and through Firestore Security Rules.

---

## 📄 Pages & Routes

### Public Pages
| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section, features showcase, CTA |
| `/features` | Features | Detailed feature breakdown |
| `/about` | About | Project story & team |
| `/help` | Help Center | FAQ & support |
| `/community` | Community | Community information |
| `/integrations` | Integrations | Third-party integrations info |
| `/privacy-policy` | Privacy Policy | Data privacy details |
| `/terms-of-service` | Terms of Service | Usage terms |
| `/cookie-policy` | Cookie Policy | Cookie usage policy |

### Auth Pages
| Route | Page | Description |
|---|---|---|
| `/login` | Login | Google OAuth + Email login |
| `/register` | Register | New account creation |
| `/verify-email` | Email Verification | Email confirmation flow |
| `/onboarding` | Onboarding | Profile setup for new users |

### Protected Dashboard (requires authentication)
| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard Home | Academic overview & quick stats |
| `/notes` | Notes | Upload & manage PDF notes |
| `/assignments` | Assignments | Track assignments & deadlines |
| `/announcements` | Announcements | Class announcements |
| `/calendar` | Calendar | Visual deadline calendar |
| `/profile` | Profile | User profile management |
| `/settings` | Settings | App preferences & account |

---

## 🔗 Integrations

| Service | Purpose |
|---|---|
| **Firebase Auth** | User authentication (Google + Email/Password) |
| **Cloud Firestore** | Real-time database with class-isolated collections |
| **Cloudinary** | PDF uploads, image hosting, avatar storage |
| **Google Calendar API** | Two-way calendar sync for assignment deadlines |
| **Google Gemini API** | AI-powered motivational messages (primary) |
| **OpenAI API** | AI message generation (fallback) |
| **EmailJS** | Transactional email notifications |
| **Spline** | Interactive 3D AI Buddy model |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **npm** 9+
- A **Firebase** project with Auth & Firestore enabled
- A **Cloudinary** account
- **Google Cloud Console** project with Calendar API enabled
- (Optional) **Gemini API** key and/or **OpenAI API** key

### Installation

```bash
# Clone the repository
git clone https://github.com/PrajwalChaple/LearnGrid.git

# Navigate to project directory
cd LearnGrid

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

Create a `src/config/apiKeys.js` file (or use environment variables) with the following:

| Variable | Description |
|---|---|
| Firebase Config | `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` |
| Cloudinary | Cloud name, upload preset |
| Google Calendar | OAuth Client ID, API Key |
| Gemini API | API key(s) with rotation support |
| OpenAI API | API key (fallback) |
| EmailJS | Service ID, Template ID, Public Key |

> **Note:** API keys are managed in `src/config/apiKeys.js` and `src/firebase.js`. Never commit sensitive keys to public repositories.

---

## 📂 Project Structure

```
LearnGrid/
├── public/                  # Static assets (sitemap, robots.txt, icons)
├── src/
│   ├── assets/              # Images & static resources
│   ├── components/          # Shared components
│   │   ├── AiBuddy.jsx      # 3D AI companion with Gemini/OpenAI
│   │   ├── GlobalCalendarSync.jsx
│   │   ├── NotificationDropdown.jsx
│   │   ├── NotificationHistory.jsx
│   │   ├── NotificationModal.jsx
│   │   └── PageTransition.jsx
│   ├── config/              # API keys & configuration
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── ThemeContext.jsx  # Dark/Light theme
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layout wrappers
│   │   ├── DashboardLayout.jsx
│   │   └── StaticLayout.jsx
│   ├── lib/                 # Service layer
│   │   ├── firestore.js     # Firestore CRUD & real-time listeners
│   │   ├── cloudinary.js    # File upload utilities
│   │   ├── email.js         # EmailJS integration
│   │   ├── googleCalendar.js # Google Calendar sync
│   │   └── storage.js       # Storage helpers
│   ├── pages/               # All page components
│   │   ├── Landing/         # Public landing page
│   │   ├── Auth/            # Login, Register, VerifyEmail
│   │   ├── Onboarding/      # New user setup
│   │   ├── Dashboard/       # Main dashboard
│   │   ├── Notes/           # Notes management
│   │   ├── Assignments/     # Assignment tracking
│   │   ├── Announcements/   # Class announcements
│   │   ├── Calendar/        # Calendar view
│   │   ├── Profile/         # User profile
│   │   ├── Settings/        # App settings
│   │   └── Static/          # Features, About, Help, etc.
│   ├── styles/              # Global CSS
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # Entry point
│   ├── auth.js              # Auth helper functions
│   ├── firebase.js          # Firebase initialization
│   └── ui.js                # UI utility functions
├── firebase.json            # Firestore rules config
├── firestore.rules          # Firestore security rules
├── vercel.json              # Vercel deployment config
├── vite.config.js           # Vite configuration
├── index.html               # HTML entry with SEO meta tags
└── package.json
```

---

## 🌐 Deployment

LearnGrid is deployed on **Vercel** with automatic deployments from the `main` branch.

### Vercel Configuration
- **SPA Rewrites:** All routes rewrite to `/index.html` for client-side routing
- **Domain Redirect:** Non-www → www canonical redirect (301)
- **Custom Domain:** [www.learngrid.online](https://www.learngrid.online)

### SEO
- Comprehensive meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data (WebApplication, Organization, WebSite)
- XML Sitemap at `/sitemap.xml`
- Robots.txt with protected route exclusions
- Noscript fallback content for crawlers

---

## 👨‍💻 Author

**Prajwal Chaple**

- 🎓 2nd Year, Information Technology — Yeshwantrao Chavan College of Engineering (YCCE), Nagpur
- 🌐 Website: [learngrid.online](https://www.learngrid.online)
- 💻 GitHub: [@PrajwalChaple](https://github.com/PrajwalChaple)

---

<p align="center">
  Made with ❤️ by Prajwal Chaple<br/>
  © 2026 LearnGrid. All rights reserved.
</p>
