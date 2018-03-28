var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

class Mail{
    constructor(){
        this.service = "";
        this.auth = {
            username: "",
            password: ""
        };
        this.from = "";
        this.to = "";
        this.subject = "";
        this.text = "";
        this.transporter;
    }

    getTransporter(service, userEmail, password){
        return nodemailer.createTransport({
                    service: service,
                    auth: {
                        xoauth2: xoauth2.createXOAuth2Generator({
                            user: userEmail,
                            clientid: '491977458125-9oc89e1cifklghdg8p9b53lsc8icr5ah.apps.googleusercontent.com',
                            clientSecret: 'pQ_MCT1vuhFHYpiIkctC4u_B',
                            refreshToken: ''
                        })
                    },
                    /*
                    tls: {
                        rejectUnauthorized: false
                    }*/
                });
    }

    sendMail(to, from, subject, text, transporter){
        var mailOptions = {
            to: to,
            from: from,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error)
                console.log(error);
            else
                console.log(info);
        });
    }
}

module.exports = Mail;