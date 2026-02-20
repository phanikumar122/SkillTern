// API Base URL
const API_URL = '/api';

// API Helper Functions
const api = {
    // Auth endpoints
    register: (data) => fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    login: (data) => fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    getMe: (token) => fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    logout: (token) => fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    // Student endpoints
    getStudentProfile: (token) => fetch(`${API_URL}/student/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    updateStudentProfile: (data, token) => fetch(`${API_URL}/student/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    updateSkills: (skills, token) => fetch(`${API_URL}/student/skills`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills })
    }),

    updatePreferences: (data, token) => fetch(`${API_URL}/student/preferences`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    // Company endpoints
    getCompanyProfile: (token) => fetch(`${API_URL}/company/profile/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    updateCompanyProfile: (data, token) => fetch(`${API_URL}/company/profile/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    // Internship endpoints
    getAllInternships: () => fetch(`${API_URL}/internship`),

    getInternshipById: (id) => fetch(`${API_URL}/internship/${id}`),

    createInternship: (data, token) => fetch(`${API_URL}/internship`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    updateInternship: (id, data, token) => fetch(`${API_URL}/internship/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    deleteInternship: (id, token) => fetch(`${API_URL}/internship/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getMyInternships: (token) => fetch(`${API_URL}/internship/my/internships`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    // Matching endpoints
    getMatchedInternships: (token) => fetch(`${API_URL}/matching/internships`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getMatchedStudents: (internshipId, token) => fetch(`${API_URL}/matching/students/${internshipId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    checkMatch: (internshipId, token) => fetch(`${API_URL}/matching/check/${internshipId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    // Application endpoints
    applyToInternship: (data, token) => fetch(`${API_URL}/application/apply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    }),

    getMyApplications: (token) => fetch(`${API_URL}/application/my-applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getInternshipApplications: (internshipId, token) => fetch(`${API_URL}/application/internship/${internshipId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getCompanyApplications: (token) => fetch(`${API_URL}/application/company-applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    updateApplicationStatus: (id, status, token) => fetch(`${API_URL}/application/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    }),

    withdrawApplication: (id, token) => fetch(`${API_URL}/application/${id}/withdraw`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    // Admin endpoints
    getAdminStats: (token) => fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getAllUsers: (token) => fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    getAllInternshipsAdmin: (token) => fetch(`${API_URL}/admin/internships`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }),

    deleteUser: (id, token) => fetch(`${API_URL}/admin/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
};

// Export for use in other files
window.api = api;
