const nodeMailer = require('nodemailer');

const sendMail = ({ to, subject, html, from, bcc }: any) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
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
