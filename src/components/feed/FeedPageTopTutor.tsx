import Link from "next/link";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import Rating from "../profilePage/helpingComponents/Rating";
import useSWR from "swr";

const FeedPageTopTutor = ({tutor}: any) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: subject} = useSWR(tutor.subjects.length > 0 ?
    `/api/subjects/${tutor.subjects[0]}` :
    null, fetcher);

  return (
    <Link href={`/tutors/${tutor._id}`}>
      <div className={"rounded-full py-3 max-w-full min-w-40 my-4 h-20 flex items-center gap-3 hov shadow-round"}>
        <div className="ml-2 w-1/5">
          <ProfilePicture user={tutor} key={tutor._id}/>
        </div>
        <div className="flex-col w-4/5 pr-3">
          <div className="my-1 h-1/2 flex justify-between overflow-hidden">
            <div className="max-w-1/2">{tutor.firstName + " " + tutor.lastName}</div>
            {subject &&
              <div className="">{subject.name}</div>
            }
          </div>
          <div className="my-1 h-1/2 flex justify-between overflow-hidden">
            <div className="text-xs">{tutor.location}</div>
            <div className="w-1/4 pr-1"><Rating rating={tutor.rating}/></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedPageTopTutor;
