# How to use NextAuth and secured routes in this project

## Introduction

NextAuth allows us to handle authentication easier and provides different ways of authentication. Currently only authentication with credentials are used, but in the future OAuth can be easily added.

The NextAuth config can be found at `[...nextauth].ts`. After successful authentication the object with id, first name, last name and role is returned. It is used in the callbacks to populate jwt and session.

You need to include NEXTAUTH_SECRET to your .env file, so that it can be used in the production as the secret to generate all tokens and cookies. Not providing it will result in the error in production mode.

The information with examples on how to secure pages and API routes can be found here https://next-auth.js.org/tutorials/securing-pages-and-api-routes.

## Securing pages on Client Side

The easiest and simplest way to get the session on the Client Side is to use `useSession()` hook from next-auth/react. This way is recommended. the hook will return data (session) and status (loading, authenticated, notauthenticated). It can be then used to validate if the user is signed in or not and if we need to display certain components on the page. Simply checking is the session object is defined will do the work. This session object contains all the properties added in the callback in `[...nextauth].ts`.

## Securing pages on Server Side

You can protect server side rendered pages using the `unstable_getServerSession` method. This is different from the old `getSession()` method, in that it does not do an extra fetch out over the internet to confirm data from itself, increasing performance significantly.

Example:

    import { unstable_getServerSession } from "next-auth/next"
    import { authOptions } from "./api/auth/[...nextauth]"
    import { useSession } from "next-auth/react"

    export default function Page() {
      const { data: session } = useSession()

      if (typeof window === "undefined") return null

      if (session) {
        return (
          <>
            <h1>Protected Page</h1>
            <p>You can view this page because you are signed in.</p>
          </>
        )
      }
      return <p>Access Denied</p>
    }

    export async function getServerSideProps(context) {
      return {
        props: {
          session: await unstable_getServerSession(
            context.req,
            context.res,
            authOptions
          ),
        },
      }
    }

## Securing API routes

### Using unstable_getServerSession()

You can protect API routes using the unstable_getServerSession() method.

    import { unstable_getServerSession } from "next-auth/next"
    import { authOptions } from "./auth/[...nextauth]"

    export default async (req, res) => {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (session) {
        // Signed in
        console.log("Session", JSON.stringify(session, null, 2))
      } else {
        // Not Signed in
        res.status(401)
      }
      res.end()
    }

### Using getToken()

If you are using JSON Web Tokens you can use the getToken() helper to access the contents of the JWT without having to handle JWT decryption / verification yourself. This method can only be used server side.

    // This is an example of how to read a JSON Web Token from an API route
    import { getToken } from "next-auth/jwt"

    export default async (req, res) => {
      // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
      const token = await getToken({ req })
      if (token) {
        // Signed in
        console.log("JSON Web Token", JSON.stringify(token, null, 2))
      } else {
        // Not Signed in
        res.status(401)
      }
      res.end()
    }

## Middleware

If you want to use middleware for some pages follow this link: https://next-auth.js.org/configuration/nextjs#middleware. It is also advisable to study the Next.js documentation on middleware (https://nextjs.org/docs/advanced-features/middleware). It is worth noting that NextAuth gives us another way to secure and protect routes. See chapters above.