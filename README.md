# 🎓 LearnGrid

LearnGrid is a premium, modern, and collaborative learning management platform designed to streamline educational workflows. Built with a focus on user experience and productivity, it provides a centralized hub for students and educators to manage notes, assignments, and announcements.

![LearnGrid Preview](https://via.placeholder.com/1200x600?text=LearnGrid+Modern+Dashboard+Preview)

## ✨ Features

- **🚀 Interactive Dashboard**: Real-time overview of academic activities and progress.
- **📝 Intelligent Notes**: Seamlessly organize and manage your study materials.
- **📅 Assignment Tracking**: Never miss a deadline with our integrated assignment management system.
- **📢 Centralized Announcements**: Stay updated with the latest news from your institution.
- **🗓️ Google Calendar Sync**: Automatically sync your academic schedule with Google Calendar.
- **☁️ Cloud-Powered**: Robust file storage and delivery using Cloudinary and Pinata (IPFS).
- **🌓 Adaptive Theme**: Sleek dark mode and light mode support for optimal viewing.
- **🔒 Secure Authentication**: Robust security powered by Firebase.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend/Auth**: [Firebase](https://firebase.google.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PrajwalChaple/LearnGrid.git
   cd LearnGrid
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase and Cloudinary credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
LearnGrid/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # State management (Auth, Theme)
│   ├── layouts/        # Page layouts (Dashboard, Static)
│   ├── pages/          # Feature pages (Home, Notes, Auth, etc.)
│   ├── styles/         # Global styles and tailwind config
│   └── utils/          # Helper functions and services
├── public/             # Static assets
└── ...
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [Prajwal Chaple](https://github.com/PrajwalChaple)
