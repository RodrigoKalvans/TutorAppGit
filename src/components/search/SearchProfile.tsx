import {useEffect, useState} from "react";

import Languages from "../profilePage/helpingComponents/Languages";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Subjects from "../profilePage/helpingComponents/Subjects";

// TODO: types
/**
 * Card that displays user info on search page
 * @param {{any}}} user object to be displayed in the component
 * @return {any} yo
 */
export default function SearchProfile({user, subjects}: {user: any, subjects: any}) {
  const fullName: string = user.secondName ? `${user.firstName} ${user.secondName} ${user.lastName}` : `${user.firstName} ${user.lastName}`;

  // TODO: type
  const [userSubjects, setUserSubjects] = useState<Array<{}>>([]);

  // TODO: this needs to be changed when fields in db are renamed
  const subjectsFieldInUserObject: Array<string> = user.role === "student" ? user.subjectsStudied : user.subjectsOfSpecialty;

  // TODO: types
  // TODO: if we use pictures, handle those too
  const filterSubjects: any = () => {
    for (let i: number = 0; i < subjectsFieldInUserObject.length; i++) {
      for (let j: number = 0; j < subjects.length; j++) {
        if (subjectsFieldInUserObject.at(i) == subjects.at(j)._id) {
          setUserSubjects((userSubjects: any) => [...userSubjects, subjects.at(j)]);
        }
      }
    }
  };

  // prep data on mount
  useEffect(() => {
    filterSubjects();
    return () => setUserSubjects([]);
  }, []);

  return (
    <>
      {/** TODO: add Link to user's profile */}
      <div className="w-full p-2">
        {user && (
          <div className="w-full min-w-40 max-h-40 bg-gray-200 rounded-2xl shadow flex inline-block align-middle p-2">
            {/** profile image */}
            <div className="w-1/4 flex justify-center inline-block align-middle">
              {/** TODO: replace with profile image */}
              <ProfilePicture />
            </div>

            <div className="flex p-2 w-3/4">

              {/** name and such */}
              <div className="p-1 flex-col w-1/2">
                <div className="flex-col space-between">
                  {/** name */}
                  <div className="text-xl">
                    {fullName}
                  </div>
                  {/** tutor or student */}
                  <div className="font-bold">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                  {/** rating */}
                  <div className="text-xs">
                    {/** TODO: Round to decimal */}
                    {user.rating.number}/5
                  </div>
                  {/** location */}
                  <div className="text-xs">
                    {user.location}
                  </div>
                  {/** followers */}
                  <div className="text-xs">
                    {user.followers.length} followers
                  </div>
                </div>
              </div>

              <div className="flex justify-around w-1/2 text-lg">
                {/** languages */}
                <div className="">
                  <Languages languages={user.language} />
                </div>
                {/** subjects */}
                <div className="">
                  <Subjects subjects={userSubjects} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
