import {useState} from "react";
import BoxContainer from "./helpingComponents/BoxContainer";
import FollowersSection from "./helpingComponents/FollowersSection";
import ProfilePicture from "./helpingComponents/ProfilePicture";
import Rating from "./helpingComponents/Rating";

const ProfileSection = ({user, isFollowing, subjects}: {user: any, isFollowing: boolean, subjects: Array<any>}) => {
  const [followers, setFollowers] = useState(user.followers.length);
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  user.location = "Deventer, Overijssel, Netherlands";
  user.languages = ["English", "Chinese"];

  return (
    <BoxContainer>
      <div className="flex justify-between">
        <div className="w-9/20">
          <ProfilePicture/>


        </div>
        <div className="w-9/20">
          <h1 className="text-3xl font-medium">{user.firstName} {user.lastName}</h1>
          <p className="m-0 text-xl text-subtitle capitalize">{user.role}</p>
          {user.location && (
            <p className="mx-0 text-xs font-light">{user.location}</p>
          )}

          <Rating rating={user.rating} />

          <div className="mt-2">
            <FollowersSection followersNumber={followers} followingNumber={user.following.length}
              userId={user._id} role={user.role} setFollowers={setFollowers} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-2">
        <div>
          <h2>Subjects</h2>
          {subjects.map((subject) =>
            <p key={subject._id}>{subject.name}</p>,
          )}
        </div>
        <div>
          <h2>Languages</h2>
          {user.languages.map((language: string) =>
            <p>{language}</p>,
          )}
        </div>
        <div>
          <h2>Subjects</h2>
          {subjects.map((subject) =>
            <p key={subject._id}>{subject.name}</p>,
          )}
        </div>
        <div>
          <h2>Subjects</h2>
          {subjects.map((subject) =>
            <p key={subject._id}>{subject.name}</p>,
          )}
        </div>
      </div>

    </BoxContainer>
  );
};

export default ProfileSection;
