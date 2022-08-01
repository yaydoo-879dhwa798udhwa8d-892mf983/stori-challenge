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
    from: '"Stori 💳" <support@stori.com>', // sender address
    to: data.email, // list of receivers
    subject: "Account statement ✔", // Subject line
    text: "Account statement", // plain text body
    html: `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Email test</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      #customers {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      #customers td,
      #customers th {
        border: 1px solid #ddd;
        padding: 8px;
      }

      #customers tr:nth-child(even) {
        background-color: #f2f2f2;
      }

      #customers tr:hover {
        background-color: #ddd;
      }

      #customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04aa6d;
        color: white;
      }
    </style>
  </head>
  <body>
    <div style="text-align: center">
       <img
        src="https://www.storicard.com/_next/static/media/logo.9a85efb3.svg"
        alt="W3Schools.com"
      /> 
    </div>
    <br />
    <table id="customers">
      <tr>
        <th style="text-align: center">Total Balance</th>
      </tr>
      <tr style="text-align: center">
        <td>${data.totalBalance}</td>
      </tr>
    </table>
    <table id="customers" style="text-align: center">
      <tr>
        <th>Month</th>
        <th>Number of transactions</th>
        <th>Average credit</th>
        <th>Average debit</th>
      </tr>
      <tr>
        <td>January</td>
        <td>${data.monthTransactions[0].transactions}</td>
        <td>${data.creditMonthTransactions[0].average}</td>
        <td>${data.debitMonthTransactions[0].average}</td>
      </tr>
      <tr>
        <td>February</td>
        <td>${data.monthTransactions[1].transactions}</td>
        <td>${data.creditMonthTransactions[1].average}</td>
        <td>${data.debitMonthTransactions[1].average}</td>
      </tr>
      <tr>
        <td>March</td>
        <td>${data.monthTransactions[2].transactions}</td>
        <td>${data.creditMonthTransactions[2].average}</td>
        <td>${data.debitMonthTransactions[2].average}</td>
      </tr>
      <tr>
        <td>April</td>
        <td>${data.monthTransactions[3].transactions}</td>
        <td>${data.creditMonthTransactions[3].average}</td>
        <td>${data.debitMonthTransactions[3].average}</td>
      </tr>
      <tr>
        <td>May</td>
        <td>${data.monthTransactions[4].transactions}</td>
        <td>${data.creditMonthTransactions[4].average}</td>
        <td>${data.debitMonthTransactions[4].average}</td>
      </tr>
      <tr>
        <td>June</td>
        <td>${data.monthTransactions[5].transactions}</td>
        <td>${data.creditMonthTransactions[5].average}</td>
        <td>${data.debitMonthTransactions[5].average}</td>
      </tr>
      <tr>
        <td>July</td>
        <td>${data.monthTransactions[6].transactions}</td>
        <td>${data.creditMonthTransactions[6].average}</td>
        <td>${data.debitMonthTransactions[6].average}</td>
      </tr>
      <tr>
        <td>August</td>
        <td>${data.monthTransactions[7].transactions}</td>
        <td>${data.creditMonthTransactions[7].average}</td>
        <td>${data.debitMonthTransactions[7].average}</td>
      </tr>
      <tr>
        <td>September</td>
        <td>${data.monthTransactions[8].transactions}</td>
        <td>${data.creditMonthTransactions[8].average}</td>
        <td>${data.debitMonthTransactions[8].average}</td>
      </tr>
      <tr>
        <td>October</td>
        <td>${data.monthTransactions[9].transactions}</td>
        <td>${data.creditMonthTransactions[9].average}</td>
        <td>${data.debitMonthTransactions[9].average}</td>
      </tr>
      <tr>
        <td>November</td>
        <td>${data.monthTransactions[10].transactions}</td>
        <td>${data.creditMonthTransactions[10].average}</td>
        <td>${data.debitMonthTransactions[10].average}</td>
      </tr>
      <tr>
        <td>December</td>
        <td>${data.monthTransactions[11].transactions}</td>
        <td>${data.creditMonthTransactions[11].average}</td>
        <td>${data.debitMonthTransactions[11].average}</td>
      </tr>
    </table>
    <br />
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
