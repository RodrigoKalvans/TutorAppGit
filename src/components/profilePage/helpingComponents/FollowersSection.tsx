import {Session} from "next-auth";
import FollowButton from "./FollowButton";

const FollowersSection = ({followersNumber, followingNumber, userId, role, setFollowers, isFollowed, setIsFollowed, session}: {followersNumber: number, followingNumber: number, userId: string, role: string, setFollowers: Function, isFollowed: boolean, setIsFollowed: Function, session: Session | null}) => {
  return (
    <div className="space-y-2 md:space-y-4">
      <div className="flex gap-2 md:gap-5 text-xs font-light">
        <span className="">Followers: {followersNumber}</span>
        <span>Following: {followingNumber}</span>
      </div>

      {(session && session.user.id.toString() !== userId) && (
        <FollowButton id={userId} role={role} followers={followersNumber} setFollowers={setFollowers} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
      )}
    </div>
  );
};

export default FollowersSection;
