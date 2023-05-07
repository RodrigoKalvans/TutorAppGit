/* eslint-disable no-unused-vars */
import NextAuth from "next-auth";
import {DefaultUser} from "next-auth";
import {DefaultSession} from "next-auth";
import {JWT} from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`
   * and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      firstName: string,
      lastName: string,
      role: string,
      picture?: string,
    }
  }

  interface User {
    id: string
    firstName: string,
    lastName: string,
    role: string,
    picture?: string,
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string,
    firstName: string,
    lastName: string,
    role: string,
    picture?: string,
  }
}

