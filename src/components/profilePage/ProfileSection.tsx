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

const ProfileSection = ({user, isFollowing, subjects, session}: {user: any, isFollowing: boolean, subjects: Array<any>, session: Session | null}) => {
  const [followers, setFollowers] = useState(user.followers.length);
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  const canEdit = (session?.user.id === user._id) ? true : false;
  const [isEditing, setIsEditing] = useState(false);

  const closeModal = () => {
    setIsEditing(false);
  };

  return (
    <BoxContainer>
      <div className="flex gap-4 justify-between">
        <div className="flex-1">
          <ProfilePicture user={user} session={session} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-medium flex items-center">{user.firstName} {user.lastName}
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
                    <EditProfileModal closeModal={closeModal} user={user} session={session} userSubjects={subjects} />
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-xl text-subtitle capitalize md:my-2">{user.role}</p>
          {user.location && (
            <p className="text-xs font-light py-1">{user.location}</p>
          )}
          {user.isOnlineAvailable && (
            <p className="text-xs font-light text-green-600 py-1">Online lessons available</p>
          )}

          <div className="my-1 md:my-2">
            <Rating rating={user.rating} />
          </div>

          <div className="sm:mt-2 lg:mt-3">
            <FollowersSection followersNumber={followers} followingNumber={user.following.length}
              userId={user._id} role={user.role} setFollowers={setFollowers} isFollowed={isFollowed} setIsFollowed={setIsFollowed} session={session} />
          </div>

        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8 my-8">
        <Subjects subjects={subjects} size="text-lg md:text-xl" />

        <Languages languages={user.languages} size="text-lg md:text-xl" />

        {user.role === "tutor" && (
          <>
            <div className="col-span-2 md:col-span-1">
              <ContactDetails email={user.email} phoneNumber={user.phoneNumber} />
            </div>

            <div className="col-span-2 md:col-span-1">
              <Price priceForLessons={user.priceForLessons} />
            </div>
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
