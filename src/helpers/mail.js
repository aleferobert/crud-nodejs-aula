const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.HOSTMAIL,
    port: 465,
    secure: true,
    logger: true,
    debug: false,
    auth: {
        user: process.env.USERMAIL,
        pass: process.env.PASSMAIL
    }
});

transporter.sendEMail = function (mailRequest) {
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailRequest, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve("The message was sent!");
        }
      });
    });
  }


module.exports = transporter;
