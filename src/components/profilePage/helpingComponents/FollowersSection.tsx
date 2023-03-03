import FollowButton from "./FollowButton";

const FollowersSection = ({followersNumber, followingNumber, userId, role, setFollowers, isFollowed, setIsFollowed}: {followersNumber: number, followingNumber: number, userId: string, role: string, setFollowers: Function, isFollowed: boolean, setIsFollowed: Function}) => {
  return (
    <div className="w-3/4">
      <div className="flex justify-between py-3 text-xs font-light">
        <span className="">Followers: {followersNumber}</span>
        <span>Following: {followingNumber}</span>
      </div>
      <FollowButton id={userId} role={role} followers={followersNumber} setFollowers={setFollowers} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
    </div>
  );
};

export default FollowersSection;
