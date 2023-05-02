import Languages from "../profilePage/helpingComponents/Languages";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Subjects from "../profilePage/helpingComponents/Subjects";
import Link from "next/link";
import Rating from "../profilePage/helpingComponents/Rating";
import {isPromoted} from "@/utils/promotion";
import {PromoIcon} from "@/utils/icons";

// TODO: types
/**
 * Card that displays user info on search page
 * @param {{any}}} user object to be displayed in the component
 * @return {any} yo
 */
export default function SearchProfile({user, allSubjects}: {user: any, allSubjects: Array<any>}) {
  const subjects = allSubjects.filter((subject: any) => user.subjects.includes(subject._id));

  return (
    <>
      {/** TODO: add Link to user's profile */}
      <div className="w-full p-2">
        <Link href={`/${user.role}s/${user._id}`}>
          {user && (
            <div className="w-full min-w-40 h-28 bg-gray-200 rounded-full shadow flex align-middle p-2 hov">
              {/** profile image */}
              <div className="w-24 h-24 flex justify-center align-middle aspect-square">
                <ProfilePicture user={user} />
              </div>

              <div className="flex px-2 w-full -mt-1">
                {/** name and such */}
                <div className="flex-col w-1/2">
                  <div className="flex-col space-between">
                    {/** name */}
                    <div className="text-xl flex items-center">
                      <Link href={`/${user.role}s/${user._id}`}>
                        {user.firstName + " " + user.lastName}
                      </Link>
                      {isPromoted(user.donations) && <PromoIcon size={15} className="mx-2" fill="orange"></PromoIcon>}
                    </div>
                    {/** tutor or student */}
                    <div className="font-light text-base">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                    {/** rating */}
                    <div className="text-xs w-24">
                      {/** TODO: Round to decimal */}
                      <Rating rating={user.rating}/>
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

                <div className="flex justify-around gap-3 w-1/2 text-sm">
                  {/** languages */}
                  <div className="">
                    <Languages languages={user.languages} size="base" />
                  </div>
                  {/** subjects */}
                  <div className="overflow-hidden">
                    <Subjects subjects={subjects} size="base" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Link>
      </div>
    </>
  );
}
