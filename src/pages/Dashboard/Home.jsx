import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, AlertCircle, Calendar, MessageSquare, ArrowRight, TrendingUp, MoreHorizontal, Clock, CheckCircle2 } from 'lucide-react';

import { subscribeToNotes, subscribeToAssignments, subscribeToAnnouncements } from '../../lib/firestore';
import { NotificationHistory } from '../../components/NotificationHistory';


const defaultStats = [
  { label: 'Total Notes', value: '0', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { label: 'Assignments', value: '0', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { label: 'Pending Tasks', value: '0', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { label: 'Announcements', value: '0', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
];

export function DashboardHome() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(defaultStats);
  const [activities, setActivities] = useState([]);
  const [greeting, setGreeting] = useState('Good morning');

  // Keep latest data in refs for cross-listener activity computation
  const notesRef = React.useRef([]);
  const assignmentsRef = React.useRef([]);
  const announcementsRef = React.useRef([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const rebuildActivities = () => {
    const allActivities = [
      ...notesRef.current.slice(0, 3).map(n => ({ id: 'n-' + n.id, type: 'note', title: n.title, sub: 'New note uploaded', time: n.date, icon: BookOpen, color: 'bg-indigo-100 text-indigo-600', path: '/notes' })),
      ...assignmentsRef.current.slice(0, 3).map(a => ({ id: 'a-' + a.id, type: 'assignment', title: a.title, sub: `Due: ${a.deadline}`, time: a.deadline, icon: AlertCircle, color: 'bg-orange-100 text-orange-600', path: '/assignments' })),
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
      setStatsData(prev => {
        const next = [...prev];
        next[1] = { ...defaultStats[1], value: data.length.toString() };
        next[2] = { ...defaultStats[2], value: data.filter(a => a.status === 'Pending').length.toString() };
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

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-8 md:p-12 shadow-2xl shadow-indigo-200">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Academic Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{greeting}, {user?.displayName?.split(' ')[0] || userProfile?.name?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-indigo-100 text-lg max-w-xl leading-relaxed">
            You have <span className="font-bold text-white">{statsData[2].value} pending tasks</span> for this week. Keep up the momentum!
          </p>

          <div className="flex gap-4 mt-8">
            <button onClick={() => navigate('/assignments')} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
              View Tasks <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/calendar')} className="px-6 py-3 bg-indigo-500/50 backdrop-blur-md text-white border border-white/20 rounded-xl font-bold hover:bg-indigo-500/70 transition-all">
              Check Calendar
            </button>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button onClick={() => navigate('/notes')} className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div key={item.id} onClick={() => navigate(item.path)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
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

        {/* Quick Actions */}

        <div className="space-y-8 h-fit">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => navigate('/notes')} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/50 transition-all group text-left">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={20} />
                </div>
                <div>
                  <span className="block font-bold text-gray-900">Upload Note</span>
                  <span className="text-xs text-gray-500">Share resources</span>
                </div>
              </button>

              <button onClick={() => navigate('/assignments')} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/50 transition-all group text-left">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <span className="block font-bold text-gray-900">Add Assignment</span>
                  <span className="text-xs text-gray-500">Track deadlines</span>
                </div>
              </button>

              <button onClick={() => navigate('/calendar')} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/50 transition-all group text-left">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="block font-bold text-gray-900">View Calendar</span>
                  <span className="text-xs text-gray-500">Check schedule</span>
                </div>
              </button>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Connect your Google Calendar to sync assignments automatically.
              </p>
              <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">Connect Now</button>
            </div>
          </div>

          <NotificationHistory />
        </div>

      </div>
    </div>
  );
}
