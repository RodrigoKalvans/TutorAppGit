// import {NextResponse} from "next/server";


// TODO: type check and optional props

export default function SubjectBox({img = "image", subject = "placeholder"}: { img?: string, subject?: string }) {
  // get number of tutors with subject
  // const num: number = await FetchData( subject );

  const plc: number = 1000;

  return (
    <div className="rounded-md w-1/4 min-w-fit p-4 py-6 m-10 inline-flex hover:bg-gray-50 hover:shadow-xl">
      <div className=" h-full w-2/5">img</div>
      <div className="flex-col h-full pl-5 w-auto">
        <div className="text-xl p-1">{subject}</div>
        <div className="text-sm p-1">{plc} tutors</div>
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
