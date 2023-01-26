import db from "../../../utils/db";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import User from "@/models/User";
import {hashSync} from "bcrypt";
import crypto, {CipherGCMTypes, CipherKey} from "crypto";


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
  const hashedPassword = hashSync(password, 12);

  // Encrypting the password
  const key = process.env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);
  const cipher = crypto
      .createCipheriv("aes-256-cbc" as CipherGCMTypes, key as CipherKey, iv);

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
