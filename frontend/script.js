const API_URL = 'http://localhost:3000/api';

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);  // Store JWT token
        window.location.href = 'dashboard.html';     // Redirect to dashboard
    } else {
        alert(data.error || 'Login failed');
    }
    if (data.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (data.role === 'responder') {
        window.location.href = 'responder-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
      
});

// Handle Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        alert('Registration successful! You can now log in.');
        window.location.href = 'login.html';
    } else {
        alert(data.error || 'Registration failed');
    }
});

// Fetch and Display Disaster Reports
async function fetchDisasterReports() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    const reportsList = document.getElementById('disasterReportsList');

    if (data && data.length > 0) {
        data.forEach(report => {
            const li = document.createElement('li');
            li.textContent = `${report.type} - ${report.severity} - ${report.message}`;
            reportsList.appendChild(li);
        });
    } else {
        reportsList.innerHTML = 'No reports found.';
    }
}

// Fetch and Display Alerts
async function fetchAlerts() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/alerts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    const alertsList = document.getElementById('alertsList');

    if (data && data.length > 0) {
        data.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = `${alert.title} - ${alert.message}`;
            alertsList.appendChild(li);
        });
    } else {
        alertsList.innerHTML = 'No alerts found.';
    }
}

// Call these functions to load data on dashboard
if (document.getElementById('disasterReportsList')) {
    fetchDisasterReports();
    fetchAlerts();
}


if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role); // Assuming your backend returns user role
    if (data.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }
  


  async function fetchAdminReports() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/admin/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    const data = await response.json();
    const list = document.getElementById('adminReportsList');
    data.forEach(report => {
      const li = document.createElement('li');
      li.textContent = `${report.type} - ${report.severity} - ${report.message}`;
      list.appendChild(li);
    });
  }
  
  document.getElementById('alertForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('alertTitle').value;
    const message = document.getElementById('alertMessage').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, message })
    });
  
    if (response.ok) {
      alert('Alert sent!');
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to send alert');
    }
  });
  
  if (document.getElementById('adminReportsList')) {
    fetchAdminReports();
  }
  

  document.getElementById('reportForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const type = document.getElementById('type').value;
    const severity = document.getElementById('severity').value;
    const message = document.getElementById('message').value;
    const token = localStorage.getItem('token');
  
    // Get user's geolocation (optional fallback to 0,0)
    let latitude = 0;
    let longitude = 0;
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
  
        await sendReport(type, severity, message, latitude, longitude, token);
      }, async (error) => {
        alert('Could not get your location. Submitting without it.');
        await sendReport(type, severity, message, latitude, longitude, token);
      });
    } else {
      alert('Geolocation not supported. Submitting without it.');
      await sendReport(type, severity, message, latitude, longitude, token);
    }
  });
  
  async function sendReport(type, severity, message, latitude, longitude, token) {
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, severity, message, latitude, longitude })
    });
  
    if (response.ok) {
      alert('Report submitted successfully!');
      window.location.href = 'dashboard.html';
    } else {
      const data = await response.json();
      alert(data.error || 'Failed to submit report');
    }
  }
  

  async function loadMap() {
    const token = localStorage.getItem('token');
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return; // Don't run if map is not present
  
    const response = await fetch(`${API_URL}/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    const reports = await response.json();
  
    // Initialize map
    const map = L.map('map').setView([0, 0], 2); // Default view
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 10);
      });
    }
  
    reports.forEach(report => {
      if (report.latitude && report.longitude) {
        const popupContent = `
          <strong>${report.type}</strong><br />
          Severity: ${report.severity}<br />
          Message: ${report.message}<br />
          Reported: ${new Date(report.created_at).toLocaleString()}
        `;
        L.marker([report.latitude, report.longitude])
          .addTo(map)
          .bindPopup(popupContent);
      }
    });
  }
  
  loadMap(); // Load map on page load if map element exists
  

  async function fetchAssignedReports() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const assignedList = document.getElementById('assignedReportsList');
    if (!assignedList || role !== 'responder') return;
  
    const response = await fetch(`${API_URL}/responder/assigned`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    const data = await response.json();
  
    if (data && data.length > 0) {
      data.forEach(report => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${report.type}</strong> (${report.severity})<br/>
          ${report.message}<br/>
          <small>${new Date(report.created_at).toLocaleString()}</small><br/>
          <button onclick="markAsResolved(${report.id})" class="btn small">Mark as Resolved</button>
        `;
        assignedList.appendChild(li);
      });
    } else {
      assignedList.innerHTML = '<li>No incidents assigned yet.</li>';
    }
  }
  
  async function markAsResolved(reportId) {
    const token = localStorage.getItem('token');
  
    const response = await fetch(`${API_URL}/responder/resolve/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (response.ok) {
      alert('Marked as resolved');
      location.reload();
    } else {
      alert('Failed to mark as resolved');
    }
  }
  
  // Load assigned reports if on responder dashboard
  if (document.getElementById('assignedReportsList')) {
    fetchAssignedReports();
  }
  

  document.getElementById('reportForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('type', document.getElementById('type').value);
    formData.append('severity', document.getElementById('severity').value);
    formData.append('message', document.getElementById('message').value);
    formData.append('photo', document.getElementById('photo').files[0]);
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        formData.append('latitude', position.coords.latitude);
        formData.append('longitude', position.coords.longitude);
        await sendWithFormData(formData);
      }, async () => {
        await sendWithFormData(formData); // No location fallback
      });
    } else {
      await sendWithFormData(formData);
    }
  });
  
  async function sendWithFormData(formData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
  
    if (response.ok) {
      alert('Report submitted!');
      window.location.href = 'dashboard.html';
    } else {
      const data = await response.json();
      alert(data.error || 'Upload failed');
    }
  }
  