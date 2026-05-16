// Company Dashboard JavaScript

// Check authentication
if (!auth.requireAuth() || !auth.hasRole('company')) {
    window.location.href = '/';
}

const token = auth.getToken();
const user = auth.getUser();

// View switching
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const views = document.querySelectorAll('.view-content');

sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = link.dataset.view;

        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        views.forEach(v => v.classList.add('hidden'));
        document.getElementById(`${viewName}View`).classList.remove('hidden');

        if (viewName === 'internships') {
            loadInternships();
        } else if (viewName === 'applications') {
            loadApplications();
        } else if (viewName === 'profile') {
            loadProfile();
        }
    });
});

// Load company internships
async function loadInternships() {
    const container = document.getElementById('internshipsList');

    try {
        const response = await api.getMyInternships(token);
        const data = await utils.handleResponse(response);

        if (data.internships && data.internships.length > 0) {
            container.innerHTML = data.internships.map(internship => `
        <div class="card mb-2">
          <div class="internship-header">
            <div>
              <h3>${internship.title}</h3>
              <div class="meta-item">
                <span class="badge badge-${utils.getStatusBadge(internship.status)}">
                  ${utils.capitalize(internship.status)}
                </span>
              </div>
            </div>
          </div>

          <div class="internship-meta">
            <div class="meta-item">📍 ${internship.location}</div>
            <div class="meta-item">💰 ${utils.formatCurrency(internship.stipend)}</div>
            <div class="meta-item">📅 ${utils.formatDate(internship.postedDate)}</div>
            <div class="meta-item">👥 ${internship.openings} openings</div>
          </div>

          <div>
            <strong>Required Skills:</strong>
            <div class="skills-list">
              ${internship.requiredSkills.map(skill => utils.createSkillBadge(skill)).join('')}
            </div>
          </div>

          <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <button class="btn btn-primary" onclick="viewMatchedStudents('${internship._id}')">
              View Matched Students
            </button>
            <button class="btn btn-outline" onclick="viewApplications('${internship._id}')">
              View Applications
            </button>
            ${internship.status === 'active' ?
                    `<button class="btn btn-danger" onclick="closeInternship('${internship._id}')">Close</button>` :
                    ''
                }
          </div>
        </div>
      `).join('');
        } else {
            container.innerHTML = `
        <div class="card text-center">
          <h3>No Internships Posted</h3>
          <p>Start by posting your first internship opportunity.</p>
          <button class="btn btn-primary" onclick="document.querySelector('[data-view=post]').click()">
            Post Internship
          </button>
        </div>
      `;
        }
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Error loading internships: ${error.message}</div>`;
    }
}

// View matched students
async function viewMatchedStudents(internshipId) {
    try {
        const response = await api.getMatchedStudents(internshipId, token);
        const data = await utils.handleResponse(response);

        const content = data.matchedStudents && data.matchedStudents.length > 0 ?
            `<div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>College</th>
              <th>Year</th>
              <th>CGPA</th>
              <th>Match %</th>
              <th>Matched Skills</th>
            </tr>
          </thead>
          <tbody>
            ${data.matchedStudents.map(item => `
              <tr>
                <td><strong>${item.student.name}</strong></td>
                <td>${item.student.college}</td>
                <td>${item.student.year}</td>
                <td>${item.student.cgpa}</td>
                <td><span class="badge badge-${utils.getMatchColor(item.matchPercentage)}">${item.matchPercentage}%</span></td>
                <td>${item.matchedSkills.slice(0, 3).join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>` :
            '<p>No matched students found yet.</p>';

        utils.createModal('Matched Students', content);
    } catch (error) {
        utils.showAlert('Error loading matched students: ' + error.message, 'error');
    }
}

// View applications for internship
function viewApplications(internshipId) {
    document.querySelector('[data-view=applications]').click();
    loadApplicationsForInternship(internshipId);
}

// Load all applications
async function loadApplications() {
    const container = document.getElementById('applicationsList');

    try {
        const response = await api.getCompanyApplications(token);
        const data = await utils.handleResponse(response);

        if (data.applications && data.applications.length > 0) {
            container.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Match %</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.applications.map(app => `
                <tr>
                  <td><strong>${app.studentId.name}</strong><br><small>${app.studentId.email}</small></td>
                  <td>${app.internshipId.title}</td>
                  <td><span class="badge badge-${utils.getMatchColor(app.matchPercentage)}">${app.matchPercentage}%</span></td>
                  <td>${utils.formatDate(app.appliedDate)}</td>
                  <td><span class="badge badge-${utils.getStatusBadge(app.status)}">${utils.capitalize(app.status)}</span></td>
                  <td>
                    ${app.status === 'pending' ? `
                      <button class="btn btn-success" style="padding: 0.5rem 0.75rem; font-size: 0.75rem;" onclick="updateStatus('${app._id}', 'accepted')">Accept</button>
                      <button class="btn btn-danger" style="padding: 0.5rem 0.75rem; font-size: 0.75rem;" onclick="updateStatus('${app._id}', 'rejected')">Reject</button>
                    ` : '-'}
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
          <p>Applications will appear here when students apply to your internships.</p>
        </div>
      `;
        }
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">Error loading applications: ${error.message}</div>`;
    }
}

// Update application status
async function updateStatus(appId, status) {
    try {
        const response = await api.updateApplicationStatus(appId, status, token);
        const data = await utils.handleResponse(response);

        if (data.success) {
            utils.showAlert(`Application ${status}`, 'success');
            loadApplications();
        }
    } catch (error) {
        utils.showAlert('Error updating status: ' + error.message, 'error');
    }
}

// Close internship
async function closeInternship(internshipId) {
    if (!confirm('Are you sure you want to close this internship?')) return;

    try {
        const response = await api.updateInternship(internshipId, { status: 'closed' }, token);
        const data = await utils.handleResponse(response);

        if (data.success) {
            utils.showAlert('Internship closed', 'success');
            loadInternships();
        }
    } catch (error) {
        utils.showAlert('Error closing internship: ' + error.message, 'error');
    }
}

// Post internship
document.getElementById('postInternshipForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        internshipType: document.getElementById('internshipType').value,
        duration: document.getElementById('duration').value,
        stipend: parseInt(document.getElementById('stipend').value) || 0,
        openings: parseInt(document.getElementById('openings').value) || 1,
        requiredSkills: utils.parseSkills(document.getElementById('requiredSkills').value),
        optionalSkills: utils.parseSkills(document.getElementById('optionalSkills').value),
        eligibility: {
            minCGPA: parseFloat(document.getElementById('minCGPA').value) || 0,
            degrees: utils.parseSkills(document.getElementById('degrees').value),
            years: document.getElementById('years').value.split(',').map(y => parseInt(y.trim())).filter(y => !isNaN(y))
        }
    };

    const deadline = document.getElementById('deadline').value;
    if (deadline) {
        formData.applicationDeadline = new Date(deadline);
    }

    try {
        const response = await api.createInternship(formData, token);
        const data = await utils.handleResponse(response);

        if (data.success) {
            utils.showAlert('Internship posted successfully!', 'success');
            document.getElementById('postInternshipForm').reset();
            document.querySelector('[data-view=internships]').click();
        }
    } catch (error) {
        utils.showAlert('Error posting internship: ' + error.message, 'error');
    }
});

// Load profile
async function loadProfile() {
    try {
        const response = await api.getCompanyProfile(token);
        const data = await utils.handleResponse(response);

        if (data.company) {
            const profile = data.company;
            document.getElementById('companyNameInput').value = profile.companyName || '';
            document.getElementById('companyName').textContent = profile.companyName || 'Company';
            document.getElementById('industry').value = profile.industry || '';
            document.getElementById('website').value = profile.website || '';
            document.getElementById('companyLocation').value = profile.location || '';
            document.getElementById('size').value = profile.size || '';
            document.getElementById('contactPerson').value = profile.contactPerson || '';
            document.getElementById('contactEmail').value = profile.contactEmail || '';
            document.getElementById('contactPhone').value = profile.contactPhone || '';
            document.getElementById('companyDescription').value = profile.description || '';
        }
    } catch (error) {
        console.log('Profile not found, creating new');
    }
}

// Save profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const profileData = {
        companyName: document.getElementById('companyNameInput').value,
        industry: document.getElementById('industry').value,
        website: document.getElementById('website').value,
        location: document.getElementById('companyLocation').value,
        size: document.getElementById('size').value,
        contactPerson: document.getElementById('contactPerson').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        description: document.getElementById('companyDescription').value
    };

    try {
        const response = await api.updateCompanyProfile(profileData, token);
        const data = await utils.handleResponse(response);

        if (data.success) {
            utils.showAlert('Profile updated successfully!', 'success');
            document.getElementById('companyName').textContent = profileData.companyName;
        }
    } catch (error) {
        utils.showAlert('Error updating profile: ' + error.message, 'error');
    }
});

// Initial load
loadInternships();
loadProfile();
