const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'harshil.forwebsite.26@gmail.com',
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: `harshil.forwebsite.26@gmail.com`,
        to: `${options.email}`,
        subject: "Password Reset Request",
        text: options.message   
    }

    await transporter.sendMail(mailOptions);
}