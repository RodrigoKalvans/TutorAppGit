import {signIn, signOut, useSession} from "next-auth/react";

// password12345 
const fakeAuth = () => {
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
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      )}

    </div>
  );
};

export default fakeAuth;
