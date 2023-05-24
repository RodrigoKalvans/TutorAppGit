import {hash} from "argon2";
import crypto, {CipherKey} from "crypto";

export const validatePassword = (password: string) => {
  // Define regular expressions for each password rule
  const minLengthRegex = /.{10,}/;
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // Check if the password meets all the required rules
  const isValid =
    minLengthRegex.test(password) &&
    lowercaseRegex.test(password) &&
    uppercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password);

  return isValid;
};

export const hashAndEncryptPassword = async (plainPassword: string) => {
  // Hash the password with argon2
  const hashedPassword = await hash(plainPassword);

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

  return encryptedHashedPassword;
};
