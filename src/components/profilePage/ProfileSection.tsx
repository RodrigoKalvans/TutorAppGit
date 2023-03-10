import {useState} from "react";
import BoxContainer from "./helpingComponents/BoxContainer";
import FollowersSection from "./helpingComponents/FollowersSection";
import ProfilePicture from "./helpingComponents/ProfilePicture";
import Rating from "./helpingComponents/Rating";
import Price from "./helpingComponents/Price";
import ContactDetails from "./helpingComponents/ContactDetails";
import Languages from "./helpingComponents/Languages";
import Subjects from "./helpingComponents/Subjects";

const ProfileSection = ({user, isFollowing, subjects}: {user: any, isFollowing: boolean, subjects: Array<any>}) => {
  const [followers, setFollowers] = useState(user.followers.length);
  const [isFollowed, setIsFollowed] = useState(isFollowing);

  return (
    <BoxContainer style={""}>
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

      <div className="grid grid-cols-2 gap-8 my-8">
        <Subjects subjects={subjects} />

        <Languages languages={user.languages} />

        {user.role === "tutor" && (
          <>
            <ContactDetails email={user.email} phoneNumber={user.phoneNumber} />

            <Price priceForLessons={user.priceForLessons} />
          </>
        )}

      </div>

      <div>
        <h2 className="text-xl font-medium pb-2">About</h2>
        <p className="m-0 text-base">{user.description}</p>
      </div>

    </BoxContainer>
  );
};

export default ProfileSection;
