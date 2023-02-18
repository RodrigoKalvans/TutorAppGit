import {NextApiRequest, NextApiResponse} from "next";
import crypto, {CipherKey} from "crypto";

import {StatusCodes} from "http-status-codes";
import Student from "../../../models/Student";
import Tutor from "../../../models/Tutor";
import db from "../../../utils/db";
import {getToken} from "next-auth/jwt";
import {hash} from "argon2";

/**
 * Sign up route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return;
  }

  // Check if user is already logged in
  const token = await getToken({req});

  if (token) {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are logged in already!"});
    return;
  }

  // Add check property
  const reqUser = req.body;
  console.log(reqUser)

  if (!reqUser.firstName || !reqUser.lastName ||
        !reqUser.role || !reqUser.email || !reqUser.password ||
        (reqUser.role !== "student" && reqUser.role !== "tutor")) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Not enough information (Validation Error)"});
    return;
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

  // Hash the password with bcrypt
  const hashedPassword = await hash(reqUser.password);

  // Encrypting the password using AES-256-CBC
  let key = process.env.ENCRYPTION_KEY;
  key = key?.slice(0, 32);

  // Generate IV and create cipher
  const iv = crypto.randomBytes(16).subarray(0, 16);
  const cipher = crypto
      .createCipheriv("aes-256-cbc", key as CipherKey, iv);

  // Encrypt already hashed password for more security
  let encrypted = cipher.update(hashedPassword);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const encryptedHashedPassword = `${iv.toString("hex")}
      :${encrypted.toString("hex")}`;

  // Initializing a new user depending on their role
  reqUser.password = encryptedHashedPassword;
  let newUser;
  if (reqUser.role === "student") {
    newUser = new Student(reqUser);
  } else if (reqUser.role === "tutor") {
    newUser = new Tutor(reqUser);
  } else {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "This role is not supported"});
    return;
  }

  await newUser.save();

  delete newUser.password;
  delete newUser.role;

  res.status(StatusCodes.CREATED).json({user: newUser});
  return;
};

export default handler;
