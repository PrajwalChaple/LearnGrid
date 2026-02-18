export const formatErrorMessage = (code) => {
    switch (code) {
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/user-not-found':
            return 'User not found. Please register.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in.';
        case 'auth/invalid-email':
            return 'Invalid email format. Please check your email.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'Email/Password authentication is not enabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/invalid-api-key':
            return 'Invalid Firebase API Key. Please check your configuration.';
        case 'auth/app-deleted':
            return 'Firebase project not found.';
        case 'auth/invalid-user-token':
            return 'User session is invalid. Please log in again.';
        case 'auth/user-token-expired':
            return 'User session has expired. Please log in again.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email address but different sign-in credentials.';
        default:
            console.error('Firebase Auth Error:', code);
            return `An error occurred (${code || 'unknown'}). Please try again later.`;
    }
};

export const showSuccessMessage = (name) => {
    // This could be integrated with toast notifications later
    console.log(`Welcome back, ${name}!`);
};
