import Link from "next/link";
import { useState } from "react";

export default function LoginPanel() {

    // user credentials
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /** this is called when the form is submitted */
    const submitUser = async (e: any) => {
        e.PreventDefault();

        try {

            // define object to be sent via HTTP
            const user: {
                email: string,
                password: string,
            } = {
                email: email,
                password: password,
            }

            // log in
            const res = await fetch("", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                })
            })

            // type JSON? 
            const json = await res.json();

            // TODO add further logic

        } catch (e) {
            // TODO: redirect to error page
            alert("An error has occured")
        }
    }

    return (
        <>
            <div className="rounded-md w-1/4 min-h-2/5 ring-black m-5 bg-orange-50 shadow-2xl">
                <form onSubmit={(e: any) => submitUser(e)} className="form-control m-5 flex-col justify-center">

                    <input 
                    placeholder="Email"  
                    name="email"
                    id="email"
                    required
                    onChange = {(e: any) => setEmail(e.target.value)}
                    />

                    <input 
                    placeholder="Password"  
                    name="password"
                    id="password"
                    type="password"
                    required
                    onChange = {(e: any) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-center">
                        <button 
                        type="submit" 
                        className="btn w-1/2 bg-orange-600" 
                        >Log in</button>
                    </div>

                </form>

                <div className="flex justify-center m-3">
                    <Link href={"/signup"}>Sign up</Link>
                </div>
            </div>
        </>    
    );
}
