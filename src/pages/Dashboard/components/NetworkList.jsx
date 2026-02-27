import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';

export function NetworkList({ userProfile }) {
    const { user } = useAuth();
    const isCollege = userProfile?.roleType === 'college';

    const collegeFilters = ['All', 'Branch', 'Year', 'Section'];
    const schoolFilters = ['All', 'Class', 'Section'];
    const filterOptions = isCollege ? collegeFilters : schoolFilters;

    const [filter, setFilter] = useState('All');
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch real peers from Firestore users collection
    useEffect(() => {
        if (!userProfile?.institutionName) {
            setLoading(false);
            return;
        }

        const fetchPeers = async () => {
            setLoading(true);
            try {
                // Base query: same institution, same roleType
                const constraints = [
                    where('institutionName', '==', userProfile.institutionName),
                    where('roleType', '==', userProfile.roleType),
                ];

                const q = query(collection(db, 'users'), ...constraints);
                const snap = await getDocs(q);

                const allPeers = snap.docs
                    .filter(d => d.id !== user?.uid) // Exclude current user
                    .map(d => {
                        const data = d.data();
                        return {
                            id: d.id,
                            name: data.name || 'Unknown',
                            department: data.department || '',
                            year: data.year || '',
                            section: data.section || '',
                            standard: data.standard || '',
                            rollNumber: data.rollNumber || '',
                            photoURL: data.photoURL || null,
                        };
                    });

                setPeers(allPeers);
            } catch (err) {
                console.error('[NetworkList] Error fetching peers:', err);
                setPeers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPeers();
    }, [userProfile?.institutionName, userProfile?.roleType, user?.uid]);

    // Build detail string for display
    const getPeerDetails = (p) => {
        if (isCollege) {
            const parts = [];
            if (p.department) parts.push(p.department);
            if (p.year) parts.push(`${p.year} Year`);
            if (p.section) parts.push(`Sec ${p.section}`);
            return parts.join(' · ') || 'Student';
        } else {
            const parts = [];
            if (p.standard) parts.push(`Class ${p.standard}`);
            if (p.section) parts.push(`Sec ${p.section}`);
            return parts.join(' · ') || 'Student';
        }
    };

    // Generate avatar URL from name
    const getAvatar = (p) => {
        if (p.photoURL) return p.photoURL;
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`;
    };

    // Apply client-side filter (case-insensitive for legacy data)
    const eq = (a, b) => (a || '').toUpperCase().trim() === (b || '').toUpperCase().trim();
    const userDept = userProfile?.department || '';
    const userYear = userProfile?.year || '';
    const userSection = userProfile?.section || '';
    const userStandard = userProfile?.standard || '';

    const filteredPeers = peers.filter(p => {
        if (filter === 'All') return true;

        if (isCollege) {
            if (filter === 'Branch') return eq(p.department, userDept);
            if (filter === 'Year') return eq(p.year, userYear);
            if (filter === 'Section') return eq(p.section, userSection);
        } else {
            if (filter === 'Class') return eq(p.standard, userStandard);
            if (filter === 'Section') return eq(p.section, userSection);
        }
        return false;
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{ maxHeight: '520px' }}>
            <div className="p-6 border-b border-slate-50">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Users size={20} className="text-indigo-500" /> Peers
                    </h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        {loading ? '...' : `${filteredPeers.length} found`}
                    </span>
                </div>

                {/* Filters */}
                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl overflow-x-auto no-scrollbar">
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === opt
                                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-indigo-400" />
                    </div>
                ) : filteredPeers.length > 0 ? (
                    filteredPeers.map(peer => (
                        <div key={peer.id} className="group p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <img src={getAvatar(peer)} alt={peer.name} className="w-11 h-11 rounded-xl bg-slate-100 group-hover:scale-105 transition-transform object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">{peer.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium truncate">{getPeerDetails(peer)}</p>
                                </div>
                                <div className="hidden group-hover:flex items-center justify-center w-7 h-7 rounded-lg bg-white shadow-sm text-indigo-600">
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Users className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-sm font-bold text-slate-500">No peers found</p>
                        <p className="text-xs text-slate-400 font-medium">Try a different filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
