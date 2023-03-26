import {MathIcon} from "@/utils/icons";

const Subjects = ({subjects}: {subjects: Array<any>}) => {
  return (
    <div>
      <h2 className="text-xl font-medium pb-2">Subjects</h2>
      {subjects.map((subject) =>
        <div className="flex gap-2 items-center">
          <MathIcon size={25} color="#F97316" key={subject._id}/>
          <p className="m-0 text-base" key={subject._id}>{subject.name}</p>
        </div>,
      )}
    </div>
  );
};

export default Subjects;
