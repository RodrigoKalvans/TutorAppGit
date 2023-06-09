import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Icon from "@/components/Icon";
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
    <Link href={`/${user.role}s/${user._id}`}>
      {user && (
        <div className="w-full min-w-40 h-30 bg-white rounded-2xl shadow flex gap-2 overflow-hidden px-2 md:px-4 py-2 hov">
          {/** profile image */}
          <div className="w-[6.5rem] h-[6.5rem]">
            <ProfilePicture user={user} />
          </div>

          {/** name and such */}
          <div className="flex flex-col">
            <div className="flex-col space-between">
              {/** name */}
              <div className="text-lg md:text-xl flex items-center">
                {user.firstName + " " + user.lastName}
                {isPromoted(user.donations) && <PromoIcon size={15} className="mx-2" fill="orange"></PromoIcon>}
              </div>
              {/** tutor or student */}
              <div className="font-light text-sm md:text-base capitalize">
                {user.role}
              </div>
              {/** rating */}
              <div className="w-24">
                <Rating rating={user.rating}/>
              </div>
              {/** location */}
              <div className="font-light md:font-normal text-xs">
                {user.location}
              </div>
              {/** followers */}
              <div className="text-[10px] md:text-xs">
                {user.followers.length} followers
              </div>
            </div>
          </div>

          {/* Languages and Subjects */}
          <div className="ml-auto sm:flex w-1/3 gap-4">
            <div className="hidden sm:block lg:hidden xl:block w-1/2">
              {user.languages.at(0) &&
                <>
                  <p className="text-sm md:text-lg">Languages</p>
                  {user.languages && user.languages.map((language: any) =>
                    <div key={language.code} className="flex">
                      <p className="text-xs md:text-base font-light">{language.name}</p>
                    </div>,
                  )}
                </>
              }
            </div>
            {subjects.at(0) &&
              <div>
                <p className="text-sm md:text-lg">Subjects</p>
                {subjects.map((subject, index) =>
                  <div key={index} className="flex gap-1 md:gap-2 items-center">
                    <Icon subject={subject} style="text-orange-600 w-[1.5rem]" />
                    <p className="text-xs md:text-base font-light" key={subject._id}>{subject.name}</p>
                  </div>,
                )}
              </div>
            }
          </div>
        </div>
      )}
    </Link>

  );
}
