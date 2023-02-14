import Link from "next/link";
import Select from "react-tailwindcss-select";
import { signIn } from "next-auth/react";
import { useState } from "react";

// change props type
/**
 * Panel is displayed on the signup page
 * User fills form, then it is submitted
 * @param {props}: All subject that the tutor can pick
 * @returns 
 */
export default function SignupPanel({props}: {props: any}) {

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // only for tutors
    const [minutes, setMinutes] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [chosenSubjects, setSubjects] = useState<string[]>();
    
    // agree to terms
    const [check, setCheck] = useState<any>();

    // change roll on button clicks
    const [role, setRole] = useState<string>("student");
    const setStudent = () => {
        setRole("student");
    }
    const setTutor = () => {
        setRole("tutor");
    }

    /** turn subject props into parsable data by Select element
     * is called when subject Select element is initialized
     */
    const getSubjectOptions = () => {
        const options: { value: string; label: string; }[] = [];
        props.map((subject: any) => options.push({ value: `${subject._id}`, label: `${subject.name}` }))
        return options;
    }

    /** is called onChange in subject Select element */
    const setSelectedSubjects = (value: any) => {
        setSubjects(value);
    }

    /** called when sending PUT request to update tutor subjects
     * condense subjects down to id[]
     */
    const getArrayOfChosenSubjectIds = () => {
        let placeholder: string[] = [];
        for (const i in chosenSubjects) {
            placeholder.push(i);
        }
        return placeholder;
    }

    /** is called when the form is submitted by either a student or tutor */
    const submitUser = async (e: any) => {
        e.preventDefault()
        console.log('submit')

        // TODO: check if needed
        // is this needed if submitUser is not called onClick?
        if (!check || !firstName || !lastName || !email || !password) {
            console.log('fail')
            return;
        }

        try {

            // define object to be sent via HTTP
            const user: {
                firstName: string,
                lastName: string,
                email: string,
                password: string,
                role: string,
                priceForLessons?: {}
            } = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role,
            }

            // changes entered prices to proper format
            if (role === "tutor") {
                const temp = new Map();
                temp.set(minutes, price)

                // what type is this shit?
                const map: any = {};
                temp.forEach((val: string, key: string) => {
                    map[key] = val;
                });

                user.priceForLessons = map;
                console.log(user.priceForLessons)
            }        

            // post new user to the database
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // is this type JSON?
            const json: any = await res.json();

            // sign the user is and redirect
            if (json) {
                const result = await signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/testAuth",
                });

                if (result?.error) {
                    alert(result.error);
                }
            }

            // if user is a tutor, send patch request to update subjects
            if (role === "tutor") {
                console.log('ids',getArrayOfChosenSubjectIds()) // test
                const res = await fetch("http://localhost:3000/api/subjects/subscribeTutorToSubjects", {
                    method: "PUT",
                    body: JSON.stringify({
                        subjects: getArrayOfChosenSubjectIds()
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }
        } catch (e) {
            // TODO: redirect to error page
            alert('An error has occured');
        }
    };

    return (
        <>
            <div className="rounded-md w-1/4 min-h-2/5 ring-black m-5 bg-orange-100 shadow-2xl">
                <div className="btn-group w-full">
                    <button onClick={setStudent} className="btn w-1/2 bg-orange-600 hover:bg-orange-500" >Student</button>
                    <button onClick={setTutor} className="btn w-1/2 bg-orange-600 hover:bg-orange-500">Tutor</button>
                </div>

                <form onSubmit={(e: any) => submitUser(e)} className="form-control m-5 flex-col justify-center">
                    <input 
                    placeholder="First name" 
                    name="firstName"
                    id="firstName"
                    required
                    className="" 
                    onChange = {(e: any) => setFirstName(e.target.value)}
                    />

                    <input 
                    placeholder="Last name"  
                    name="lastName"
                    id="lastName"
                    required
                    className="" 
                    onChange = {(e: any) => setLastName(e.target.value)}
                    />

                    <input 
                    placeholder="Email"  
                    name="email"
                    id="email"
                    required
                    className="" 
                    onChange = {(e: any) => setEmail(e.target.value)}
                    />

                    <input 
                    placeholder="Password"  
                    name="password"
                    id="password"
                    type="password"
                    required
                    className="" 
                    onChange = {(e: any) => setPassword(e.target.value)}
                    />

                    {/** Only display the extra fields for tutors */}
                    {role === "student" ? (
                    <>
                    </>
                    ) : (
                    <>
 
                    <Select 
                    onChange={setSelectedSubjects}
                    options={getSubjectOptions()}
                    primaryColor={""}
                    isMultiple={true}
                    isSearchable={true} 
                    value={chosenSubjects} 
                    classNames={{
                        tagItemText: "text-sm m-1",
                    }}           
                    />

                    <label htmlFor="time" className="flex justify-center text-xs" >price for lesson</label>
                    <div className="input-group">
                        <input 
                        placeholder="min"  
                        name="min"
                        id="time"
                        type="number"
                        required
                        className="w-1/2 mr-0" 
                        onChange = {
                            (e: any) => {
                                try {
                                    setMinutes(e.target.value)
                                } catch (e) {
                                    alert("minutes must be a number")
                                }
                            }
                        }
                        />

                        <input 
                        placeholder="eur"  
                        name="eur"
                        type="number"
                        required
                        className="w-1/2 ml-0" 
                        onChange = {
                            (e: any) => {
                                try {
                                    setPrice(e.target.value)
                                } catch (e) {
                                    alert("price must be a number")
                                }
                            }
                        }
                        />
                    </div>
                    </>
                    )}

                    <div className="flex justify-center p-3">
                        <input 
                        type="checkbox" 
                        id="check" 
                        value="check"
                        className="checkbox-xs" 
                        onChange={(e: any) => setCheck(e)}
                        required
                        />

                        {/** TODO: link Terms to ToS */}
                        <label htmlFor="check" className="text-xs">Agree to our <Link href="/">Terms</Link></label>
                    </div>

                    <div className="flex justify-center">
                        <button 
                        type="submit" 
                        className="btn w-1/2 bg-orange-600" 
                        >Sign up</button>
                    </div>

                </form>

                <div className="flex justify-center m-3">
                    <Link href={"/login"}>Log in</Link>
                </div>
            </div>
        </>    
    );
}
