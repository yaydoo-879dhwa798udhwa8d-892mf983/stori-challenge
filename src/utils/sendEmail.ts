import { EmailData } from "../types/EmailType";

("use strict");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(data: EmailData) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: data.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Email test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div style="text-align:center;"> <img
            src="https://www.storicard.com/_next/static/media/logo.9a85efb3.svg"
            alt="W3Schools.com"
          /><div>
            <br/>
            <div>Total Balance: ${data.totalBalance}</div>
            <br/>
            <div>Average debit amount: ${data.debitAverage}</div>
            <br/>
            <div>Average credit amount: ${data.creditAverage}</div>
            <br/>
            <div>
                Number of transactions in Jan: ${data.monthTransactions[0].transactions}
            </div>
            <div>
                Number of transactions in Feb: ${data.monthTransactions[1].transactions}
            </div>
            <div>
                Number of transactions in Mar: ${data.monthTransactions[2].transactions}
            </div>
            <div>
                Number of transactions in Apr: ${data.monthTransactions[3].transactions}
            </div>
            <div>
                Number of transactions in May: ${data.monthTransactions[4].transactions}
            </div>
            <div>
                Number of transactions in June: ${data.monthTransactions[5].transactions}
            </div>
            <div>
                Number of transactions in July: ${data.monthTransactions[6].transactions}
            </div>
            <div>
                Number of transactions in Aug: ${data.monthTransactions[7].transactions}
            </div>
            <div>
                Number of transactions in Sept: ${data.monthTransactions[8].transactions}
            </div>
            <div>
                Number of transactions in Oct: ${data.monthTransactions[9].transactions}
            </div>
            <div>
                Number of transactions in Nov: ${data.monthTransactions[10].transactions}
            </div>
            <div>
                Number of transactions in Dec: ${data.monthTransactions[11].transactions}
            </div>
      </body>
    </html>
    `,
    // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export { sendEmail };
