// import nodemailer from "nodemailer";
import AWS from "aws-sdk";
AWS.config.update({ region: "us-west-2" });

interface IEmailParams {
  Destination: {
    ToAddresses: string[]
  };
  Message: {
    Body: {
      Html: {
        Charset: string
        Data: null | string
      },
      Text: {
        Charset: string
        Data: null | string
      }
    },
    Subject: {
      Charset: string
      Data: string
    }
  };
  Source: string;
}

class ContactModel {
  public ses = new AWS.SES({apiVersion: "2010-12-01"});
  private emailParams: IEmailParams = {
    Destination: {
      ToAddresses: ["kite.d92@gmail.com"]
    },

    Message: { /* required */
      Body: { /* required */
        Html: {
          Charset: "UTF-8",
          Data: null
        },
        Text: {
          Charset: "UTF-8",
          Data: null
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Form submission from dylankite.com"
      }
    },
    Source: "dylan-kite-site@protonmail.com"
  };

  public sendMessage = async (name: string, email: string, msg: string) => {
    const formattedMsg = `name: ${name}\nmessage: ${msg}\nrespond to: ${email}`;
    this.emailParams.Message.Body.Html.Data = `<p>${formattedMsg}</p>`;
    this.emailParams.Message.Body.Text.Data = formattedMsg;

    try {
      const result = await this.ses.sendEmail(this.emailParams).promise();
      console.log({result});
      return true;
    } catch (err) {
      console.log({err});
      return false;
    }
  }
  // transporter = nodemailer.createTransport({
  //   auth: {
  //     pass: testAccount.pass,
  //     user: testAccount.user
  //   },
  //   host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false
  // });
  // public sendMessage = async (name: string, email: string, msg: string) => {
  //   console.log("from model");
  //   try {
  //     const testAccount = await nodemailer.createTestAccount();
  //     console.log({testAccount});
  //     console.log({transporter: this.transporter});
  //     const info = await this.transporter.sendMail({
  //       from: `"${name}" <${email}>`,
  //       html: `<p>${msg}</p>`,
  //       subject: "email from personal site",
  //       text: msg,
  //       to: "kite.d92@gmail.com"
  //     });
  //     console.log({info});
  //     console.log(`Mesage sent: %s\n ${info.messageId}`);
  //     console.log(`Preview URL: %s\n${nodemailer.getTestMessageUrl(info)}`);
  //     return true;
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   }
  // }
}

const contactModel = new ContactModel();

export default contactModel;
