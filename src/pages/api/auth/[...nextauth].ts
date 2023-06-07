import NextAuth, {NextAuthOptions} from "next-auth";
import crypto, {CipherKey} from "crypto";

import CredentialsProvider from "next-auth/providers/credentials";
import Student from "../../../models/Student";
import Tutor from "@/models/Tutor";
import db from "../../../utils/db";
import {verify} from "argon2";
import Admin from "@/models/Admin";

/**
 * Authentication options that are going to be used by NextAuth
 * CredentialsProvider is used to support email/password log in
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        const {email, password} = credentials as {
          email: string,
          password: string,
        };

        await db.connect();

        let user = await Student.findOne({email: email});
        if (!user) {
          user = await Tutor.findOne({email: email});
        }
        if (!user) {
          user = await Admin.findOne({email: email});
        }
        if (!user) throw new Error("Wrong credentials!");

        if (!user.emailVerified && user.role !== "admin") {
          throw new Error("You need to verify your email address before you can sign in.");
        }
        // Split the IV and the encrypted hashed password
        const [iv, encryptedHashedPassword] = user.password.split(":");

        // Get the encryption key from the environment variable
        // and truncate the key to 32 bytes
        let key = process.env.ENCRYPTION_KEY;
        key = key?.slice(0, 32);

        // Create the IV buffer and buffer for the encrypted hashed password
        const ivBuffer = Buffer.from(iv, "hex").subarray(0, 16);
        const encryptedHashedPasswordBuffer = Buffer
            .from(encryptedHashedPassword, "hex");

        // Create the decipher
        const decipher = crypto
            .createDecipheriv("aes-256-cbc",
            key as CipherKey, ivBuffer);

        // Decrypt the hashed password
        let decrypted = decipher.update(encryptedHashedPasswordBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const hashedPassword = decrypted.toString();

        // Comparing the passwords
        const isValid = await verify(hashedPassword, password);
        if (!isValid) throw new Error("Wrong credentials!");

        // await db.disconnect();

        // Returning the object to jwt
        const res: {
          id: string
          firstName: string,
          lastName: string,
          role: string,
          picture?: string,
          emailVerified?: boolean,
        } = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };

        if (user.picture && user.role !== "admin") res.picture = user.picture;
        if (user.emailVerified && user.role !== "admin") res.emailVerified = user.emailVerified;

        return res;
      },
    }),
  ],
  session: {
    strategy: "jwt",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    /**
     * Configuring the token that will be returned
     * @param {Object} param0 token and user passed from authorize function
     * @return {Token} token
     */
    jwt: async ({token, user, trigger, session}) => {
      if (trigger === "update" && session.picture) {
        token.picture = session.picture;
      }

      if (user?.id) token.id = user.id;
      if (user?.firstName) token.firstName = user.firstName;
      if (user?.lastName) token.lastName = user.lastName;
      if (user?.role) token.role = user.role;
      if (user?.picture) token.picture = user.picture;

      return token;
    },
    /**
     * Configuring the session that will be returned
     * @param {Object} param0 session and token passed from jwt function
     * @return {Session} token
     */
    session: async ({session, token}) => {
      if (token?.id) session.user.id = token.id;
      if (token?.firstName) session.user.firstName = token.firstName;
      if (token?.lastName) session.user.lastName = token.lastName;
      if (token?.role) session.user.role = token.role;
      if (token?.picture) session.user.picture = token.picture;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
