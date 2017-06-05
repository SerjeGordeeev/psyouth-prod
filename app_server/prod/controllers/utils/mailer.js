var nodemailer = require('nodemailer');
//var sendgrid = require('sendgrid')('SerjeGordeev')


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
    service: 'Gmail',
    auth: {
        user: 'sergeygordeev95@gmail.com',
        pass: '$$RocK95'
    }
});


module.exports = function(mail, password, user){
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'FIST', // sender address
        to: mail, // list of receivers
        subject: 'Регистрация в системе PsychoPass', // Subject line
        text: ` Здравствуйте ${user.name}. Благодарим вас за регистрацию в системе. \n Данные для входа: \n Логин: ${user.login} \n Пароль: ${password} `, // plaintext body
        html: '' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}