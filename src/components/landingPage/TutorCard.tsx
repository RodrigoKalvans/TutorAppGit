import {EmailIcon} from "@/utils/icons";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import TrendingTutorReview from "./TrendingTutorReview";
import Icon from "../Icon";
import Link from "next/link";
// import {LandingPageCard} from "@/types/ambiguous-types"; // card: LandingPageCard

/**
 * This component is used on the landing page to display featured tutors
 * @param {any} card.tutor
 * @param {string} styles
 * @return {JSX}
 */
export default function TutorCard({card, subjects}: {card: any, subjects: Array<any>}) {
  const subject = subjects.find((s: any) => s._id === card.tutor.subjects.at(0));

  return (
    <div className="relative flex justify-center w-[740] px-[20px]">
      <div className="bg-blue-920 w-[300] md:w-[600px] h-[450px] md:h-[600px] text-white rounded-3xl flex">
        <div className="w-full md:w-1/2 h-[680px] flex flex-col gap-2 md:gap-6">
          <div className="max-w-[240px] md:max-w-full top-0">
            <ProfilePicture user={card.tutor} rounded={false} style="rounded-b-[3.5rem] rounded-t-3xl md:rounded-tr-none" />
          </div>
          <b className="flex md:hidden justify-center items-center">
            {`${card.tutor.firstName} ${card.tutor.lastName}`}
          </b>
          <div className="flex justify-around mx-4 md:mx-10 md:-mt-4 text-[12px] md:text-[14px] text-gray-400">
            <div>Followers: {card.tutor.followers.length}</div>
            <div>Following: {card.tutor.following.length}</div>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-5 text-[18px] md:text-[25px] text-gray-100 capitalize">
            <Icon subject={subject} style="text-[35px] md:text-[50px] h-full text-orange-600" key={subject._id} />
            {subject.name}
          </div>
          <div className="flex justify-center items-center gap-3 text-[12px] md:text-[16px]">
            <EmailIcon fill="#F97316" className="text-[30px]"/>
            {card.tutor.email}
          </div>
          <div className="flex justify-center">
            <Link href={`/tutors/${card.tutor._id}`} className="buttonLink darkOrange">View Profile</Link>
          </div>
        </div>
        <div className="w-1/2 h-[600px] relative hidden md:block">
          <div className="flex flex-col gap-y-2 justify-center items-center px-8 bg-blue-910 h-[330px] rounded-bl-[7.5rem] rounded-tr-3xl shadow-2xl">
            <b className="text-[22px]">{`${card.tutor.firstName} ${card.tutor.lastName}`}</b>
            <b className="text-gray-300 text-[16px] h-10">{card.tutor.location}</b>
            <p className="text-gray-300 text-[14px] h-48 overflow-hidden">{card.tutor.description}</p>
          </div>

          <div className="w-full flex flex-col gap-3 pt-3 pr-[11px] text-clip">
            {card.reviews && card.reviews.map((review: any) => (
              <TrendingTutorReview review={review} key={review.review._id} />
            ))}
          </div>
          <div className="absolute bottom-0 right-0 rounded-br-3xl h-24 w-full bg-gradient-to-t from-blue-920 to-transparent backdrop-blur-xs"></div>
        </div>
      </div>
    </div>
  );
}
