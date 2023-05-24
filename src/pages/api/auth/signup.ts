import {NextApiRequest, NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";
import Student from "../../../models/Student";
import Tutor from "../../../models/Tutor";
import db from "../../../utils/db";
import {getToken} from "next-auth/jwt";
import {subscribeUserToNewsletter} from "@/utils/apiHelperFunction/newsletterHelper";
import {Emailer} from "@/utils/emailer";
import {v4 as uuidv4} from "uuid";
import EmailVerification from "@/models/EmailVerification";
import Subject from "@/models/Subject";
import {hashAndEncryptPassword, validatePassword} from "@/utils/apiHelperFunction/authenticationHelper";

/**
 * Sign up route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
    return;
  }

  // Check if user is already logged in
  const token = await getToken({req});

  if (token) {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are logged in already!"});
    return;
  }

  if (!req.body.firstName || !req.body.lastName ||
        !req.body.role || !req.body.email || !req.body.password ||
        (req.body.role !== "student" && req.body.role !== "tutor")) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Not enough information (Validation Error)"});
    return;
  }

  const reqUser: {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
    priceForLessons?: any,
  } = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };
  if (req.body.role === "tutor" && req.body.priceForLessons) {
    reqUser.priceForLessons = req.body.priceForLessons;
  }

  await db.connect();

  // Check if user already exists as a student or as a tutor
  let foundUser = await Student.findOne({email: reqUser.email});

  if (foundUser) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "User with this email already exists"});
    return;
  } else {
    foundUser = await Tutor.findOne({email: reqUser.email});

    if (foundUser) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY)
          .send({message: "User with this email already exists"});
      return;
    }
  }

  const isPasswordValid = validatePassword(reqUser.password);

  if (!isPasswordValid) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Password does not meet the requirements"});
    return;
  }
  // Hash and encrypt the password
  reqUser.password = await hashAndEncryptPassword(reqUser.password);
  let newUser;
  if (reqUser.role === "student") {
    newUser = new Student(reqUser);
  } else if (reqUser.role === "tutor") {
    newUser = new Tutor(reqUser);
  } else {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "This role is not supported"});
    return;
  }

  // Add subjects to user if subjectsIds exists
  if (req.body.subjectIds) {
    const {subjectIds} = req.body;

    // Add subject ids to user. Prevent duplicates
    for (let i = 0; i < subjectIds.length; i++) {
      if (!newUser.subjects.includes(subjectIds[i])) {
        newUser.subjects.push(subjectIds[i]);
      }
    }

    // Check if new user is a tutor
    if (newUser.role === "tutor") {
      // Add the tutor to new subjects
      await Subject.updateMany({
        _id: {
          $in: newUser.subjects,
        },
      },
      {
        $addToSet: {
          tutors: newUser._id,
        },
      });
    }
  }

  newUser.emailVerified = false;
  await newUser.save();

  const emailer = new Emailer(process.env.GOOGLE_USER!, process.env.GOOGLE_APP_PASSWORD!);

  const verificationToken = uuidv4();
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 30);

  const verificationDbEntry = new EmailVerification({
    email: newUser.email,
    token: verificationToken,
    role: newUser.role,
    expiresAt: expirationTime,
  });
  await verificationDbEntry.save();

  const result = await emailer.sendVerificationEmail(newUser.email, verificationToken);

  if (result.error) {
    res.status(StatusCodes.BAD_REQUEST).send(
        {
          message: "Error occurred during sending the verification email",
          error: result.error,
        },
    );
    return;
  }

  // Check if user wanted to subscribe to newsletters
  if (req.body.subscribeToNewsletters && req.body.subscribeToNewsletters === true) {
    try {
      const res = await subscribeUserToNewsletter(newUser.email, newUser.firstName, newUser.lastName, newUser.role);
      newUser.subscriberId = res.data.id;
      await newUser.save();
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST)
          .send({message: "Error occurred while subscribing user to newsletter.", error: error});
      return;
    }
  }

  delete newUser.password;
  delete newUser.role;

  res.status(StatusCodes.CREATED).json({user: newUser});
  return;
};

export default handler;
