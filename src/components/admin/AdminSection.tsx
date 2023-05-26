import {DeleteIcon} from "@/utils/icons";

/**
 * This component is used on the admin page to display content in rows
 * @param {string} title
 * @param {Array<string>} fields
 * @param {Array<any>} content
 * @param {Function} deleteFunction
 * @return {JSX}
 */
const AdminSection = ({
  title,
  fields,
  content,
  deleteFunction,
} : {
  title: string,
  fields: Array<string>,
  content: Array<any>,
  deleteFunction: Function,
}) => {
  const generateEntry = (entry: any) => {
    if (Array.isArray(entry)) {
      return <span>
        {entry.map((value) => <div key={value}>{value},</div>)}
      </span>;
    } else {
      return <span>{entry}</span>;
    }
  };
  return (
    <>
      <section>
        <b className="uppercase flex justify-center">{title}</b>
        <div className="w-[10rem] hover:w-[35rem] transition-all duration-500 h-screen
        overflow-scroll my-1 border-t-2 border-dotted border-black">
          {content && content.map((object: any) => (
            <div key={object._id} className="flex items-center border-b-2 border-dashed border-black">
              <div className="bg-red-200">
                <DeleteIcon onClick={() => deleteFunction(object)} key={object._id} className="cursor-pointer mx-3 rounded-full" />
              </div>
              <div key={object._id + "1"} className="flex flex-col my-2">
                {Object.keys(object).map((key: string) => {
                  if (!fields.includes(key)) return;
                  return (
                    <div key={key}>
                      <b>{key}</b>: {generateEntry(object[key])}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AdminSection;
