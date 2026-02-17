import { db } from '../firebase';
import {
    doc, getDoc, setDoc, updateDoc,
    collection, addDoc, getDocs, deleteDoc,
    query, where, orderBy, serverTimestamp, onSnapshot
} from 'firebase/firestore';

// ─── User Profile ───────────────────────────────────────────────

export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
}

// ─── Class filter builder ───────────────────────────────────────

function buildClassFilters(profile) {
    const filters = [
        where('institutionName', '==', profile.institutionName),
        where('roleType', '==', profile.roleType),
    ];

    if (profile.roleType === 'college') {
        filters.push(where('department', '==', profile.department));
        filters.push(where('year', '==', profile.year));
    } else {
        filters.push(where('standard', '==', profile.standard));
        filters.push(where('section', '==', profile.section));
    }

    return filters;
}

function buildClassQuery(collectionName, profile) {
    const filters = buildClassFilters(profile);
    return query(collection(db, collectionName), ...filters, orderBy('createdAt', 'desc'));
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
    const q = buildClassQuery(collectionName, profile);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function deleteItem(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
}

// ─── Real-time listeners ────────────────────────────────────────

function subscribeToCollection(collectionName, profile, callback) {
    const q = buildClassQuery(collectionName, profile);
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(items);
    }, (err) => {
        console.error(`Error listening to ${collectionName}:`, err);
    });
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
export function deleteNoteDoc(id) { return deleteItem('notes', id); }

// ─── Assignments ────────────────────────────────────────────────

export function addAssignment(data) { return addItem('assignments', data); }
export function getAssignments(profile) { return getItems('assignments', profile); }
export function deleteAssignmentDoc(id) { return deleteItem('assignments', id); }

// ─── Announcements ─────────────────────────────────────────────

export function addAnnouncement(data) { return addItem('announcements', data); }
export function getAnnouncements(profile) { return getItems('announcements', profile); }
export function deleteAnnouncementDoc(id) { return deleteItem('announcements', id); }

// ─── Update assignment status ───────────────────────────────────

export async function updateAssignment(id, fields) {
    await updateDoc(doc(db, 'assignments', id), fields);
}
