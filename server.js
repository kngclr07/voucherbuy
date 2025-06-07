const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const submissions = {}; // Store { id: { ref, phone, voucher } }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post('/submit', async (req, res) => {
  const id = Date.now().toString();
  const { ref, phone } = req.body;
  submissions[id] = { ref, phone, voucher: null };

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `Voucher Request ${id}`,
    text: `GCash Ref: ${ref}\nPhone: ${phone}\nReply with code only.`,
  });

  res.json({ id });
});

app.get('/check', (req, res) => {
  const sub = submissions[req.query.id];
  res.json({ voucher: sub?.voucher || null });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { submissions };
