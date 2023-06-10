import PasswordReset from "@/models/PasswordReset";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {hashAndEncryptPassword, validatePassword} from "@/utils/apiHelperFunction/authenticationHelper";
import {verifyPasswordResetToken} from "@/utils/apiHelperFunction/verificationHelper";
import db from "@/utils/db";
import {Emailer} from "@/utils/emailer";
import {StatusCodes} from "http-status-codes";
import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {v4 as uuidv4} from "uuid";

/**
 * Password reset route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Handle only "GET" and "POST" methods
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).end();
    return;
  }

  await db.connect();

  if (req.method === "GET") await handlePasswordResetTokenVerification(req, res);
  if (req.method === "POST") await handleResetPasswordEmailRequest(req, res);
  if (req.method === "PUT") await handlePasswordReset(req, res);

  return;
};

const handlePasswordResetTokenVerification = async (req: NextApiRequest, res: NextApiResponse) => {
  const {token} = req.query;

  // Validate token existence
  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).send({message: "Required property [token] is not present"});
    return;
  }

  const verificationResult = await verifyPasswordResetToken(token as string);

  if (verificationResult.error) {
    res.status(StatusCodes.BAD_REQUEST).send(verificationResult.error);
  } else {
    res.status(StatusCodes.OK).send({message: "Reset password token has been verified"});
  }

  return;
};

const handleResetPasswordEmailRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const {email} = req.body;

  // Validate email existence
  if (!email) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Required body property [email] is not present"});
    return;
  }

  const emailer = new Emailer(process.env.GOOGLE_USER!, process.env.GOOGLE_APP_PASSWORD!);

  // Check if the record with this email exists
  let passwordResetRecord = await PasswordReset.findOne({email: email});

  // Resend the password reset email
  if (passwordResetRecord) {
    const lastSent = new Date(passwordResetRecord.updatedAt);

    // Check if the last password reset email request was sent more than 15 seconds ago
    if (lastSent.getTime() + 15000 > new Date().getTime()) {
      res.status(StatusCodes.BAD_REQUEST).send({message: "Too many reset password email requests at a time"});
      return;
    }

    const expirationTime = new Date(passwordResetRecord.expiresAt);

    if (expirationTime.getTime() < new Date().getTime()) {
      passwordResetRecord.token = uuidv4();
    }

    const result = await emailer.sendPasswordResetEmail(passwordResetRecord.email, passwordResetRecord.token);

    if (result.error) {
      res.status(StatusCodes.BAD_REQUEST).send(
          {
            message: "Error occurred during sending the verification email",
            error: result.error,
          },
      );
      return;
    }

    passwordResetRecord.updatedAt = new Date();
    await passwordResetRecord.save();

    res.status(StatusCodes.OK).send({message: "If there is an account associated with this email address, the password reset email has been sent to the address"});
    return;
  }

  let user = await Student.findOne({email: email});

  if (!user) {
    user = await Tutor.findOne({email: email});

    if (!user) {
      res.status(StatusCodes.OK).send({message: "If there is an account associated with this email address, the password reset email has been sent to the address"});
      return;
    }
  }

  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 30);

  const resetToken = uuidv4();
  passwordResetRecord = new PasswordReset({
    email: email,
    token: resetToken,
    role: user.role,
    allowed: false,
    expiresAt: expirationTime,
  });

  await passwordResetRecord.save();

  const result = await emailer.sendPasswordResetEmail(email, resetToken);

  if (result.error) {
    res.status(StatusCodes.BAD_REQUEST).send(
        {
          message: "Error occurred during sending the verification email",
          error: result.error,
        },
    );
    return;
  }

  res.status(StatusCodes.OK).send({message: "If there is an account associated with this email address, the password reset email has been sent to the address"});
  return;
};

const handlePasswordReset = async (req: NextApiRequest, res: NextApiResponse) => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Required query parameters are not present"});
    return;
  }

  const passwordResetRecord = await PasswordReset.findOne({email: email});

  if (!passwordResetRecord) {
    res.status(StatusCodes.NOT_FOUND).send({message: "There is no password reset request associated with this email"});
    return;
  } else if (!passwordResetRecord.allowed) {
    res.status(StatusCodes.FORBIDDEN).send({message: "The password reset request has not been verified"});
    return;
  }

  const isPasswordValid = validatePassword(password);

  if (!isPasswordValid) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Password does not meet the requirements"});
    return;
  }

  const hashedPassword = await hashAndEncryptPassword(password);

  try {
    if (passwordResetRecord.role === "student") {
      await Student.updateOne({
        email: passwordResetRecord.email,
      }, {
        password: hashedPassword,
      });
    } else if (passwordResetRecord.role === "tutor") {
      await Tutor.updateOne({
        email: passwordResetRecord.email,
      }, {
        password: hashedPassword,
      });
    }

    await PasswordReset.findByIdAndDelete(passwordResetRecord._id);

    res.status(StatusCodes.OK).send({message: "Password has been reset"});
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      message: "Error occurred while resetting the password",
      error: error,
    });
  }

  return;
};

export default handler;
