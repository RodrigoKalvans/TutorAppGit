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
import {EditIcon} from "@/utils/icons";
import EditProfileModal from "./EditProfileModal";
import {ObjectId} from "mongoose";

const ProfileSection = ({user, isFollowing, subjects, session, allSubjects}: {user: any, isFollowing: boolean, subjects: Array<any>, session: Session | null, allSubjects: Array<any>}) => {
  const [followers, setFollowers] = useState(user.followers.length);
  const [isFollowed, setIsFollowed] = useState(isFollowing);
  const canEdit = (session?.user.id === user._id) ? true : false;
  const [isEditing, setIsEditing] = useState(false);

  const closeModal = () => {
    setIsEditing(false);
  };

  return (
    <BoxContainer style={""}>
      <div className="flex justify-between">
        <div className="w-9/20">
          <ProfilePicture user={user} session={session} />
        </div>
        <div className="w-9/20">
          {canEdit ? (
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-medium">{user.firstName} {user.lastName}</h1>
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
            </div>
          ) : (
            <h1 className="text-3xl font-medium">{user.firstName} {user.lastName}</h1>
          )}

          <p className="m-0 text-xl text-subtitle capitalize">{user.role}</p>
          {user.location && (
            <p className="mx-0 text-xs font-light">{user.location}</p>
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

        <Languages languages={user.languages.map((languageObj: {code: string, name: string, _id: ObjectId}) => languageObj.name)} />

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
