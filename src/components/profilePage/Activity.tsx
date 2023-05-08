import BoxContainer from "./helpingComponents/BoxContainer";

const Activity = ({fullName, activity: activityArray}: {fullName: string, activity: any[]}) => {
  return (
    <BoxContainer>
      <div>
        <div className="pb-2 border-b-2 text-xl font-medium">
          Activity
        </div>

        {activityArray.at(0) ? (
          <div>
            <p className="text-base">{fullName} { activityArray[0].action}</p>
            { activityArray.at(0).activityType !== "like" && (
              <p className="italic text-base" >&quot;{ activityArray.at(0).activity.text}&quot;</p>
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
