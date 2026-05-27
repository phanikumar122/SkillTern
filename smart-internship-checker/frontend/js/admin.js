// Admin Dashboard JavaScript
if (!auth.requireAuth() || !auth.hasRole('admin')) {
  window.location.href = 'login.html';
}

const token = auth.getToken();

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

    if (viewName === 'stats') loadStats();
    else if (viewName === 'users') loadUsers();
    else if (viewName === 'internships') loadInternships();
  });
});

async function loadStats() {
  const container = document.getElementById('statsContainer');

  try {
    const response = await api.getAdminStats(token);
    const data = await utils.handleResponse(response);

    const stats = data.stats;
    container.innerHTML = `
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-label">Total Users</div>
          <div class="stat-value">${stats.users.total}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-label">Students</div>
          <div class="stat-value">${stats.users.students}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-label">Companies</div>
          <div class="stat-value">${stats.users.companies}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-label">Active Internships</div>
          <div class="stat-value">${stats.internships.active}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-label">Total Applications</div>
          <div class="stat-value">${stats.applications.total}</div>
        </div>
        <div class="card stat-card">
          <div class="stat-label">Accepted</div>
          <div class="stat-value">${stats.applications.accepted}</div>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Error loading stats: ${error.message}</div>`;
  }
}

async function loadUsers() {
  const container = document.getElementById('usersContainer');

  try {
    const response = await api.getAllUsers(token);
    const data = await utils.handleResponse(response);

    if (data.users && data.users.length > 0) {
      container.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.users.map(user => `
                <tr>
                  <td>${user.email}</td>
                  <td><span class="badge badge-primary">${utils.capitalize(user.role)}</span></td>
                  <td>${utils.formatDate(user.createdAt)}</td>
                  <td>
                    ${user.role !== 'admin' ?
          `<button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.875rem;" onclick="deleteUser('${user._id}')">Delete</button>` :
          '-'
        }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Error loading users: ${error.message}</div>`;
  }
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await api.deleteUser(userId, token);
    const data = await utils.handleResponse(response);

    if (data.success) {
      utils.showAlert('User deleted', 'success');
      loadUsers();
    }
  } catch (error) {
    utils.showAlert('Error deleting user: ' + error.message, 'error');
  }
}

async function loadInternships() {
  const container = document.getElementById('internshipsContainer');

  try {
    const response = await api.getAllInternshipsAdmin(token);
    const data = await utils.handleResponse(response);

    if (data.internships && data.internships.length > 0) {
      container.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Posted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.internships.map(internship => `
                <tr>
                  <td><strong>${internship.title}</strong></td>
                  <td>${internship.companyId.companyName}</td>
                  <td>${internship.location}</td>
                  <td>${utils.formatDate(internship.postedDate)}</td>
                  <td><span class="badge badge-${utils.getStatusBadge(internship.status)}">${utils.capitalize(internship.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">Error loading internships: ${error.message}</div>`;
  }
}

loadStats();
