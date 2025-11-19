var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const SendEmailUtility = async (
  EmailTo,
  subject = "Password Reset",
  EmailText,
  attachmentBuffer = null,
  attachmentFilename = "attachment.pdf"
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
        rejectUnauthorized: false,
      },
      debug: true, // Enable debugging
    })
  );

  var mailOptions = {
    from: "laramintkw.com <info@laramintkw.com>",
    to: [EmailTo],
    subject: subject,
    text: EmailText,
    attachments: attachmentBuffer
      ? [
          {
            filename: attachmentFilename,
            content: attachmentBuffer,
            contentType: "application/pdf",
          },
        ]
      : [],
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtility;
