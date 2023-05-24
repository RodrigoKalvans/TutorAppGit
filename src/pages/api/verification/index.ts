import EmailVerification from "@/models/EmailVerification";
import {verifyEmailToken} from "@/utils/apiHelperFunction/verificationHelper";
import db from "@/utils/db";
import {Emailer} from "@/utils/emailer";
import {StatusCodes} from "http-status-codes";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle only "GET" and "POST" methods
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
    return;
  }

  await db.connect();

  if (req.method === "GET") {
    const {token} = req.query;

    // Validate token existence
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Required property [token] is not present"});
      return;
    }

    const verificationResult = await verifyEmailToken(token as string);

    if (verificationResult.error) {
      res.status(StatusCodes.BAD_REQUEST).send(verificationResult.error);
    } else {
      res.redirect("/auth/singin");
    }
  } else if (req.method === "POST") {
    const {email} = req.body;

    // Validate email existence
    if (!email) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Required body property [email] is not present"});
      return;
    }

    const emailVerificationEntry = await EmailVerification.findOne({email: email});

    if (!emailVerificationEntry) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "This email address is not registered"});
      return;
    }

    const lastSent = new Date(emailVerificationEntry.updatedAt);

    // Check if the last verification email request was sent more than 15 seconds ago
    if (lastSent.getTime() + 15000 > new Date().getTime()) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Too many email verification requests at a time"});
      return;
    }

    const emailer = new Emailer(process.env.GOOGLE_USER!, process.env.GOOGLE_APP_PASSWORD!);
    const result = await emailer.sendVerificationEmail(emailVerificationEntry.email, emailVerificationEntry.token);

    if (result.error) {
      res.status(StatusCodes.BAD_REQUEST).send(
          {
            message: "Error occurred during sending the verification email",
            error: result.error,
          },
      );
      return;
    }

    emailVerificationEntry.updatedAt = new Date();

    await emailVerificationEntry.save();
    res.status(StatusCodes.OK).send({message: "Verification email has been sent"});
  }
};

export default handler;
