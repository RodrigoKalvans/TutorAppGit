// import {NextResponse} from "next/server";


// TODO: type check and optional props

export default function SubjectBox({img = "", subject = "placeholder"}: { img?: string, subject?: string }) {
  // get number of tutors with subject
  // const num: number = await FetchData( subject );

  const plc: number = 1000;

  // let txt: string = subject.toLowerCase();
  // txt = txt.charAt(0).toUpperCase() + txt.slice(1);


  return (
    <div className="bord rounded-md min-w-1/5 w-80 p-4 m-10 inline-flex hover:bg-gray-50 hover:shadow-xl">
      <div className=" h-full w-2/5">
                image
      </div>
      <div className="flex-col h-full pl-5 w-auto">
        <div className="text-xl p-1">
          {subject}
        </div>
        <div className="text-sm p-1">
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
