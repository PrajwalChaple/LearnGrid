import { db } from '../firebase';
import {
    doc, getDoc, setDoc, updateDoc,
    collection, addDoc, getDocs, deleteDoc,
    query, where, orderBy, serverTimestamp, onSnapshot, arrayUnion
} from 'firebase/firestore';

// ─── User Profile ───────────────────────────────────────────────

export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { uid: snap.id, ...snap.data() } : null;
}

export async function saveUserProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
}

/** Delete user profile document (call before deleting Auth account). */
export async function deleteUserProfile(uid) {
    await deleteDoc(doc(db, 'users', uid));
}

// ─── Class filter builder ───────────────────────────────────────

function buildClassFilters(profile) {
    const filters = [
        where('institutionName', '==', profile.institutionName || ''),
        where('roleType', '==', profile.roleType || ''),
    ];

    if (profile.roleType === 'college') {
        filters.push(where('department', '==', profile.department || ''));
        filters.push(where('year', '==', profile.year || ''));
    } else {
        filters.push(where('standard', '==', profile.standard || ''));
        filters.push(where('section', '==', profile.section || ''));
    }

    return filters;
}

function buildClassQuery(collectionName, profile) {
    const filters = buildClassFilters(profile);
    // NOTE: Do NOT use orderBy here — it requires a composite index in Firestore
    // that must be manually created. We sort client-side instead.
    return query(collection(db, collectionName), ...filters);
}

// ─── Generic CRUD with class isolation ──────────────────────────

async function addItem(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

async function getItems(collectionName, profile) {
    const qClass = buildClassQuery(collectionName, profile);
    const snapClass = await getDocs(qClass);
    let classItems = snapClass.docs.map(d => ({ id: d.id, ...d.data() }));

    const uid = profile?.uid || profile?.id;
    let userItems = [];
    if (uid) {
        const qUser = query(collection(db, collectionName), where('userId', '==', uid));
        const snapUser = await getDocs(qUser);
        userItems = snapUser.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    const allMap = new Map();
    [...classItems, ...userItems].forEach(item => {
        allMap.set(item.id, item);
    });
    
    let items = Array.from(allMap.values());

    // Sort client-side by createdAt descending
    items.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0) || 0;
        const tb = b.createdAt?.toMillis?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0) || 0;
        return tb - ta;
    });
    return items;
}

async function hideItem(collectionName, id, userId) {
    if (!userId) return;
    // We update the user's personal profile document, avoiding permission issues on shared items.
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        [`hidden_${collectionName}`]: arrayUnion(id)
    });
}

// ─── Real-time listeners ────────────────────────────────────────

function subscribeToCollection(collectionName, profile, callback) {
    const qClass = buildClassQuery(collectionName, profile);
    const uid = profile?.uid || profile?.id;
    console.log(`[Firestore] Subscribing to ${collectionName} for`, {
        institutionName: profile.institutionName,
        roleType: profile.roleType,
        uid: uid
    });
    
    let classItems = [];
    let userItems = [];
    
    const mergeAndCallback = () => {
        const allMap = new Map();
        [...classItems, ...userItems].forEach(item => {
            allMap.set(item.id, item);
        });
        
        let items = Array.from(allMap.values());

        // Filter out items that are soft-deleted for this user
        if (profile) {
            const hiddenKeys = profile[`hidden_${collectionName}`] || [];
            items = items.filter(i => !hiddenKeys.includes(i.id));
        }

        // Sort client-side by createdAt descending
        items.sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0) || 0;
            const tb = b.createdAt?.toMillis?.() || (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0) || 0;
            return tb - ta;
        });
        callback(items);
    };

    const unsubClass = onSnapshot(qClass, (snapshot) => {
        classItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        mergeAndCallback();
    }, (err) => {
        console.error(`[Firestore] Error listening to ${collectionName} (class):`, err);
        callback([]);
    });

    let unsubUser = () => {};
    if (uid) {
        const qUser = query(collection(db, collectionName), where('userId', '==', uid));
        unsubUser = onSnapshot(qUser, (snapshot) => {
            userItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            mergeAndCallback();
        }, (err) => {
            console.error(`[Firestore] Error listening to ${collectionName} (user):`, err);
        });
    }

    return () => {
        unsubClass();
        unsubUser();
    };
}

export function subscribeToNotes(profile, callback) {
    return subscribeToCollection('notes', profile, callback);
}

export function subscribeToAssignments(profile, callback) {
    return subscribeToCollection('assignments', profile, callback);
}

export function subscribeToAnnouncements(profile, callback) {
    return subscribeToCollection('announcements', profile, callback);
}

// ─── Notes ──────────────────────────────────────────────────────

export function addNote(data) { return addItem('notes', data); }
export function getNotes(profile) { return getItems('notes', profile); }
export function hideNoteDoc(id, userId) { return hideItem('notes', id, userId); }

// ─── Assignments ────────────────────────────────────────────────

export function addAssignment(data) { return addItem('assignments', data); }
export function getAssignments(profile) { return getItems('assignments', profile); }
export function hideAssignmentDoc(id, userId) { return hideItem('assignments', id, userId); }

// ─── Announcements ─────────────────────────────────────────────

export function addAnnouncement(data) { return addItem('announcements', data); }
export function getAnnouncements(profile) { return getItems('announcements', profile); }
export function hideAnnouncementDoc(id, userId) { return hideItem('announcements', id, userId); }

// ─── Update assignment status ───────────────────────────────────

export async function updateAssignment(id, fields) {
    await updateDoc(doc(db, 'assignments', id), fields);
}

// ─── Dynamic Audience Queries ───────────────────────────────────

/**
 * Get distinct institution names for a given roleType ('school' or 'college').
 * Derives from user profiles — returns schools/colleges that have registered users.
 */
export async function getDistinctInstitutions(roleType) {
    const q = query(collection(db, 'users'), where('roleType', '==', roleType));
    const snap = await getDocs(q);
    const names = new Set();
    snap.docs.forEach(d => {
        const name = d.data().institutionName;
        if (name) names.add(name);
    });
    return [...names].sort();
}

/**
 * Get distinct branches (departments) for a given college.
 */
export async function getBranchesForCollege(collegeName) {
    const q = query(
        collection(db, 'users'),
        where('roleType', '==', 'college'),
        where('institutionName', '==', collegeName)
    );
    const snap = await getDocs(q);
    const branches = new Set();
    snap.docs.forEach(d => {
        const dept = d.data().department;
        if (dept) branches.add(dept);
    });
    return [...branches].sort();
}

/**
 * Get sections for a given school + standard.
 * Always includes default A–E, plus any extras found in DB.
 */
export async function getSectionsForSchool(schoolName, standard) {
    const defaults = ['A', 'B', 'C', 'D', 'E'];
    const q = query(
        collection(db, 'users'),
        where('roleType', '==', 'school'),
        where('institutionName', '==', schoolName),
        where('standard', '==', standard)
    );
    const snap = await getDocs(q);
    const sections = new Set(defaults);
    snap.docs.forEach(d => {
        const sec = d.data().section;
        if (sec) sections.add(sec.toUpperCase());
    });
    return [...sections].sort();
}

/**
 * Get divisions for a given college + branch + year.
 * Always includes default A–E, plus any extras found in DB.
 */
export async function getDivisionsForCollege(collegeName, branch, year) {
    const defaults = ['A', 'B', 'C', 'D', 'E'];
    const q = query(
        collection(db, 'users'),
        where('roleType', '==', 'college'),
        where('institutionName', '==', collegeName),
        where('department', '==', branch),
        where('year', '==', year)
    );
    const snap = await getDocs(q);
    const divisions = new Set(defaults);
    snap.docs.forEach(d => {
        const sec = d.data().section;
        if (sec) divisions.add(sec.toUpperCase());
    });
    return [...divisions].sort();
}

/**
 * Build Firestore constraints from explicit audience parameters.
 * Only adds constraints for non-empty fields.
 */
function buildDynamicConstraints(params) {
    const constraints = [];
    if (params.roleType) constraints.push(where('roleType', '==', params.roleType));
    if (params.institutionName) constraints.push(where('institutionName', '==', params.institutionName));
    if (params.standard) constraints.push(where('standard', '==', params.standard));
    if (params.section) constraints.push(where('section', '==', params.section));
    if (params.department) constraints.push(where('department', '==', params.department));
    if (params.year) constraints.push(where('year', '==', params.year));
    return constraints;
}

/**
 * Get recipient count using explicit audience parameters.
 * @param {Object} params - { roleType, institutionName, standard?, section?, department?, year? }
 */
export async function getDynamicRecipientCount(params, currentUid = '') {
    const constraints = buildDynamicConstraints(params);
    if (constraints.length === 0) return 0;
    const q = query(collection(db, 'users'), ...constraints);
    const snap = await getDocs(q);
    return currentUid
        ? snap.docs.filter(d => d.id !== currentUid).length
        : snap.size;
}

/**
 * Get recipients using explicit audience parameters.
 * @param {Object} params - { roleType, institutionName, standard?, section?, department?, year? }
 */
export async function getDynamicRecipients(params, currentUid = '') {
    const constraints = buildDynamicConstraints(params);
    if (constraints.length === 0) return [];
    const q = query(collection(db, 'users'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs
        .filter(d => !currentUid || d.id !== currentUid)
        .map(d => ({ uid: d.id, ...d.data() }));
}

// ─── Notifications ──────────────────────────────────────────────

export async function createNotification(data) {
    const expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    return addItem('notifications', { ...data, expireAt });
}


export async function getRecipientCount(profile, scope, currentUid = '') {
    if (scope === 'none') return 0;

    const constraints = buildRecipientConstraints(profile, scope);
    console.log('[getRecipientCount] scope:', scope, 'constraints:', constraints.length);
    console.log('[getRecipientCount] profile fields:', {
        institutionName: profile?.institutionName,
        department: profile?.department,
        year: profile?.year,
        roleType: profile?.roleType,
    });

    const q = query(collection(db, 'users'), ...constraints);
    const snap = await getDocs(q);

    // Exclude current user from count
    const count = currentUid
        ? snap.docs.filter(d => d.id !== currentUid).length
        : snap.size;

    console.log('[getRecipientCount] total found:', snap.size, 'after excluding self:', count);
    return count;
}

export async function getRecipients(profile, scope, currentUid = '') {
    if (scope === 'none') return [];

    const constraints = buildRecipientConstraints(profile, scope);
    const q = query(collection(db, 'users'), ...constraints);

    const snap = await getDocs(q);

    // Exclude current user and return data with uid
    return snap.docs
        .filter(d => !currentUid || d.id !== currentUid)
        .map(d => ({ uid: d.id, ...d.data() }));
}

function buildRecipientConstraints(profile, scope) {
    let constraints = [
        where('institutionName', '==', profile.institutionName),
    ];

    if (scope === 'class') {
        // College: same dept + year + section; School: same standard + section
        if (profile.roleType === 'college') {
            constraints.push(where('department', '==', profile.department));
            constraints.push(where('year', '==', profile.year));
            if (profile.section) constraints.push(where('section', '==', profile.section));
        } else {
            constraints.push(where('standard', '==', profile.standard));
            constraints.push(where('section', '==', profile.section));
        }
    } else if (scope === 'year') {
        // College: same dept + year (all sections)
        constraints.push(where('department', '==', profile.department));
        constraints.push(where('year', '==', profile.year));
    } else if (scope === 'branch') {
        // College: same department (all years)
        if (profile.roleType === 'college') {
            constraints.push(where('department', '==', profile.department));
        } else {
            constraints.push(where('standard', '==', profile.standard));
        }
    } else if (scope === 'section') {
        // School: same standard + section
        if (profile.roleType === 'school') {
            constraints.push(where('standard', '==', profile.standard));
            constraints.push(where('section', '==', profile.section));
        }
    } else if (scope === 'standard') {
        // School: same standard (all sections)
        if (profile.roleType === 'school') {
            constraints.push(where('standard', '==', profile.standard));
        }
    }
    // scope === 'college' or 'school' => entire institution (no extra filters needed)

    return constraints;
}


export function subscribeToNotifications(userId, callback) {
    // Listen for notifications sent BY this user
    const q = query(
        collection(db, 'notifications'),
        where('senderId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error("Error listening to notifications:", err);
    });
}

// ─── User Notifications (per-recipient inbox) ───────────────

/**
 * Creates one notification document per recipient in user_notifications.
 * @param {Array} recipients - Array of { uid, ... } objects
 * @param {Object} notifData - { senderName, type, title, message, scope }
 */
export async function createUserNotifications(recipients, notifData) {
    if (!recipients || recipients.length === 0) return;

    const expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const promises = recipients.map(recipient =>
        addDoc(collection(db, 'user_notifications'), {
            recipientId: recipient.uid,
            senderName: notifData.senderName || 'Someone',
            type: notifData.type || 'note',
            title: notifData.title || '',
            message: notifData.message || 'shared something with you',
            scope: notifData.scope || 'class',
            read: false,
            createdAt: serverTimestamp(),
            expireAt,
        })
    );

    await Promise.all(promises);
}

/**
 * Real-time listener for the current user's incoming notifications.
 */
export function subscribeToMyNotifications(userId, callback) {
    const q = query(
        collection(db, 'user_notifications'),
        where('recipientId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort client-side by createdAt descending (avoids composite index requirement)
        items.sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
            const tb = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
            return tb - ta;
        });
        callback(items);
    }, (err) => {
        console.error("[Firestore] Error listening to user_notifications:", err);
        // On error, return empty array so loading state stops
        callback([]);
    });
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(notifId) {
    await updateDoc(doc(db, 'user_notifications', notifId), { read: true });
}

/**
 * Mark all unread notifications as read for a user.
 */
export async function markAllNotificationsRead(userId) {
    const q = query(
        collection(db, 'user_notifications'),
        where('recipientId', '==', userId),
        where('read', '==', false)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map(d =>
        updateDoc(doc(db, 'user_notifications', d.id), { read: true })
    );
    await Promise.all(promises);
}

/**
 * Delete a single notification.
 */
export async function deleteNotification(notifId) {
    await deleteDoc(doc(db, 'user_notifications', notifId));
}

/**
 * Delete all notifications for a user.
 */
export async function deleteAllNotifications(userId) {
    const q = query(
        collection(db, 'user_notifications'),
        where('recipientId', '==', userId)
    );
    const snap = await getDocs(q);
    const promises = snap.docs.map(d => deleteDoc(doc(db, 'user_notifications', d.id)));
    await Promise.all(promises);
}

/**
 * Delete all Firestore data created by or belonging to the user (notes, assignments, announcements, notifications).
 * Does NOT delete the user profile or Auth account — only their content data.
 */
export async function deleteAllUserData(uid) {
    const deleteDocsInCollection = async (collectionName, field, value) => {
        const q = query(collection(db, collectionName), where(field, '==', value));
        const snap = await getDocs(q);
        return Promise.all(snap.docs.map(d => deleteDoc(doc(db, collectionName, d.id))));
    };

    await deleteDocsInCollection('notes', 'userId', uid);
    await deleteDocsInCollection('assignments', 'userId', uid);
    await deleteDocsInCollection('announcements', 'userId', uid);
    await deleteAllNotifications(uid);
}

