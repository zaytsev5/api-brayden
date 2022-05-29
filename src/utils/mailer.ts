const nodeMailer = require('nodemailer');

const sendMail = ({ to, subject, html, from, bcc }: any) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: `Payment App ${from || process.env.MAIL_FROM}`,
    to,
    subject,
    html,
    bcc,
  };
  return transporter.sendMail(options);
};

export default sendMail;
