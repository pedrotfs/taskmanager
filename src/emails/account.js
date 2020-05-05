const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: "pedrotfs@gmail.com",
        subject: "Welcome!",
        text: "Welcome to the app, " + name + ". feedback is appreciated!"
    })
}

const sendGoodbye = (email, name) => {
    sgMail.send({
        to: email,
        from: "pedrotfs@gmail.com",
        subject: "Goodbye!",
        text: "Hey, "+ name + ", we will miss you!"
    })
}

module.exports = {
    sendWelcome,
    sendGoodbye
}