const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing json requests
app.use(express.json());

// Serve static frontend files (html, css, js, fonts, images)
app.use(express.static(__dirname));

// API Endpoint to place and log orders
app.post('/api/orders', (req, res) => {
  const order = req.body;
  const filePath = path.join(__dirname, 'orders.json');
  
  let orders = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      orders = JSON.parse(fileData || '[]');
    }
  } catch (err) {
    console.error('Error reading orders.json', err);
  }

  orders.push(order);

  try {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    res.json({ success: true, message: 'Order placed and saved successfully!' });
  } catch (err) {
    console.error('Error writing to orders.json', err);
    res.status(500).json({ success: false, message: 'Internal Server Error. Failed to save order.' });
  }
});

// API Endpoint to fetch placed orders history
app.get('/api/orders', (req, res) => {
  const filePath = path.join(__dirname, 'orders.json');
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(fileData || '[]'));
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error reading orders.json', err);
    res.status(500).json({ success: false, message: 'Failed to read orders.' });
  }
});

// API Endpoint to book and log table reservations
app.post('/api/reservations', (req, res) => {
  const reservation = req.body;
  const filePath = path.join(__dirname, 'reservations.json');
  
  let reservations = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      reservations = JSON.parse(fileData || '[]');
    }
  } catch (err) {
    console.error('Error reading reservations.json', err);
  }

  reservations.push(reservation);

  try {
    fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2));
    res.json({ success: true, message: 'Reservation booked and saved successfully!' });
  } catch (err) {
    console.error('Error writing to reservations.json', err);
    res.status(500).json({ success: false, message: 'Internal Server Error. Failed to save reservation.' });
  }
});

// Fallback to index.html for undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Kumo Ramen server running on http://localhost:${PORT}`);
});
