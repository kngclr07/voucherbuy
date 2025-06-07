const express = require('express');
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const voucherMap = new Map(); // Key: phone number, Value: voucher code

// === Your email checking logic here ===
async function checkEmails() {
  // Connect to Gmail via IMAP and look for matching references
  // Example: if ref# and phone number match, generate a voucher:
  const sampleVoucher = '1234567';
  const samplePhone = '09123456789';

  voucherMap.set(samplePhone, sampleVoucher);
}

// Poll Gmail every 30 seconds
setInterval(checkEmails, 30000);

// === Routes ===
app.post('/submit', (req, res) => {
  const { phone, ref } = req.body;
  // Store for polling
  res.send({ status: 'waiting' });
});

app.get('/check-voucher', (req, res) => {
  const phone = req.query.phone;
  const voucher = voucherMap.get(phone);
  if (voucher) {
    res.send({ voucher });
    voucherMap.delete(phone); // only show once
  } else {
    res.send({ voucher: null });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
