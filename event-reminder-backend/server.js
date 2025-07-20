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


app.get('/', (req, res) => {
  res.send('✅ Email Reminder Backend is Running');
});


app.post('/send-reminder', (req, res) => {
  const { title, datetime, senderEmail, recipientEmail, customMessage } = req.body;

  if (!title || !datetime || !senderEmail || !recipientEmail || !customMessage) {
    return res.status(400).json({ message: 'Missing required fields' });
  }


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,        
      pass: process.env.PASSWORD     
    }
  });

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    subject: `Message from ${senderEmail} - Event: ${title}`,
    text: `Hi there!👋🏼,\n\nYou've received a message regarding "${title}" happening at ${datetime}.\n\nMessage:\n${customMessage}\n\nFrom: ${senderEmail}\n\n- Event Reminder App`
  };

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


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


