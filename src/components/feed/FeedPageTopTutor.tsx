import Link from "next/link";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Rating from "../profilePage/helpingComponents/Rating";
import useSWR from "swr";
import { isPromoted } from "@/utils/promotion";
import { PromoIcon } from "@/utils/icons";

const FeedPageTopTutor = ({tutor}: any) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: subject} = useSWR(tutor.subjects.length > 0 ?
    `/api/subjects/${tutor.subjects[0]}` :
    null, fetcher);

  return (
    <Link href={`/tutors/${tutor._id}`}>
      <div className="rounded-full py-3 px-1 max-w-full min-w-40 my-4 h-20 flex items-center gap-3 hov shadow-round">
        <div className=" w-20 h-20 flex items-center">
          <ProfilePicture user={tutor} key={tutor._id}/>
        </div>
        <div className="flex-col w-4/5 pr-3">
          <div className="my-1 h-1/2 flex justify-between overflow-hidden">
            <div className="max-w-1/2 flex items-center">{tutor.firstName + " " + tutor.lastName}
              {isPromoted(tutor.donations) && <PromoIcon size={15} className="ml-1" fill="orange"></PromoIcon>}
            </div>
            {subject &&
              <div className="">{subject.name}</div>
            }
          </div>
          <div className="my-1 h-1/2 flex justify-between overflow-hidden">
            <div className="text-xs">{tutor.location}</div>
            <div className="w-16 pr-1"><Rating rating={tutor.rating}/></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedPageTopTutor;
