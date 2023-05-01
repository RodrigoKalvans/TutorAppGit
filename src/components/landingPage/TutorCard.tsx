import {EmailIcon, MathIcon} from "@/utils/icons";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Button from "../Button";
import TrendingTutorReview from "./TrendingTutorReview";

/**
 * @param {any} tutor
 * @param {string} styles
 * @return {JSX}
 */
export default function TutorCard({tutor, subjects, reviews, reviewers}: {tutor: any, subjects: Array<any>, reviews:Array<any>, reviewers: Array<any>}) {
  const subject = subjects.find((s: any) => s._id === tutor.subjects.at(0));

  return (
    <div className="carousel-item relative overflow-">
      <div className="bg-blue-920 w-[700px] h-[680px] text-white rounded-3xl flex">
        <div className="w-1/2 h-[680px] flex flex-col justify-center gap-6">
          <ProfilePicture user={tutor} rounded={false} style="rounded-b-[3.5rem] rounded-tl-3xl -mt-[3rem]" />
          <div className="flex justify-around mx-10 -mt-3 text-[14px] text-gray-400">
            <div>Followers: {tutor.followers.length}</div>
            <div>Following: {tutor.following.length}</div>
          </div>
          <div className="flex items-center justify-center gap-5 text-[25px] text-gray-100">
            <MathIcon width={30} className="text-[50px] h-full" color="#F97316" key={subject._id}/>
            {subject.name}
          </div>
          <div className="flex justify-center gap-3 text-[16px]">
            <EmailIcon fill="#F97316" className="text-[30px]"/>
            {tutor.email}
          </div>
          <div className="flex justify-center">
            <Button style="btn btn-primary bg-orange-600 hover:bg-orange-700" link={`/tutors/${tutor._id}`}>
              View Profile
            </Button>
          </div>
        </div>
        <div className="w-1/2 h-[680px] relative">
          <div className="flex flex-col gap-y-2 justify-center items-center px-8 bg-blue-910 h-[24rem] rounded-bl-[7.5rem] rounded-tr-3xl shadow-2xl">
            <b className="text-[28px]">{tutor.firstName + " " + tutor.lastName}</b>
            <b className="text-gray-300 text-[18px] h-10">{tutor.location}</b>
            <p className="text-gray-300 text-[16px] h-48 overflow-hidden">{tutor.description}</p>
          </div>
          {
            // TODO: pass the correct review and reviewer
          }
          <div className="w-full flex flex-col gap-3 pt-5">
            <div className=""><TrendingTutorReview review={reviews.at(0)} reviewer={reviewers.at(0)}/></div>
            <div className=""><TrendingTutorReview review={reviews.at(1)} reviewer={reviewers.at(1)}/></div>
          </div>
        </div>
        <div className="absolute -bottom-2 right-0 h-24 w-1/2 bg-gradient-to-t from-blue-920 to-transparent backdrop-blur-xs"></div>
      </div>
    </div>
  );
}
