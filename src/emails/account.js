const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API)


const welcomeMail =(email,name)=>{
    sgMail.send({ 
     to: email, // Change to your recipient
    from: 'asateralcomedi123@gmail.com', // Change to your verified sender
    subject: 'Welcome to task app.',
    text: `Welcome ${name} to Task Manager:).`,
    
})
}


const deleteMail =(email,name)=>{
    sgMail.send({ 
     to: email, // Change to your recipient
    from: 'asateralcomedi123@gmail.com', // Change to your verified sender
    subject: 'Your account has been removed ',
    text: `Hi ${name}, Your account has been removed! `,
    
})
}
module.exports={
    welcomeMail,
    deleteMail
}