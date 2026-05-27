// Student Dashboard JavaScript

// Check authentication
if (!auth.requireAuth() || !auth.hasRole('student')) {
  window.location.href = 'login.html';
}

const token = auth.getToken();
const user = auth.getUser();

// Display user name
if (user && document.getElementById('userName')) {
  document.getElementById('userName').textContent = user.email || 'Student';
}

// View switching
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const views = document.querySelectorAll('.view-content');

sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const viewName = link.dataset.view;

    // Update active link
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Switch view
    views.forEach(v => v.classList.add('hidden'));
    document.getElementById(`${viewName}View`).classList.remove('hidden');

    // Load data for specific view
    if (viewName === 'matched') {
      loadMatchedInternships();
    } else if (viewName === 'applications') {
      loadApplications();
    } else if (viewName === 'profile') {
      loadProfile();
    }
  });
});

// Load matched internships
async function loadMatchedInternships() {
  const container = document.getElementById('matchedInternships');

  try {
    const response = await api.getMatchedInternships(token);
    const data = await utils.handleResponse(response);

    if (data.matchedInternships && data.matchedInternships.length > 0) {
      container.innerHTML = data.matchedInternships.map(item => `
        <div class="card internship-card fade-in">
          <div class="internship-header">
            <div>
              <h3 class="internship-title">${item.internship.title}</h3>
              <div class="company-name">
                🏢 ${item.internship.companyId.companyName}
              </div>
            </div>
            <div class="match-score">
              <div class="match-percentage">${item.matchPercentage}%</div>
              <div class="match-label">Match</div>
            </div>
          </div>

          <div class="internship-meta">
            <div class="meta-item">📍 ${item.internship.location || 'Not specified'}</div>
            <div class="meta-item">💰 ${utils.formatCurrency(item.internship.stipend)}</div>
            <div class="meta-item">⏱️ ${item.internship.duration || 'Flexible'}</div>
            <div class="meta-item">
              <span class="badge badge-${utils.getStatusBadge(item.internship.internshipType)}">
                ${utils.capitalize(item.internship.internshipType)}
              </span>
            </div>
          </div>

          <div>
            <strong>Matched Skills:</strong>
            <div class="skills-list">
              ${item.matchedSkills.map(skill => utils.createSkillBadge(skill, true)).join('')}
            </div>
          </div>

          ${item.missingSkills.length > 0 ? `
            <div>
              <strong>Skills to Learn:</strong>
              <div class="skills-list">
                ${item.missingSkills.map(skill => utils.createSkillBadge(skill, false)).join('')}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 1rem;">
            <p>${item.internship.description.substring(0, 200)}${item.internship.description.length > 200 ? '...' : ''}</p>
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="applyToInternship('${item.internship._id}')">
              Apply Now
            </button>
            <button class="btn btn-outline" onclick="viewInternshipDetails('${item.internship._id}')">
              View Details
            </button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="card text-center">
          <h3>No Matched Internships</h3>
          <p>Update your profile and skills to get better matches.</p>
          <button class="btn btn-primary" onclick="document.querySelector('[data-view=profile]').click()">
            Update Profile
          </button>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">
        Error loading internships: ${error.message}
      </div>
    `;
  }
}

// Apply to internship
async function applyToInternship(internshipId) {
  if (!confirm('Are you sure you want to apply to this internship?')) return;

  try {
    const response = await api.applyToInternship({ internshipId }, token);
    const data = await utils.handleResponse(response);

    if (data.success) {
      utils.showAlert('Application submitted successfully!', 'success');
      loadMatchedInternships();
    }
  } catch (error) {
    utils.showAlert(error.message || 'Failed to apply', 'error');
  }
}

// View internship details
function viewInternshipDetails(internshipId) {
  window.open(`/internship-details.html?id=${internshipId}`, '_blank');
}

// Load applications
async function loadApplications() {
  const container = document.getElementById('applicationsList');

  try {
    const response = await api.getMyApplications(token);
    const data = await utils.handleResponse(response);

    if (data.applications && data.applications.length > 0) {
      container.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Internship</th>
                <th>Company</th>
                <th>Match %</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${data.applications.map(app => `
                <tr>
                  <td><strong>${app.internshipId.title}</strong></td>
                  <td>${app.companyId.companyName}</td>
                  <td><span class="badge badge-${utils.getMatchColor(app.matchPercentage)}">${app.matchPercentage}%</span></td>
                  <td>${utils.formatDate(app.appliedDate)}</td>
                  <td><span class="badge badge-${utils.getStatusBadge(app.status)}">${utils.capitalize(app.status)}</span></td>
                  <td>
                    ${app.status === 'pending' ?
          `<button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="withdrawApplication('${app._id}')">Withdraw</button>` :
          '-'
        }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card text-center">
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any internships yet.</p>
          <button class="btn btn-primary" onclick="document.querySelector('[data-view=matched]').click()">
            Browse Internships
          </button>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-error">
        Error loading applications: ${error.message}
      </div>
    `;
  }
}

// Withdraw application
async function withdrawApplication(applicationId) {
  if (!confirm('Are you sure you want to withdraw this application?')) return;

  try {
    const response = await api.withdrawApplication(applicationId, token);
    const data = await utils.handleResponse(response);

    if (data.success) {
      utils.showAlert('Application withdrawn', 'success');
      loadApplications();
    }
  } catch (error) {
    utils.showAlert(error.message || 'Failed to withdraw', 'error');
  }
}

// Load profile
async function loadProfile() {
  try {
    const response = await api.getStudentProfile(token);
    const data = await utils.handleResponse(response);

    if (data.student) {
      const profile = data.student;
      document.getElementById('name').value = profile.name || '';
      document.getElementById('email').value = profile.email || '';
      document.getElementById('phone').value = profile.phone || '';
      document.getElementById('college').value = profile.college || '';
      document.getElementById('degree').value = profile.degree || '';
      document.getElementById('year').value = profile.year || '';
      document.getElementById('cgpa').value = profile.cgpa || '';
      document.getElementById('skills').value = profile.skills ? profile.skills.join(', ') : '';
      document.getElementById('locations').value = profile.preferences?.locations ? profile.preferences.locations.join(', ') : '';
      document.getElementById('internshipType').value = profile.preferences?.internshipType || '';
    }
  } catch (error) {
    utils.showAlert('Error loading profile: ' + error.message, 'error');
  }
}

// Save profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const profileData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    college: document.getElementById('college').value,
    degree: document.getElementById('degree').value,
    year: parseInt(document.getElementById('year').value) || 0,
    cgpa: parseFloat(document.getElementById('cgpa').value) || 0,
    skills: utils.parseSkills(document.getElementById('skills').value),
    preferences: {
      locations: utils.parseSkills(document.getElementById('locations').value),
      internshipType: document.getElementById('internshipType').value
    }
  };

  try {
    const response = await api.updateStudentProfile(profileData, token);
    const data = await utils.handleResponse(response);

    if (data.success) {
      utils.showAlert('Profile updated successfully!', 'success');
    }
  } catch (error) {
    utils.showAlert(error.message || 'Failed to update profile', 'error');
  }
});

// Initial load
loadMatchedInternships();
