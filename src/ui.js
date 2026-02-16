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
        default:
            return 'An unknown error occurred. Please try again later.';
    }
};

export const showSuccessMessage = (name) => {
    // This could be integrated with toast notifications later
    console.log(`Welcome back, ${name}!`);
};
