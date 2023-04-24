import {signOut, useSession} from "next-auth/react";

import Link from "next/link";

/**
 * Page for testing authentication
 * @return {JSX} page to be displayed
 */
const TestAuth = () => {
  const {data: session} = useSession();

  return (
    <div>
      <p>fakeAuth</p>

      {!session && (
        <Link href="/auth/signin">Sign in</Link>
      )}
      {session && (
        <div>
          <p>Your id is: {session.user.id}</p>
          <p>Your first name is: {session.user.firstName}</p>
          <p>Your last name is: {session.user.lastName}</p>
          <p>Your role: {session.user.role}</p>
          <div><button onClick={async () => {
            const res = await fetch(`/api/tutors/${session.user.id}`,
                {
                  method: "PUT",
                  body: JSON.stringify({
                    secondName: "Jobich",
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

            const json = await res.json();

            console.log(json);
          }}>Update First Name</button></div>
          <div><button onClick={async () => {
            const res = await fetch(`/api/tutors/${session.user.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

            const json = await res.json();

            console.log(json);
          }}>Delete account</button></div>
          <button onClick={async () => await signOut()}>Sign Out</button>
        </div>
      )}

    </div>
  );
};

export default TestAuth;
