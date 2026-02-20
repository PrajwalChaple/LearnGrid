/**
 * Google Calendar API Helper
 * Manages two-way sync:
 * 1. Adds pending assignments to Calendar
 * 2. Removes completed/deleted assignments from Calendar
 *
 * Uses localStorage to track synced events: { assignmentId: eventId }
 */

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

// Storage key for sync mapping
const getStorageKey = (userId) => `gcal_synced_assignments_${userId}`;

function getSyncedMap(userId) {
    try {
        const stored = localStorage.getItem(getStorageKey(userId));
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

function saveSyncedMap(userId, map) {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(map));
}

/**
 * Checks if user has a Google Calendar token saved.
 */
export function isCalendarConnected() {
    return !!sessionStorage.getItem('gcal_token');
}

/**
 * Returns the Google Calendar access token, or null if not connected.
 */
export function getCalendarToken() {
    return sessionStorage.getItem('gcal_token');
}

/**
 * Saves an assignment's calendar event ID to the sync map.
 * Call this after successfully adding an event to Calendar.
 */
export function saveEventToSyncMap(userId, assignmentId, eventId) {
    const map = getSyncedMap(userId);
    map[assignmentId] = eventId;
    saveSyncedMap(userId, map);
}

/**
 * Removes a single item from Google Calendar and cleans up the sync map.
 * Use when an assignment is completed or deleted.
 */
export async function removeCalendarEvent(userId, assignmentId) {
    const accessToken = sessionStorage.getItem('gcal_token');
    if (!accessToken || !userId) return;

    const map = getSyncedMap(userId);
    const eventId = map[assignmentId];
    if (!eventId) return; // Not synced to calendar

    console.log('[Calendar] Removing event for item:', assignmentId);
    await deleteEventFromCalendar(accessToken, eventId);
    delete map[assignmentId];
    saveSyncedMap(userId, map);
}

/**
 * Main Sync Function
 * Called by Dashboard when assignments/announcements change.
 *
 * @param {Object} user - Current user object
 * @param {Array} assignments - List of ACTIVE/PENDING assignments for this user
 * @param {Array} announcements - List of ACTIVE announcements
 */
export async function syncCalendar(user, assignments, announcements) {
    const accessToken = sessionStorage.getItem('gcal_token');
    if (!accessToken || !user) return; // Not connected

    const userId = user.uid;
    const syncedMap = getSyncedMap(userId);
    const newSyncedMap = { ...syncedMap };

    // 1. Identify Items to ADD (Present in list, missing in map)
    const allItems = [...assignments, ...announcements];
    const itemMap = new Map(); // id -> item

    for (const item of allItems) {
        itemMap.set(item.id, item);
        const isSynced = syncedMap[item.id];

        if (!isSynced) {
            // New Item -> Add to Calendar
            console.log('[Calendar] Adding event for:', item.title);
            const result = await addEventToCalendar(accessToken, item);
            if (result.success && result.eventId) {
                newSyncedMap[item.id] = result.eventId;
            }
        }
    }

    // 2. Identify Items to REMOVE (Present in map, missing in list)
    // If an item is in syncedMap but NOT in the provided 'active' lists,
    // it means it was Completed or Deleted -> Remove from Calendar.
    for (const [itemId, eventId] of Object.entries(syncedMap)) {
        if (!itemMap.has(itemId)) {
            // Item is no longer active -> Remove from Calendar
            console.log('[Calendar] Removing event for completed/deleted item:', itemId);
            await deleteEventFromCalendar(accessToken, eventId);
            delete newSyncedMap[itemId];
        }
    }

    // Save updated map
    saveSyncedMap(userId, newSyncedMap);
}

/**
 * Adds an event to Google Calendar.
 */
export async function addEventToCalendar(accessToken, item) {
    const isAssignment = item.deadline !== undefined;
    const date = isAssignment ? item.deadline : item.date;

    const event = {
        summary: `${isAssignment ? 'Assignment' : 'Announcement'}: ${item.title}`,
        description: `Subject: ${item.subject}\n\n${item.description || ''}`,
        start: { date: date }, // All-day event
        end: { date: date },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 1440 }, // 1 day before
                { method: 'popup', minutes: 60 },    // 1 hour before
            ],
        },
    };

    try {
        const response = await fetch(CALENDAR_API_BASE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            // Rate limiting or auth error
            if (response.status === 401) {
                sessionStorage.removeItem('gcal_token'); // Invalid token
                return { success: false, error: 'Auth failed' };
            }
            return { success: false, error: `HTTP ${response.status}` };
        }

        const data = await response.json();
        return { success: true, eventId: data.id };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Deletes an event from Google Calendar.
 */
export async function deleteEventFromCalendar(accessToken, eventId) {
    if (!eventId) return;

    try {
        await fetch(`${CALENDAR_API_BASE}/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
