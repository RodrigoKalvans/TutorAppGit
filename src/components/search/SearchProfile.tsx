import {useEffect, useState} from "react";

import Languages from "../profilePage/helpingComponents/Languages";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Subject from "@/models/Subject";
import Subjects from "../profilePage/helpingComponents/Subjects";
import db from "@/utils/db";

/**
 * Card that displays user info on search page
 * @param {{any}}} user object to be displayed in the component
 * @return {any} yo
 */
export default function SearchProfile({user}: {user: any}) {
  const name: string = user.secondName ? `${user.firstName} ${user.secondName} ${user.lastName}` : `${user.firstName} ${user.lastName}`;

  const [subjects, setSubjects] = useState<any>([]);

  // TODO: this needs to be changed when fields in db are renamed
  const subjectsFieldName = user.role == "student" ? user.subjectsStudied : user.subjectsOfSpecialty;

  // TODO: replace with a single get that takes an array of subject ids
  const getSubjects = async () => {
    await db.connect();
    const fetched = async () => await Subject.find({
      _id: {
        // this is for tutors
        $in: subjectsFieldName,
      },
    });
    setSubjects(fetched);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      {/** TODO: add Link to user's profile */}
      <div className="w-full p-2">
        <div className="w-full min-w-40 max-h-40 bg-blue-100 rounded-2xl shadow flex inline-block align-middle p-2">
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
                  {name}
                </div>
                {/** tutor or student */}
                <div className="font-bold">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                {/** rating */}
                <div className="text-xs">
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
                <Languages languages={user.languages} />
              </div>
              {/** subjects */}
              <div className="">
                <Subjects subjects={subjects} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
