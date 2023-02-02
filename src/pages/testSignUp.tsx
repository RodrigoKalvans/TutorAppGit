import { signIn } from "next-auth/react";
import { useState } from "react";

const testSignUp = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password,setPassword] = useState(null);

  const handleInputChange = (e: any) => {
    const {id , value} = e.target;
    if(id === "firstName"){
        setFirstName(value);
    }
    if(id === "lastName"){
        setLastName(value);
    }
    if(id === "email"){
        setEmail(value);
    }
    if(id === "password"){
        setPassword(value);
    }
  }

  // Signs up a new user, logs him in and redirects to the testAuth page where information
  // about him is displayed
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        role: "tutor",
        email: email,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const json = await res.json();

    if (json) {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/testAuth"
      });

      if (result?.error) {
        alert(result.error);
      }
    }
  }

  return(
    <div className="form">
        <div className="form-body">
            <div className="username">
                <label className="form__label">First Name </label>
                <input onChange = {(e) => handleInputChange(e)} type="text" id="firstName" placeholder="First Name"/>
            </div>
            <div className="lastname">
                <label className="form__label">Last Name </label>
                <input  type="text" name="" id="lastName" onChange = {(e) => handleInputChange(e)}placeholder="LastName"/>
            </div>
            <div className="email">
                <label className="form__label">Email </label>
                <input  type="email" id="email" onChange = {(e) => handleInputChange(e)}placeholder="Email"/>
            </div>
            <div className="password">
                <label className="form__label">Password </label>
                <input onChange = {(e) => handleInputChange(e)} type="password"  id="password" placeholder="Password"/>
            </div>
        </div>
        <div>
            <button onClick={async () => await handleSubmit()} type="submit">Register</button>
        </div>
    </div>      
  )      
};

export default testSignUp;