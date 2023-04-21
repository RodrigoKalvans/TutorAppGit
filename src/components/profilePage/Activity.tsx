import React, {useEffect, useState} from "react";
import BoxContainer from "./helpingComponents/BoxContainer";

const Activity = ({fullName, activity}: {fullName: string, activity: any[]}) => {
  const [activityArray, setActivityArray] = useState<any[]>([]);
  const arr: Array<any> = [];
  useEffect(() => {
    const populateActivities = async () => {
      for (let i = activity.length - 1; i >= 0; i--) {
        const element = activity[i];
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${element.activityType}s?_id=${element.activityId}`);
        const json = await res.json();

        let action: string;

        switch (element.activityType) {
          case "comment":
            action = "commented on post";
            break;

          case "like":
            action = "liked post";
            break;

          case "review":
            action = "reviewed a user";
            break;

          default:
            action = "undefined activity";
            break;
        }

        arr.push({activityType: element.activityType, action, ...json.at(0)});
      }
      setActivityArray(arr);
    };

    populateActivities();

    return () => setActivityArray([]);
  }, [activity]);

  return (
    <BoxContainer>
      <div>
        <div className="pb-2 border-b-2 text-xl font-medium">
          Activity
        </div>

        {activityArray[0] ? (
          <div>
            <p className="text-base">{fullName} { activityArray[0].action}</p>
            { activityArray[0].activityType !== "like" && (
              <p className="italic text-base" >"{ activityArray[0].text}"</p>
            )}
            <hr className="w-full" />
            <button className="text-base mx-3 mt-3">Show all activity</button>
          </div>
        ): (
          <div>
            <p className="text-base">{fullName} does not have activities</p>
          </div>
        )}
      </div>
    </BoxContainer>
  );
};

export default Activity;
