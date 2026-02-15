import React, { useState } from 'react';
import { Moon, Bell, Shield, Wallet } from 'lucide-react';

export function Settings() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            <div className="settings-section animate-fade-in">
                <h2>Preferences</h2>
                <div className="settings-list">
                    <div className="setting-item">
                        <div className="setting-icon"><Moon size={20} /></div>
                        <div className="setting-info">
                            <h3>Dark Mode</h3>
                            <p>Enable dark theme for the dashboard</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-icon"><Bell size={20} /></div>
                        <div className="setting-info">
                            <h3>Notifications</h3>
                            <p>Receive email updates and alerts</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-section animate-fade-in">
                <h2>Account</h2>
                <div className="settings-list">
                    <div className="setting-item arrow">
                        <div className="setting-icon"><Shield size={20} /></div>
                        <div className="setting-info">
                            <h3>Privacy & Security</h3>
                            <p>Manage your password and security settings</p>
                        </div>
                    </div>
                    <div className="setting-item arrow">
                        <div className="setting-icon"><Wallet size={20} /></div>
                        <div className="setting-info">
                            <h3>Billing & Subscription</h3>
                            <p>View your payment history</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
        .settings-page { max-width: 800px; margin: 0 auto; }

        h1 { font-size: 1.75rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 1.75rem; }

        .settings-section {
           background: white;
           border-radius: var(--radius-lg);
           box-shadow: var(--shadow-sm);
           padding: 2rem;
           margin-bottom: var(--spacing-lg);
        }

        h2 {
           font-size: 1.1rem;
           color: var(--color-text-main);
           font-weight: 700;
           margin-bottom: 1.5rem;
           padding-bottom: 1rem;
           border-bottom: 1px solid var(--color-border);
        }

        .settings-list { display: flex; flex-direction: column; gap: 1.5rem; }

        .setting-item {
           display: flex;
           align-items: center;
           gap: 1rem;
        }

        .setting-icon {
           width: 42px;
           height: 42px;
           background: var(--color-primary-bg);
           border-radius: 12px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: var(--color-primary);
           flex-shrink: 0;
        }

        .setting-info { flex: 1; }

        .setting-info h3 {
           font-size: 1rem;
           font-weight: 600;
           color: var(--color-text-main);
           margin-bottom: 0.2rem;
        }

        .setting-info p {
           font-size: 0.85rem;
           color: var(--color-text-muted);
        }

        .toggle-switch {
           position: relative;
           display: inline-block;
           width: 48px;
           height: 24px;
        }

        .toggle-switch input { opacity: 0; width: 0; height: 0; }

        .slider {
           position: absolute;
           cursor: pointer;
           top: 0; left: 0; right: 0; bottom: 0;
           background-color: #d1d5db;
           transition: .4s;
           border-radius: 24px;
        }

        .slider:before {
           position: absolute;
           content: "";
           height: 18px;
           width: 18px;
           left: 3px;
           bottom: 3px;
           background-color: white;
           transition: .4s;
           border-radius: 50%;
        }

        input:checked + .slider { background: var(--gradient-primary); }

        input:checked + .slider:before { transform: translateX(24px); }

        .arrow {
           cursor: pointer;
           transition: all var(--transition-fast);
           padding: 0.75rem;
           border-radius: var(--radius-lg);
           margin: -0.75rem;
        }

        .arrow:hover {
           background: var(--color-primary-bg);
        }

        .arrow:after {
           content: '›';
           font-size: 1.5rem;
           color: var(--color-text-muted);
           margin-left: 0.5rem;
        }
      `}</style>
        </div>
    );
}
