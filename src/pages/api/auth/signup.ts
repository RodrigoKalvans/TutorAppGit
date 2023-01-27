import db from "../../../utils/db";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import User from "@/models/User";
import {hash} from "argon2";
import crypto, {CipherKey} from "crypto";

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

  const {firstName, lastName, role, email, password} = req.body;

  if (!firstName || !lastName || !role || !email || !password) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Validation Error"});
  }

  await db.connect();

  // Check if user already exists
  const foundUser = await User.findOne({email: email});

  if (foundUser) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "User already exists"});
  }

  // Hash the password with bcrypt
  const hashedPassword = await hash(password);

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

  // Initializing a new user
  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    role: role,
    email: email,
    password: encryptedHashedPassword,
  });

  await newUser.save();
  res.status(StatusCodes.CREATED).json({message: "User created successfully"});
};

export default handler;
