// ============================================================
// 🔧 AI TOOLS — Actions that AIBuddy can execute
// ============================================================
// These are the "hands" of AIBuddy. Each tool function interacts
// with Firestore or the app to perform real actions.
// ALL write operations require user confirmation via the UI.
// ============================================================

import { getAssignments, addAnnouncement } from './firestore';

// ─── Tool: Get Pending Assignments ───────────────────────────
export async function getPendingAssignments(userProfile, currentUserId) {
    if (!userProfile) return { success: false, message: 'Profile not loaded' };

    try {
        const assignments = await getAssignments(userProfile);

        // Filter to pending only
        const pending = assignments.filter(a => {
            if (a.userStatuses && a.userStatuses[currentUserId]) {
                return a.userStatuses[currentUserId] === 'Pending';
            }
            if (a.userId === currentUserId) {
                return (a.status || 'Pending') === 'Pending';
            }
            return true;
        });

        if (pending.length === 0) {
            return {
                success: true,
                count: 0,
                message: 'Koi pending assignment nahi hai! 🎉 Chill kar!',
                data: []
            };
        }

        const summaries = pending.slice(0, 5).map((a, i) => {
            const deadline = a.deadline || 'No deadline';
            const assigner = a.userId === currentUserId
                ? 'You'
                : (a.createdBy || a.userName || 'Someone');
            return `${i + 1}. **${a.title}** — Due: ${deadline} (by ${assigner})`;
        });

        return {
            success: true,
            count: pending.length,
            message: `Tere paas ${pending.length} pending assignment${pending.length > 1 ? 's' : ''} hain:\n\n${summaries.join('\n')}`,
            data: pending
        };
    } catch (error) {
        console.error('[AITools] Error fetching assignments:', error);
        return { success: false, message: 'Assignments fetch karne mein dikkat aayi 😥' };
    }
}

// ─── Tool: Draft Announcement (returns draft, doesn't post) ──
export function draftAnnouncement(params) {
    const { title, description, type = 'General' } = params;

    if (!title || !description) {
        return {
            success: false,
            message: 'Title aur description dono chahiye announcement ke liye!'
        };
    }

    return {
        success: true,
        draft: {
            title,
            description,
            type,
            date: new Date().toLocaleDateString()
        },
        message: `📢 Announcement draft ready!\n\n**Title:** ${title}\n**Type:** ${type}\n\n${description}\n\n*Confirm karo toh main post kar dunga!*`
    };
}

// ─── Tool: Execute Announcement (actually posts to Firestore) ─
export async function executeAnnouncement(draft, userProfile, user) {
    if (!draft || !userProfile || !user) {
        return { success: false, message: 'Missing data to post announcement' };
    }

    try {
        const announcementData = {
            title: draft.title,
            description: draft.description,
            type: draft.type || 'General',
            date: new Date().toLocaleDateString(),
            userId: user.uid,
            userName: user.displayName || userProfile?.name || 'AIBuddy User',
            roleType: userProfile.roleType,
            institutionName: userProfile.institutionName,
            ...(userProfile.roleType === 'college'
                ? { department: userProfile.department, year: userProfile.year }
                : { standard: userProfile.standard, section: userProfile.section }),
        };

        const newId = await addAnnouncement(announcementData);

        return {
            success: true,
            id: newId,
            message: `✅ Announcement "${draft.title}" successfully post ho gaya! Announcements page pe jaake check karo.`
        };
    } catch (error) {
        console.error('[AITools] Error posting announcement:', error);
        return { success: false, message: 'Announcement post karne mein error aaya 😥. Dubara try karo.' };
    }
}

// ─── Tool: Summarize Dashboard ──────────────────────────────
export async function summarizeDashboard(userProfile, currentUserId) {
    if (!userProfile) return { success: false, message: 'Profile not loaded' };

    try {
        const assignResult = await getPendingAssignments(userProfile, currentUserId);
        const pendingCount = assignResult.count || 0;

        const userName = userProfile.name || 'Student';
        const institution = userProfile.institutionName || 'your institution';
        const dept = userProfile.department || userProfile.standard || '';
        const year = userProfile.year || '';

        let summary = `📊 **${userName} ka Dashboard Summary:**\n\n`;
        summary += `🏫 Institution: ${institution}\n`;
        if (dept) summary += `📚 Branch: ${dept}\n`;
        if (year) summary += `📅 Year: ${year}\n\n`;

        if (pendingCount === 0) {
            summary += `✅ Koi pending assignment nahi hai — tu bilkul free hai! Maze kar! 🎉`;
        } else {
            summary += `⚠️ ${pendingCount} assignment${pendingCount > 1 ? 's' : ''} pending hai${pendingCount > 1 ? 'n' : ''}.\n\n`;
            summary += assignResult.message;
        }

        return { success: true, message: summary };
    } catch (error) {
        console.error('[AITools] Dashboard summary error:', error);
        return { success: false, message: 'Dashboard summary mein issue aaya 😥' };
    }
}

// ─── Tool: Navigate To Page ─────────────────────────────────
export function navigateTo(page) {
    const validPages = {
        dashboard: '/dashboard',
        notes: '/notes',
        assignments: '/assignments',
        announcements: '/announcements',
        calendar: '/calendar',
        profile: '/profile',
        settings: '/settings',
    };

    const path = validPages[page?.toLowerCase()];
    if (!path) {
        return {
            success: false,
            message: `"${page}" page nahi mila. Available pages: ${Object.keys(validPages).join(', ')}`
        };
    }

    return {
        success: true,
        path,
        message: `🔗 Chal, tujhe **${page}** page pe le chalta hu!`
    };
}

// ─── Tool Router (executes the right tool) ───────────────────
export async function executeTool(toolCall, userProfile, user) {
    const { tool, params } = toolCall;

    switch (tool) {
        case 'get_pending_assignments':
            return await getPendingAssignments(userProfile, user?.uid);

        case 'draft_announcement':
            return draftAnnouncement(params);

        case 'summarize_dashboard':
            return await summarizeDashboard(userProfile, user?.uid);

        case 'navigate_to':
            return navigateTo(params?.page);

        default:
            return { success: false, message: `Unknown tool: ${tool}` };
    }
}
