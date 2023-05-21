import * as nodemailer from "nodemailer";
import {MailOptions} from "nodemailer/lib/json-transport";

/**
 * Emailer class to send emails using nodemailer
 */
export class Emailer {
  private readonly transporter: nodemailer.Transporter;
  private user: string;

  /**
   * Constructs a new Mailer instance.
   * @param {string} user - The email address from which emails will be sent
   * @param {string} password - The password for the user account to send emails from.
   */
  constructor(user: string, password: string) {
    /**
     * The transporter for sending emails.
     * @type {nodemailer.Transporter}
     */
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    this.user = user;
  }

  /**
 * Sends an email using the configured transporter.
 * @param {nodemailer.SendMailOptions} mailOptions - The options for sending the email.
 * @return {nodemailer.SentMessageInfo} A promise that resolves to the sent message information.
 */
  public async sendEmail(mailOptions: MailOptions) {
    return this.transporter.sendMail(mailOptions);
  }

  /**
 * Sends a verification email to the specified receiver with the given token.
 * @param {string} receiver - The email address of the receiver.
 * @param {string} token - The verification token.
 * @return {nodemailer.SentMessageInfo} A promise that resolves to the sent message information.
 */
  public async sendVerificationEmail(receiver: string, token: string) {
    const options = emailVerificationTemplate(this.user, receiver, token);
    return await this.sendEmail(options);
  }
}

/**
 * Generates an email verification template.
 *
 * @param {string} from - The sender's email address.
 * @param {string} to - The recipient's email address.
 * @param {string} token - The verification token.
 * @return {MailOptions} - The MailOptions.
 */
export const emailVerificationTemplate = (from: string, to: string, token: string) => {
  return {
    from: from,
    to: to,
    subject: "Verify your email",
    text: `Please verify your email by clicking the following link: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}">${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}</a></p>`,
  } as MailOptions;
};
