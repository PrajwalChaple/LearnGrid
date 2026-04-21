import { db } from '../firebase';
import { doc, setDoc, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';

// ─── Razorpay Payment Integration ───────────────────────────────

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

/**
 * Open Razorpay Checkout popup and handle payment.
 * @param {Object} params
 * @param {number} params.amount — Amount in INR (e.g. 1 for ₹1)
 * @param {string} params.planName — Plan name (e.g. "Pro Scholar")
 * @param {Object} params.user — Firebase user object
 * @param {Object} params.userProfile — Firestore user profile
 * @param {Function} params.onSuccess — Callback on payment success
 * @param {Function} params.onError — Callback on payment failure
 */
export function initiateRazorpayPayment({ amount, planName, user, userProfile, onSuccess, onError }) {
    if (!window.Razorpay) {
        onError?.('Razorpay SDK not loaded. Please refresh the page.');
        return;
    }

    if (!RAZORPAY_KEY || RAZORPAY_KEY === 'rzp_test_REPLACE_ME') {
        onError?.('Razorpay key not configured. Please add your key to .env file.');
        return;
    }

    const options = {
        key: RAZORPAY_KEY,
        amount: amount * 100, // Razorpay takes paise (₹1 = 100 paise)
        currency: 'INR',
        name: 'LearnGrid',
        description: `${planName} Subscription`,
        image: '/bookmark-25.svg',
        prefill: {
            name: userProfile?.name || user?.displayName || '',
            email: user?.email || '',
        },
        theme: {
            color: '#4f46e5', // Indigo to match LearnGrid's branding
        },
        handler: async function (response) {
            // Payment was successful — response contains razorpay_payment_id
            try {
                const paymentData = {
                    razorpayPaymentId: response.razorpay_payment_id,
                    userId: user.uid,
                    userEmail: user.email,
                    userName: userProfile?.name || user?.displayName || '',
                    planName: planName,
                    amount: amount,
                    currency: 'INR',
                    status: 'success',
                    createdAt: serverTimestamp(),
                };

                // Save payment record in Firestore
                await savePaymentRecord(user.uid, paymentData);

                // Update user profile with Pro plan
                await updateUserPlan(user.uid, 'pro');

                onSuccess?.(response.razorpay_payment_id);
            } catch (err) {
                console.error('Error saving payment:', err);
                // Payment was made but saving failed — still call success since money was collected
                onSuccess?.(response.razorpay_payment_id);
            }
        },
        modal: {
            ondismiss: function () {
                // User closed the popup without paying
                console.log('Payment popup closed by user');
            },
        },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        onError?.(response.error?.description || 'Payment failed. Please try again.');
    });

    rzp.open();
}

// ─── Firestore helpers ──────────────────────────────────────────

/**
 * Save a payment record in the `payments` collection.
 */
async function savePaymentRecord(uid, paymentData) {
    await addDoc(collection(db, 'payments'), paymentData);
}

/**
 * Update user's plan in their profile document.
 */
async function updateUserPlan(uid, plan) {
    await updateDoc(doc(db, 'users', uid), {
        plan: plan,
        planUpdatedAt: serverTimestamp(),
    });
}

/**
 * Get all payments for a specific user.
 */
export async function getUserPayments(uid) {
    const q = query(
        collection(db, 'payments'),
        where('userId', '==', uid),
        where('status', '==', 'success')
    );
    const snap = await getDocs(q);
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() || 0;
        const tb = b.createdAt?.toMillis?.() || 0;
        return tb - ta;
    });
    return items;
}
