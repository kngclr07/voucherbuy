const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
  const { refno, phone } = req.body;

  // Setup nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Compose email
  let info = await transporter.sendMail({
    from: `"Voucher Bot" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: 'New Voucher Request',
    text: `New voucher request:\nRef No: ${refno}\nPhone: ${phone}`,
  });

  console.log('Email sent:', info.messageId);
  res.send('<h2>Thank you! We received your request.</h2><p>You will get your voucher after verification.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
