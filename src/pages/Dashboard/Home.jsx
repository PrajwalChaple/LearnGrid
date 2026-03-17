import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, AlertCircle, Calendar, MessageSquare, ArrowRight, TrendingUp, MoreHorizontal, Clock, CheckCircle2, ClipboardList } from 'lucide-react';

import { subscribeToNotes, subscribeToAssignments, subscribeToAnnouncements } from '../../lib/firestore';
import { NotificationHistory } from '../../components/NotificationHistory';
import { NetworkList } from './components/NetworkList';
import { AiBuddy } from '../../components/AiBuddy';

const defaultStats = [
  { label: 'Total Notes', value: '0', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { label: 'Assignments', value: '0', icon: ClipboardList, color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-100' },
  { label: 'Pending Tasks', value: '0', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Announcements', value: '0', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
];

export function DashboardHome() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(defaultStats);
  const [activities, setActivities] = useState([]);

  const [greeting] = useState('Welcome back');

  // Keep latest data in refs for cross-listener activity computation
  const notesRef = React.useRef([]);
  const assignmentsRef = React.useRef([]);
  const announcementsRef = React.useRef([]);

  const rebuildActivities = () => {
    const allActivities = [
      ...notesRef.current.slice(0, 3).map(n => ({ id: 'n-' + n.id, type: 'note', title: n.title, sub: 'New note uploaded', time: n.date, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600', path: '/notes' })),
      ...assignmentsRef.current.slice(0, 3).map(a => ({ id: 'a-' + a.id, type: 'assignment', title: a.title, sub: `Due: ${a.deadline}`, time: a.deadline, icon: ClipboardList, color: 'bg-sky-100 text-sky-700', path: '/assignments' })),
      ...announcementsRef.current.slice(0, 2).map(a => ({ id: 'an-' + a.id, type: 'announcement', title: a.title, sub: 'Posted announcement', time: a.date, icon: MessageSquare, color: 'bg-purple-100 text-purple-600', path: '/announcements' })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
    setActivities(allActivities);
  };

  // Real-time listeners for all three collections
  useEffect(() => {
    if (!userProfile) return;

    const unsubNotes = subscribeToNotes(userProfile, (data) => {
      notesRef.current = data;
      setStatsData(prev => {
        const next = [...prev];
        next[0] = { ...defaultStats[0], value: data.length.toString() };
        return next;
      });
      rebuildActivities();
    });

    const unsubAssignments = subscribeToAssignments(userProfile, (data) => {
      assignmentsRef.current = data;
      const uid = user?.uid;
      const pendingCount = data.filter(a => {
        if (a.userStatuses && a.userStatuses[uid]) return a.userStatuses[uid] === 'Pending';
        if (a.userId === uid) return (a.status || 'Pending') === 'Pending';
        return true; // default Pending for others
      }).length;
      setStatsData(prev => {
        const next = [...prev];
        next[1] = { ...defaultStats[1], value: data.length.toString() };
        next[2] = { ...defaultStats[2], value: pendingCount.toString() };
        return next;
      });
      rebuildActivities();
    });

    const unsubAnnouncements = subscribeToAnnouncements(userProfile, (data) => {
      announcementsRef.current = data;
      setStatsData(prev => {
        const next = [...prev];
        next[3] = { ...defaultStats[3], value: data.length.toString() };
        return next;
      });
      rebuildActivities();
    });

    return () => {
      unsubNotes();
      unsubAssignments();
      unsubAnnouncements();
    };
  }, [userProfile]);

  const compactMode = !!userProfile?.settings?.appearance?.compactMode;

  return (
    <div className={`flex flex-col ${compactMode ? 'gap-4' : 'gap-8'}`}>
      {/* Welcome Banner */}
      <div className="relative overflow-visible md:overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200">

        {/* Banner Content Container */}
        <div className="flex flex-col md:flex-row min-h-[340px]">

          {/* Left Text Content */}
          <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 order-2 md:order-1 flex flex-col justify-center">
            <div className="inline-flex max-w-max items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Academic Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{greeting}, {user?.displayName?.split(' ')[0] || userProfile?.name?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
              You have <span className="font-bold text-white">{statsData[2].value} pending tasks</span> for this week. Keep up the momentum!
            </p>

            <div className="flex flex-wrap gap-4 mt-8 relative z-30">
              <button onClick={() => navigate('/assignments')} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                View Tasks <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/calendar')} className="px-6 py-3 bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold hover:bg-indigo-500/70 transition-all">
                Check Calendar
              </button>
            </div>
          </div>

          {/* Right AI Buddy 3D View (Floating Absolute) */}
          <div className="absolute right-0 bottom-0 md:-top-16 md:-right-4 w-[120%] md:w-[60%] h-[350px] md:h-[500px] z-20 pointer-events-none flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
            <AiBuddy
              pendingTasks={parseInt(statsData[2].value || '0')}
              assignmentsData={assignmentsRef.current}
              currentUserId={user?.uid}
              userName={userProfile?.name || user?.displayName || 'Dost'}
              announcementsCount={parseInt(statsData[3].value || '0')}
              notesCount={parseInt(statsData[0].value || '0')}
            />
          </div>

        </div>

        {/* Abstract shapes inside banner */}
        <div className="absolute top-0 left-1/2 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-30 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 z-0 pointer-events-none"></div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${compactMode ? 'gap-3' : 'gap-6'}`}>
        {statsData.map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow ${compactMode ? 'p-4' : 'p-6'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 text-slate-900">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <button onClick={() => navigate('/notes')} className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
            </div>

            <div className={compactMode ? 'space-y-1' : 'space-y-4'}>
              {activities.length > 0 ? (
                activities.map((item) => (
                  <div key={item.id} onClick={() => navigate(item.path)} className={`flex items-center gap-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100 ${compactMode ? 'py-2 px-3' : 'p-4'}`}>
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{item.time}</span>
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <Clock size={20} />
                  </div>
                  <p className="text-gray-500 font-medium">No recent activity found</p>
                  <p className="text-xs text-gray-400">Your recent actions will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8 h-fit text-slate-900">
          {/* Network / Peers Feature */}
          <NetworkList userProfile={userProfile} />

          {/* Notification History */}
          <NotificationHistory />
        </div>
      </div>
    </div>
  );
}
