import React from "react";
import BoxContainer from "./helpingComponents/BoxContainer";

const Activity = ({fullName, activity}: {fullName: string, activity: any}) => {
  const activityArray: Array<any> = [];

  activity.forEach(async (obj: {activityId: string, activityType: string}) => {
    const res = await fetch(`http://localhost:3000/api/${obj.activityType}s/${obj.activityId}`);
    const json = await res.json();

    let action: string;

    switch (obj.activityType) {
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

    activityArray.push({activityType: obj.activityType, action, ...json});
  });

  const firstActivity = activityArray[0];

  const renderActivity = (obj: any) => {
    if (obj) {
      return (
        <div>
          <p className="text-base">{fullName} {firstActivity.action}</p>
          {firstActivity.activityType !== "like" && (
            <p>{firstActivity.text}</p>
          )}
          <hr className="w-full" />
          <button className="text-base mx-3 mt-3">Show all activity</button>
        </div>
      );
    } else {
      return (
        <div>
          <p className="text-base">{fullName} does not have activities</p>
        </div>
      );
    }
  };

  return (
    <BoxContainer style={""}>
      <div>
        <div className="pb-2 border-b-2">
          <h2 className="text-xl font-medium ">Activity</h2>
        </div>

        {renderActivity(firstActivity)}
      </div>
    </BoxContainer>
  );
};

export default Activity;
