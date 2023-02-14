import Head from "next/head";
import SignupBox from "@/components/signup/SignupBox";

export async function getStaticProps() {
    // const res = await fetch("", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     }
    // });
    // const subjects = res.json();

    const subjects: {_id: string, name: string, tutors: string[], icon: any}[] = [];

    // plc test
    const plc1 = {
        _id: "0", 
        name: "Mathematics",
        tutors: ["lena", "nadezda"],
        icon: 0
    };
    const plc2 = {
        _id: "1", 
        name: "History",
        tutors: ["bob", "rob"],
        icon: 5
    };
    const plc3 = {
        _id: "2", 
        name: "Biology",
        tutors: ["bob", "rob"],
        icon: 5
    };
    const plc4 = {
        _id: "3", 
        name: "Physics",
        tutors: ["bob", "rob"],
        icon: 5
    };
    subjects.push(plc1);
    subjects.push(plc2);
    subjects.push(plc3);
    subjects.push(plc4);

    return {
        props: {
            subjects
        }
    }
}

export default function SignupPage({subjects}:{ subjects: any }) {
    
    return (
        <>
        <Head>
            <title>TCorvus | Sign up</title>
        </Head>

        <main className=" w-full h-screen flex-col justify-center">
            <div className="font-bold flex justify-center p-5">
                TCorvus
            </div>

            <div className=" flex justify-center">
                <SignupBox props={subjects}/>
            </div>

        </main>
        </>
    )
}
