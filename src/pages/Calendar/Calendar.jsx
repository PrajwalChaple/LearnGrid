import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToAssignments } from '../../lib/firestore';

export function Calendar() {
  const { userProfile } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);

  // Real-time listener for assignments from Firestore
  useEffect(() => {
    if (!userProfile) return;
    const unsubscribe = subscribeToAssignments(userProfile, (data) => {
      setAssignments(data);
    });
    return () => unsubscribe();
  }, [userProfile]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const gridDates = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    gridDates.push({ day: daysInPrevMonth - i, prev: true });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    gridDates.push({
      day: i,
      current: true,
      today: i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    });
  }
  // Next month leading days
  const remaining = 42 - gridDates.length;
  for (let i = 1; i <= remaining; i++) {
    gridDates.push({ day: i, next: true });
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // Map assignments to calendar events
  const eventDays = assignments.map(a => {
    const d = new Date(a.deadline);
    return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), title: a.title, status: a.status };
  }).filter(e => e.month === month && e.year === year);

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <div className="calendar-controls">
          <button className="control-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
          <span className="current-month">{monthNames[month]} {year}</span>
          <button className="control-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
          <button className="today-btn" onClick={goToday}>Today</button>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className="calendar-header-cell">{day}</div>
        ))}

        {gridDates.map((date, index) => {
          const events = date.current ? eventDays.filter(e => e.day === date.day) : [];
          return (
            <div key={index} className={`calendar-cell ${date.prev || date.next ? 'muted' : ''} ${date.today ? 'today' : ''}`}>
              <span className={`date-number ${date.today ? 'today-num' : ''}`}>{date.day}</span>
              {events.map((ev, ei) => (
                <div key={ei} className={`event-chip ${ev.status === 'Completed' ? 'completed' : 'pending'}`} title={ev.title}>
                  {ev.title.substring(0, 12)}{ev.title.length > 12 ? '...' : ''}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot pending-dot"></div>
          <span>Pending Assignment</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot completed-dot"></div>
          <span>Completed</span>
        </div>
      </div>

      <style jsx="true">{`
        .calendar-page {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        h1 { font-size: 1.75rem; font-weight: 800; color: var(--color-text-main); }

        .calendar-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 6px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .current-month {
          font-weight: 700;
          font-size: 1.05rem;
          min-width: 140px;
          text-align: center;
          color: var(--color-text-main);
        }

        .control-btn {
          padding: 6px;
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          transition: all var(--transition-fast);
        }

        .control-btn:hover {
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .today-btn {
          padding: 6px 16px;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          margin-left: 0.5rem;
        }

        .today-btn:hover { box-shadow: var(--shadow-md); }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--color-border);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .calendar-header-cell {
          background: white;
          padding: 0.85rem;
          text-align: center;
          font-weight: 700;
          color: var(--color-text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .calendar-cell {
          background: white;
          min-height: 90px;
          padding: 0.5rem;
          position: relative;
          transition: background-color var(--transition-fast);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .calendar-cell:hover { background-color: var(--color-primary-bg); }

        .calendar-cell.muted {
          color: #d1d5db;
          background-color: #fafafa;
        }

        .calendar-cell.today { background: var(--color-primary-bg); }

        .date-number {
          font-weight: 500;
          font-size: 0.85rem;
          display: inline-block;
          width: 28px;
          height: 28px;
          text-align: center;
          line-height: 28px;
          border-radius: 50%;
          margin-bottom: 2px;
        }

        .today-num {
          background: var(--gradient-primary);
          color: white;
          font-weight: 700;
        }

        .event-chip {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .event-chip.pending { background: #fff7ed; color: #c2410c; }
        .event-chip.completed { background: #ecfdf5; color: #047857; }

        .legend {
          display: flex;
          gap: 1.5rem;
          background: white;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
        .pending-dot { background: #f97316; }
        .completed-dot { background: #10b981; }
      `}</style>
    </div>
  );
}
