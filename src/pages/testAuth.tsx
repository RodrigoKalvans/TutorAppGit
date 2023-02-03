import {signIn, signOut, useSession} from "next-auth/react";


const testAuth = () => {
  const {data: session} = useSession();

  return (
    <div>
      <p>fakeAuth</p>

      {!session && (
        <button onClick={async () => await signIn()}>Sign In</button>
      )}
      {session && (
        <div>
          <p>Your id is: {session.user.id}</p>
          <p>Your first name is: {session.user.firstName}</p>
          <p>Your last name is: {session.user.lastName}</p>
          <p>Your role: {session.user.role}</p>
          <div><button onClick={async () => {
            const res = await fetch("http://localhost:3000/api/tutors/63d81bd6bcac71a5dcc321fe",
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
          <button onClick={async () => await signOut()}>Sign Out</button>
        </div>
      )}

    </div>
  );
};

export default testAuth;
