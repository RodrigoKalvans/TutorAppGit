import {useState} from "react";
import BoxContainer from "./helpingComponents/BoxContainer";
import FollowersSection from "./helpingComponents/FollowersSection";
import ProfilePicture from "./helpingComponents/ProfilePicture";
import Rating from "./helpingComponents/Rating";
import Price from "./helpingComponents/Price";
import ContactDetails from "./helpingComponents/ContactDetails";
import Languages from "./helpingComponents/Languages";
import Subjects from "./helpingComponents/Subjects";
import {Session} from "next-auth";
import {EditIcon, PromoIcon} from "@/utils/icons";
import EditProfileModal from "./EditProfileModal";
import {isPromoted} from "@/utils/promotion";

const ProfileSection = ({user, isFollowing, subjects, session, allSubjects}: {user: any, isFollowing: boolean, subjects: Array<any>, session: Session | null, allSubjects: Array<any>}) => {
  const [followers, setFollowers] = useState(user.followers.length);
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  const canEdit = (session?.user.id === user._id) ? true : false;
  const [isEditing, setIsEditing] = useState(false);

  const closeModal = () => {
    setIsEditing(false);
  };

  return (
    <BoxContainer>
      <div className="flex justify-between">
        <div className="w-9/20">
          <ProfilePicture user={user} session={session} />
        </div>
        <div className="w-9/20">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium flex items-center">{user.firstName} {user.lastName}
              {isPromoted(user.donations) && <PromoIcon size={15} className="mx-2" fill="orange"></PromoIcon>}
            </h1>
            {canEdit && (
              <>
                <button
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <EditIcon size={20} color="#505050"></EditIcon>
                </button>
                {isEditing && (
                  <div className="absolute">
                    <EditProfileModal closeModal={closeModal} allSubjects={allSubjects} user={user} session={session} userSubjects={subjects} />
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-xl text-subtitle capitalize">{user.role}</p>
          {user.location && (
            <p className="text-xs font-light">{user.location}</p>
          )}
          {user.isOnlineAvailable && (
            <p className="text-xs font-light text-green-600">Online lessons available</p>
          )}

          <Rating rating={user.rating} />

          <div className="mt-2">
            <FollowersSection followersNumber={followers} followingNumber={user.following.length}
              userId={user._id} role={user.role} setFollowers={setFollowers} isFollowed={isFollowed} setIsFollowed={setIsFollowed} session={session} />
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

      {user.description && (
        <div>
          <h2 className="text-xl font-medium pb-2">About</h2>
          <p className="m-0 text-base">{user.description}</p>
        </div>
      )}

    </BoxContainer>
  );
};

export default ProfileSection;
