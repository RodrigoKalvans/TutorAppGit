import {signIn} from "next-auth/react";

const fakeAuth = () => {
  return (
    <div>
      fakeAuth
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
};

export default fakeAuth;
