const sgMail = require('@sendgrid/mail');


const send_email = (to, subject, text) => {
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: to,
      from: 'e.murairi@alustudent.com',
      subject: subject,
      text: text,
    };
    sgMail.send(msg);
  }

module.exports = send_email;