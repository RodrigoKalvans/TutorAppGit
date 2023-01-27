import { NextResponse } from "next/server";

// TODO: Need to format number of tutors

export default function SubjectBox({ img = "", subject = "placeholder" }: { img: string, subject: string }) {
    // get number of tutors with subject
    //const num: number = await FetchData( subject );

    const plc: number = 1000

    // let txt: string = subject.toLowerCase();
    // txt = txt.charAt(0).toUpperCase() + txt.slice(1);
    

    return (
        <div className="bord rounded-md min-w-1/5 w-80 p-4 m-10 inline-flex hover:bg-white-800 hover:shadow">
            <div className="bord h-full w-2/5">
                image
            </div>
            <div className="flex-col h-full pl-5 w-auto">
                <div className="text-xl">
                    {subject}
                </div>
                <br />
                <div className="text-sm">
                    {plc} tutors
                </div>
            </div>
        </div>
    );
}

// async function FetchData(subject: string) {
//     const res: NextResponse = await fetch("", {
//         'subject': subject,
//     });
//     const data: JSON = await res.json();

//     return 1;
// }