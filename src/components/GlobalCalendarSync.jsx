import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isCalendarConnected, syncCalendar } from '../lib/googleCalendar';
import { subscribeToAssignments, subscribeToAnnouncements } from '../lib/firestore';

export function GlobalCalendarSync() {
    const { user, userProfile } = useAuth();
    const [connected, setConnected] = useState(isCalendarConnected());
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    // Listen for manual calendar connection changes from Settings or Auth
    useEffect(() => {
        const handleConnectionChange = () => {
            setConnected(isCalendarConnected());
        };
        window.addEventListener('calendarConnectionChanged', handleConnectionChange);
        return () => window.removeEventListener('calendarConnectionChanged', handleConnectionChange);
    }, []);

    // Listen to Assignments
    useEffect(() => {
        if (!userProfile || !connected) return;

        const unsubAssignments = subscribeToAssignments(userProfile, (data) => {
            // Filter to only ACTIVE/PENDING assignments for this user
            const uid = user?.uid;
            const activeAssignments = data.filter(a => {
                const userStatus = a.userStatuses && a.userStatuses[uid] ? a.userStatuses[uid] : null;
                if (userStatus) {
                    return userStatus === 'Pending';
                }

                // If I am the owner, fallback to top-level status
                if (a.userId === uid) {
                    return (a.status || 'Pending') === 'Pending';
                }

                // Otherwise user 2 defaults to pending
                return true;
            });
            setAssignments(activeAssignments);
        });

        return () => unsubAssignments();
    }, [userProfile, connected, user?.uid]);

    // Listen to Announcements
    useEffect(() => {
        if (!userProfile || !connected) return;

        const unsubAnnouncements = subscribeToAnnouncements(userProfile, (data) => {
            setAnnouncements(data);
        });

        return () => unsubAnnouncements();
    }, [userProfile, connected]);

    // Trigger sync whenever the filtered data changes
    useEffect(() => {
        if (!user || !connected) return;

        // Debounce slightly to wait for both assignments and announcements to load initially
        const timer = setTimeout(() => {
            syncCalendar(user, assignments, announcements).catch(err => {
                console.error('[GlobalCalendarSync] Sync failed:', err);
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [assignments, announcements, user, connected]);

    return null; // Invisible component
}
