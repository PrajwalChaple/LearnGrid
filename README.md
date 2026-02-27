# 🎓 LearnGrid

Welcome to **LearnGrid**, a smart learning management dashboard that I built to help students keep their academic life organized. I wanted a clean, fast, and centralized place to manage notes, track assignment deadlines, and stay updated with class announcements without any unnecessary bloat. 

## ✨ Key Features

Here is what LearnGrid actually does:

- **📝 Notes Management**: Upload and store PDF study materials directly to the cloud (using Cloudinary). You can easily search, view, and organize notes by subject or unit.
- **� Assignment Tracking**: Keep track of pending and completed assignments. Add deadlines, attach related PDFs, and sync them to easily monitor what's due next.
- **📢 Smart Announcements**: A broadcast system where updates or notices can be sent to specific audiences (like a particular branch, year, or section). It includes an email notification system (via EmailJS) so students don't miss important updates.
- **📅 Calendar View**: A built-in interactive monthly calendar that visually highlights all upcoming assignment deadlines at a glance.
- **🔐 Secure Authentication**: Handled via Firebase for safe login (Email/Password or Google Auth). During setup, users choose their college, branch, year, and section to get a tailored experience.
- **🎨 Premium UI/UX**: Built entirely to look aesthetic, clean, and intuitive using modern bento-grid layouts, scroll animations, and interactive hover effects.

## 🛠️ Tech Stack I Used

- **Frontend**: React (v19) + Vite
- **Styling**: Tailwind CSS for responsive and custom layouts
- **Animations**: Framer Motion for smooth scroll and micro-interactions
- **Backend/Auth/Database**: Firebase (Auth, Firestore)
- **File Storage**: Cloudinary (for handling PDF uploads)
- **Emails**: EmailJS (for sending beautiful HTML templates on new announcements/shares)
- **Icons**: Lucide React

## 🚀 Getting Started

If you want to run this project locally, follow these steps:

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
   Create a `.env` file in the root directory. You will need to add your own API keys for Firebase, Cloudinary, and EmailJS to get all features working:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/pages/`: Contains the main pages like Dashboard, Notes, Assignments, Announcements, Calendar, and the Landing Page.
- `src/components/`: Reusable UI components like sidebars, navbars, and feature cards.
- `src/lib/`: Firebase config, EmailJS logic, and other integrations.

---

Developed by [Prajwal Chaple](https://github.com/PrajwalChaple)
