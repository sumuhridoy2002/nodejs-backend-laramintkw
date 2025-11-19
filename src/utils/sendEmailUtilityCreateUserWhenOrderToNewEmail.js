const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const SendEmailUtilityCreateUserWhenOrderToNewEmail = async (
  email,
  password
) => {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      host: "mail.laramintkw.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        // This is needed to prevent TLS issues with self-signed certificates
        rejectUnauthorized: false,
      },
      debug: true, // Enable debugging
    })
  );

  var mailOptions = {
    from: "laramintkw.com <info@laramintkw.com>",
    to: [`${email}`],
    subject: "laramintkw.com Account",
    html: `<h4>Your laramintkw.com Account Information</h4> </br> <h3>Email: ${email}</h3> <h3>Password: ${password}</h3>`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtilityCreateUserWhenOrderToNewEmail;
