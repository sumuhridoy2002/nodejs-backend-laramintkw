const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const SendEmailUtilityForEmailSubcription = async (email) => {
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
    to: ["info@laramintkw.com"],
    subject: "Subcriped Email",
    html: `<h4>User Subcirption this email</h4> </br> <h2>Email: ${email}</h2>`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtilityForEmailSubcription;
