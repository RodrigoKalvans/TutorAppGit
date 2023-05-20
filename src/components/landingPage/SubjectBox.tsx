import Link from "next/link";
import Icon from "../Icon";

/**
 * This component is used on the landing page to show available subjects on the platform
 * @param {any} subject
 * @return {JSX}
 */
export default function SubjectBox({subject}: {subject: any}) {
  return (
    <Link href={`/search?role=tutor&subjects=${subject._id}`} className="rounded-2xl w-40 lg:w-80 p-4 py-6 flex flex-col lg:flex-row
      items-center hover:bg-gray-50 hov focus:bg-gray-50 last:hidden md:last:flex">
      <div className="lg:h-full lg:w-2/5"><Icon subject={subject} style="w-[60px] md:w-[80px] lg:w-[100px] h-auto text-gray-600" key={subject._id} /></div>
      <div className="flex flex-col h-full lg:pl-5 pt-3 w-auto text-center lg:text-left ">
        <div className="text-xl p-1 -mt-1">{subject.name}</div>
        <div className="text-sm p-1">{subject.tutors.length} tutors</div>
      </div>
    </Link>
  );
}
