const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// API endpoint untuk demo (contoh)
app.get('/api/demo-request', (req, res) => {
    res.json({
        success: true,
        message: 'Permintaan demo telah direkam',
        timestamp: new Date().toISOString()
    });
});

// All other routes go to landing page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Landing page marketing berjalan di port ${PORT}`);
    console.log(`Akses di: http://localhost:${PORT}`);
});