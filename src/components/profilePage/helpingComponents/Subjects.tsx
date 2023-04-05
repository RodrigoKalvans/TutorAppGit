import {MathIcon} from "@/utils/icons";

const Subjects = ({subjects, size = "text-xl"}: {subjects: Array<any>, size?: string}) => {
  return (
    <div>
      <h2 className={`${size} font-medium pb-2`}>Subjects</h2>
      {subjects && subjects.map((subject, index) =>
        <div key={index} className="flex gap-2 items-center">
          <MathIcon size={25} color="#F97316" />
          <p className="m-0 text-base" key={subject._id}>{subject.name}</p>
        </div>,
      )}
    </div>
  );
};

export default Subjects;
