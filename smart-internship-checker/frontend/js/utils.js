// Utility Functions

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show loading spinner
function showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loading-spinner';
    element.appendChild(spinner);
}

// Hide loading spinner
function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    if (!amount || amount === 0) return 'Unpaid';
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Capitalize first letter
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get match color based on percentage
function getMatchColor(percentage) {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'info';
    if (percentage >= 40) return 'warning';
    return 'error';
}

// Get status badge class
function getStatusBadge(status) {
    const badges = {
        'active': 'success',
        'pending': 'warning',
        'accepted': 'success',
        'rejected': 'error',
        'withdrawn': 'error',
        'closed': 'error',
        'draft': 'info'
    };
    return badges[status] || 'primary';
}

// Parse skills from comma-separated string
function parseSkills(skillString) {
    if (!skillString) return [];
    return skillString.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
}

// Create skill badge HTML
function createSkillBadge(skill, isMatched = null) {
    let className = 'skill-badge';
    if (isMatched === true) className += ' matched-skill';
    if (isMatched === false) className += ' missing-skill';
    return `<span class="${className}">${skill}</span>`;
}

// Handle API errors
async function handleResponse(response) {
    try {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error('Invalid response format: ' + (text.substring(0, 100) || 'Non-JSON response'));
        }
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON response from server');
        }
        throw error;
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Create modal
function createModal(title, content, options = {}) {
    // Options: onConfirm, confirmText, cancelText, onCancel
    const {
        onConfirm = null,
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onCancel = null
    } = options;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" id="modal-close">✕</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" id="modal-cancel">${cancelText}</button>
        ${onConfirm ? `<button class="btn btn-primary" id="modal-confirm">${confirmText}</button>` : ''}
      </div>
    </div>
  `;

    document.body.appendChild(overlay);

    const closeModal = () => {
        overlay.classList.add('fade-out'); // Add fade-out animation if you have one, or just remove
        setTimeout(() => overlay.remove(), 200); // Wait for animation
    };

    // Close button (X)
    document.getElementById('modal-close').addEventListener('click', () => {
        if (onCancel) onCancel();
        closeModal();
    });

    // Cancel button
    document.getElementById('modal-cancel').addEventListener('click', () => {
        if (onCancel) onCancel();
        closeModal();
    });

    // Confirm button
    if (onConfirm) {
        document.getElementById('modal-confirm').addEventListener('click', () => {
            onConfirm();
            closeModal();
        });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            if (onCancel) onCancel();
            closeModal();
        }
    });
}

// Export utilities
window.utils = {
    showAlert,
    showLoading,
    hideLoading,
    formatDate,
    formatCurrency,
    capitalize,
    getMatchColor,
    getStatusBadge,
    parseSkills,
    createSkillBadge,
    handleResponse,
    debounce,
    isValidEmail,
    createModal
};
