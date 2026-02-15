import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="content-area">
          <div className="container animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <style jsx="true">{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 270px; /* Sidebar width */
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left var(--transition-normal);
        }

        .content-area {
          flex: 1;
          padding: var(--spacing-lg) 0;
          overflow-x: hidden;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 45;
            animation: fadeIn 0.2s ease-out;
          }
        }
      `}</style>
    </div>
  );
}
