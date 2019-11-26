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
}

const contactModel = new ContactModel();

export default contactModel;
