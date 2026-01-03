// Data dummy untuk dashboard
const dashboardData = {
    website: {
        status: "active",
        visitors: 1245,
        conversion: 3.17,
        uptime: "99.8%"
    },
    googleAds: {
        status: "active",
        clicks: 890,
        impressions: 24500,
        cost: 1250000,
        conversions: 45
    },
    metaAds: {
        status: "inactive",
        reach: 0,
        engagement: 0,
        cost: 0,
        conversions: 0
    },
    overall: {
        performance: "BBR1 - 3.17%",
        revenue: 28500000,
        roi: 228
    }
};

// Format waktu Indonesia
function updateWaktuIndonesia() {
    const now = new Date();
    const options = { 
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    };
    const timeStr = now.toLocaleTimeString('id-ID', options);
    const liveTimeElement = document.getElementById('liveTime');
    if (liveTimeElement) {
        liveTimeElement.textContent = timeStr;
    }
}

// Inisialisasi Dashboard
function initDashboard() {
    console.log("Dashboard initialized");
    updateDashboardUI();
    loadServiceData();
    setupEventListeners();
    initNotifications();
}

// Update UI Dashboard
function updateDashboardUI() {
    // Update status toggle
    const googleToggle = document.getElementById('toggleGoogle');
    const metaToggle = document.getElementById('toggleMeta');
    
    if (googleToggle) {
        googleToggle.classList.toggle('active', dashboardData.googleAds.status === "active");
    }
    if (metaToggle) {
        metaToggle.classList.toggle('active', dashboardData.metaAds.status === "active");
    }
    
    // Update statistik
    updateStatsDisplay();
}

// Load data dari API
async function loadServiceData() {
    console.log("Loading service data...");
    try {
        // Untuk demo, gunakan data dummy
        // Jika punya backend, ganti dengan: const response = await fetch('http://localhost:3000/api/dashboard');
        const response = await simulateAPICall();
        updateDataFromResponse(response);
    } catch (error) {
        console.error("Gagal memuat data:", error);
        showNotification("Gagal memuat data terbaru", "error");
    }
}

// Simulasi API call
function simulateAPICall() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newData = {
                googleAds: {
                    clicks: Math.floor(Math.random() * 100) + 850,
                    impressions: Math.floor(Math.random() * 5000) + 24000,
                    cost: 1250000 + Math.floor(Math.random() * 500000)
                },
                metaAds: {
                    status: dashboardData.metaAds.status,
                    reach: dashboardData.metaAds.status === "active" ? Math.floor(Math.random() * 5000) : 0,
                    engagement: dashboardData.metaAds.status === "active" ? Math.floor(Math.random() * 200) : 0
                },
                timestamp: new Date().toISOString()
            };
            resolve(newData);
        }, 1000);
    });
}

// Update data dari response
function updateDataFromResponse(response) {
    dashboardData.googleAds.clicks = response.googleAds.clicks;
    dashboardData.googleAds.impressions = response.googleAds.impressions;
    dashboardData.googleAds.cost = response.googleAds.cost;
    
    dashboardData.metaAds.reach = response.metaAds.reach;
    dashboardData.metaAds.engagement = response.metaAds.engagement;
    
    updateStatsDisplay();
    
    // Update timestamp
    const tanggalElement = document.querySelector('.preview-container p');
    if (tanggalElement) {
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        tanggalElement.innerHTML = `Dashboard diperbarui: ${now.toLocaleDateString('id-ID', options)}`;
    }
    
    showNotification("Data diperbarui", "success");
}

// Update tampilan statistik
function updateStatsDisplay() {
    // Update performance value
    const performanceElement = document.querySelector('.preview-stat .preview-value');
    if (performanceElement && performanceElement.textContent.includes('BBR1')) {
        performanceElement.textContent = dashboardData.overall.performance;
    }
    
    // Update additional stats
    updateAdditionalStats();
}

// Setup event listeners
function setupEventListeners() {
    // Toggle Google Ads
    const googleToggle = document.getElementById('toggleGoogle');
    if (googleToggle) {
        googleToggle.addEventListener('click', function() {
            toggleService('googleAds', this);
        });
    }
    
    // Toggle Meta Ads
    const metaToggle = document.getElementById('toggleMeta');
    if (metaToggle) {
        metaToggle.addEventListener('click', function() {
            toggleService('metaAds', this);
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDashboard(this.value);
            }
        });
    }
    
    // Auto-refresh setiap 30 detik
    setInterval(loadServiceData, 30000);
}

// Toggle service
function toggleService(serviceName, toggleElement) {
    const isActive = dashboardData[serviceName].status === "active";
    
    if (isActive) {
        if (!confirm(`Apakah Anda yakin ingin menonaktifkan ${serviceName === 'googleAds' ? 'Google Ads' : 'Meta Ads'}?`)) {
            return;
        }
    }
    
    dashboardData[serviceName].status = isActive ? "inactive" : "active";
    toggleElement.classList.toggle('active');
    
    // Untuk demo, langsung update UI
    loadServiceData();
    
    const serviceNameID = serviceName === 'googleAds' ? 'Google Ads' : 'Meta Ads';
    const status = isActive ? 'dinonaktifkan' : 'diaktifkan';
    showNotification(`${serviceNameID} berhasil ${status}`, "success");
}

// Fungsi pencarian
function searchDashboard(query) {
    if (!query.trim()) return;
    
    const results = simulateSearch(query);
    displaySearchResults(results);
}

function simulateSearch(query) {
    const searchableData = [
        { type: 'service', name: 'Google Ads', data: dashboardData.googleAds },
        { type: 'service', name: 'Meta Ads', data: dashboardData.metaAds },
        { type: 'service', name: 'Website', data: dashboardData.website }
    ];
    
    return searchableData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

function displaySearchResults(results) {
    if (results.length > 0) {
        showNotification(`Ditemukan ${results.length} hasil untuk pencarian`, "info");
        console.log("Hasil pencarian:", results);
    } else {
        showNotification("Tidak ditemukan hasil", "warning");
    }
}

// System notifikasi
function initNotifications() {
    // Cek apakah container sudah ada
    if (!document.getElementById('notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(notificationContainer);
    }
}

function showNotification(message, type = "info") {
    // Pastikan container ada
    initNotifications();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
        ">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
            ">×</button>
        </div>
    `;
    
    document.getElementById('notification-container').appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Update statistik tambahan
function updateAdditionalStats() {
    let additionalStats = document.querySelector('.additional-stats');
    if (!additionalStats) {
        additionalStats = document.createElement('div');
        additionalStats.className = 'additional-stats';
        additionalStats.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
        `;
        
        additionalStats.innerHTML = `
            <div class="stat-card">
                <div class="stat-title">Total Klik</div>
                <div class="stat-value" id="totalClicks">${dashboardData.googleAds.clicks}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Impresi</div>
                <div class="stat-value" id="totalImpressions">${dashboardData.googleAds.impressions.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Biaya</div>
                <div class="stat-value" id="totalCost">Rp ${dashboardData.googleAds.cost.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">ROI</div>
                <div class="stat-value" id="roiValue">${dashboardData.overall.roi}%</div>
            </div>
        `;
        
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            previewContainer.appendChild(additionalStats);
        }
    } else {
        // Update nilai
        document.getElementById('totalClicks').textContent = dashboardData.googleAds.clicks;
        document.getElementById('totalImpressions').textContent = dashboardData.googleAds.impressions.toLocaleString();
        document.getElementById('totalCost').textContent = `Rp ${dashboardData.googleAds.cost.toLocaleString()}`;
        document.getElementById('roiValue').textContent = `${dashboardData.overall.roi}%`;
    }
}

// Animasi untuk kartu layanan
function initServiceCardAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing...");
    
    // Update waktu setiap detik
    setInterval(updateWaktuIndonesia, 1000);
    updateWaktuIndonesia();
    
    // Format tanggal awal
    const tanggalElement = document.querySelector('.preview-container p');
    if (tanggalElement) {
        const now = new Date();
        const options = { 
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        tanggalElement.innerHTML = `Dashboard diperbarui: ${now.toLocaleDateString('id-ID', options)}`;
    }
    
    // Inisialisasi dashboard
    initDashboard();
    
    // Inisialisasi animasi kartu
    initServiceCardAnimations();
    
    // Tambahkan event listener untuk toggle yang sudah ada di HTML
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        // Hapus event listener lama jika ada
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
    });
});