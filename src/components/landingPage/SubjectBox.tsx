import Icon from "../Icon";

/**
 * This component is used on the landing page to show available subjects on the platform
 * @param {any} subject
 * @return {JSX}
 */
export default function SubjectBox({subject}: {subject: any}) {
  return (
    <div className="rounded-2xl w-40 lg:w-80 p-4 py-6 flex flex-col lg:flex-row
      items-center hover:bg-gray-50 hov focus:bg-gray-50 last:hidden md:last:flex">
      <div className="lg:h-full lg:w-2/5"><Icon subject={subject} style={"text-[60px] md:text-[80px] lg:text-[100px] h-full text-gray-700"} key={subject._id} /></div>
      <div className="flex flex-col h-full lg:pl-5 pt-3 w-auto text-center lg:text-left">
        <div className="text-xl p-1">{subject.name}</div>
        <div className="text-sm p-1">{subject.tutors.length} tutors</div>
      </div>
    </div>
  );
}
