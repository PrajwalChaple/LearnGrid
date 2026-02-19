/**
 * Google Calendar API Helper
 * Creates calendar events for assignments when user has connected their Google Calendar.
 */

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

/**
 * Creates a Google Calendar event for an assignment.
 * @param {string} accessToken - Google OAuth access token
 * @param {Object} assignment - Assignment data { title, subject, deadline }
 * @returns {Promise<{ success: boolean, eventId?: string, error?: string }>}
 */
export async function addEventToCalendar(accessToken, assignment) {
    if (!accessToken) {
        return { success: false, error: 'No access token' };
    }

    const event = {
        summary: `Assignment: ${assignment.title}`,
        description: `Subject: ${assignment.subject}\nAdded via LearnGrid`,
        start: { date: assignment.deadline },   // All-day event
        end: { date: assignment.deadline },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 1440 },  // 1 day before
                { method: 'popup', minutes: 60 },     // 1 hour before
            ],
        },
    };

    try {
        const response = await fetch(CALENDAR_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error('[Calendar] Failed to create event:', err);
            return { success: false, error: err.error?.message || `HTTP ${response.status}` };
        }

        const data = await response.json();
        console.log('[Calendar] Event created:', data.id);
        return { success: true, eventId: data.id };
    } catch (err) {
        console.error('[Calendar] Network error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Checks if user has a Google Calendar token saved.
 */
export function isCalendarConnected() {
    return !!sessionStorage.getItem('gcal_token');
}

/**
 * Gets the saved access token.
 */
export function getCalendarToken() {
    return sessionStorage.getItem('gcal_token');
}
