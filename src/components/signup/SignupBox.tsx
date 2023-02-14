import Link from "next/link";
import Select from "react-tailwindcss-select";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignupBox({props}: {props: any}) {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [minutes, setMinutes] = useState("");
    const [price, setPrice] = useState("");

    // tutors' subjects
    const [chosenSubjects, setSubjects] = useState();
    
    // agree to terms
    const [check, setCheck] = useState();

    // change roll on button clicks
    const [role, setRole] = useState("student");
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
        if (!check || !firstName || !lastName || !email || !password) {
            console.log('fail')
            return;
        }

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

        if (role === "tutor") {
            const temp = new Map();
            temp.set(minutes, price)

            const map = {};
            temp.forEach((val: string, key: string) => {
                map[key] = val;
              });

            user.priceForLessons = map;
            console.log(user.priceForLessons)
        }        

        const res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await res.json();

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

        // if user is a tutor, send patch request to update subjects and prices
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
    };

    return (
        <>
            <div className="rounded-md w-1/4 min-h-2/5 ring-black m-5 bg-orange-100 shadow-2xl">
                <div className="btn-group w-full">
                    <button onClick={setStudent} className="btn w-1/2 bg-orange-600 hover:bg-orange-500" >Student</button>
                    <button onClick={setTutor} className="btn w-1/2 bg-orange-600 hover:bg-orange-500">Tutor</button>
                </div>

                <form onSubmit={(e) => submitUser(e)} className="form-control m-5 flex-col justify-center">
                    <input 
                    placeholder="First name" 
                    name="firstName"
                    id="firstName"
                    required
                    className="" 
                    onChange = {(e) => setFirstName(e.target.value)}
                    />

                    <input 
                    placeholder="Last name"  
                    name="lastName"
                    id="lastName"
                    required
                    className="" 
                    onChange = {(e) => setLastName(e.target.value)}
                    />

                    <input 
                    placeholder="Email"  
                    name="email"
                    id="email"
                    required
                    className="" 
                    onChange = {(e) => setEmail(e.target.value)}
                    />

                    <input 
                    placeholder="Password"  
                    name="password"
                    id="password"
                    type="password"
                    required
                    className="" 
                    onChange = {(e) => setPassword(e.target.value)}
                    />

                    {/** Only display the extra field for tutors */}
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
                            (e) => {
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
                            (e) => {
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
                        onChange={(e) => setCheck(e)}
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
