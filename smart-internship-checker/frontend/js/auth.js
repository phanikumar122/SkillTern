// Authentication State Management
const auth = {
    // Get token from localStorage
    getToken: () => localStorage.getItem('token'),

    // Get user data from localStorage
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Save auth data
    saveAuth: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Clear auth data
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!auth.getToken();
    },

    // Check user role
    hasRole: (role) => {
        const user = auth.getUser();
        return user && user.role === role;
    },

    // Redirect to login if not authenticated
    requireAuth: () => {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Redirect based on role
    redirectByRole: () => {
        const user = auth.getUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        switch (user.role) {
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'company':
                window.location.href = 'company-dashboard.html';
                break;
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    },

    // Logout
    logout: async () => {
        const token = auth.getToken();
        if (token) {
            try {
                await api.logout(token);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        auth.clearAuth();
        window.location.href = 'index.html';
    }
};

// Export for use in other files
window.auth = auth;
