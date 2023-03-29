import {MathIcon} from "@/utils/icons";

// TODO: type check and optional props

/**
 * subject on landing page
 * @param {any} subject
 * @return {JSX}
 */
export default function SubjectBox({img = "image", subject}: { img?: string, subject: any }) {
  // TODO: get number of tutors that teach this subject
  const plc: number = 1000;

  return (
    <div className="rounded-2xl w-1/4 min-w-fit p-4 py-6 m-10 inline-flex hover:bg-gray-50 hov">
      <div className=" h-full w-2/5"><MathIcon size={100} color="#F97316" key={subject._id}/></div>
      <div className="flex-col h-full pl-5 w-auto">
        <div className="text-xl p-1">{subject.name}</div>
        <div className="text-sm p-1">{plc} tutors</div>
      </div>
    </div>
  );
}
