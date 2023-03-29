import {MathIcon} from "@/utils/icons";

// TODO: type check and optional props

export default function SubjectBox({img = "image", subject}: { img?: string, subject?: any }) {
  subject = {
    name: "placeholder",
    _id: 0,
  };

  const plc: number = 1000;

  return (
    <div className="rounded-5xl w-1/4 min-w-fit p-4 py-6 m-10 inline-flex hover:bg-gray-50 hov">
      <div className=" h-full w-2/5"><MathIcon size={25} color="#F97316" key={subject._id}/></div>
      <div className="flex-col h-full pl-5 w-auto">
        <div className="text-xl p-1">{subject.name}</div>
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
