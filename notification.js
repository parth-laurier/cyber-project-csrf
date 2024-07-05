const nodemailer =require('nodemailer');

const smtp = {
  host: 'smtp-relay.sendinblue.com',
  port: '587',
  secure: false,
  auth: {
    user: 'parth.shah@adrixus.com',
    pass: 'KPvJIwDMOQ7dAat4',
  },
}

const sendEmailNotification = (emailOptions) => {
  const emailOptionsData = {
    ...emailOptions,
    from: 'Cyber Attack <noreply@cyberattack.io>',
  };
  console.log(`Sending notification email with options ${JSON.stringify(emailOptionsData.from)}`);
  const transporter = nodemailer.createTransport(smtp);
  transporter
    .sendMail(emailOptionsData)
    .then((info) => {
      console.log(`Email sent to ${info.envelope.to}`);
    })
    .catch((error) => {
      console.log(`Error occurred while sending email ${error}`);
    });
};

module.exports = sendEmailNotification;
