import Link from "next/link";
import BoxContainer from "./helpingComponents/BoxContainer";
import {useState} from "react";

const Activity = ({fullName, activity: activityArray}: {fullName: string, activity: Array<any>}) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <BoxContainer>
      <div>
        <div className="pb-2 border-b-2 text-xl font-medium">
          Activity
        </div>

        <div className="overflow-y-auto max-h-[75vh]">
          {!activityArray.at(0) && (
            <div>
              <p className="text-base">{fullName} does not have activities</p>
            </div>
          )}
          {activityArray.at(0) && !showAll && (
            <div>
              <p className="text-base">{fullName} { activityArray[0].action}</p>
              { activityArray.at(0).activityType !== "like" && (
                <Link href={`/${activityArray.at(0).targetUser.role}s/${activityArray.at(0).targetUser.id}`}>
                  <p className="italic text-base" >&quot;{ activityArray.at(0).activity.text}&quot;</p>
                </Link>
              )}
            </div>
          )}
          {showAll && (
            <>
              {activityArray.map((element: any) => (
                <Link href={`/${element.targetUser.role}s/${element.targetUser.id}`} key={element.activity._id}>
                  <div className="bg-container bg-opacity-70 rounded-lg p-4 my-2 hover:bg-opacity-100 transition-all">
                    <p className="text-base">{fullName} {element.action}</p>
                    {element.activityType !== "like" && (
                      <p className="italic text-base" >&quot;{element.activity.text}&quot;</p>
                    )}
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>

        {activityArray.at(1) && (
          <>
            <hr className="w-full" />
            <button type="button" onClick={() => setShowAll(!showAll)} className="text-base mx-3 mt-3">
              Show all activity
            </button>
          </>
        )}
      </div>
    </BoxContainer>
  );
};

export default Activity;
