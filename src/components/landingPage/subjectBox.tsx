import {MathIcon} from "@/utils/icons";

// TODO: type check and optional props

/**
 * subject on landing page
 * @param {any} subject
 * @return {JSX}
 */
export default function SubjectBox({subject}: {subject: any}) {
  return (
    <div className="rounded-2xl w-80 p-4 py-6 flex hover:bg-gray-50 hov">
      <div className=" h-full w-2/5"><MathIcon size={100} color="#F97316" key={subject._id}/></div>
      <div className="flex flex-col h-full pl-5 pt-3 w-auto">
        <div className="text-xl p-1">{subject.name}</div>
        <div className="text-sm p-1">{subject.tutors.length} tutors</div>
      </div>
    </div>
  );
}
