const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route for testing
app.get('/', (req, res) => {
  res.send('✅ Email Reminder Backend is Running');
});

app.post('/send-reminder', (req, res) => {
  const { title, datetime, senderEmail, recipientEmail, customMessage } = req.body;

  if (!title || !datetime || !senderEmail || !recipientEmail || !customMessage) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Format the datetime to a human-readable string
  const formattedDateTime = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(datetime));

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Set in .env
      pass: process.env.EMAIL_PASS   // Set in .env
    }
  });

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: `Message from ${senderEmail} - Event: ${title}`,
    text: `Hi there! 👋🏼

You've received a reminder for the event "${title}" scheduled at ${formattedDateTime}.

Message:
${customMessage}

From: ${senderEmail}

- Event Reminder App`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email', error });
    } else {
      console.log('✅ Email sent:', info.response);
      return res.status(200).json({ message: 'Reminder email sent successfully' });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
