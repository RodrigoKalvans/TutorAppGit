import {Session} from "next-auth";
import {useEffect, useState} from "react";
import Image from "next/image";
import ProfilePictureEdit from "@/components/profilePage/helpingComponents/ProfilePictureEdit";

const ProfilePicture = ({session, user}: {session?: Session | null, user: any}) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePictureClick = async () => {
    if (!session || session.user.id !== user._id.toString()) return;

    setModalOpen(true);
  };

  useEffect(() => {
    const getImageFromApi = async (userId: string, fileKey: string) => {
      try {
        const response = await fetch(`/api/${user.role}s/${userId}/picture?key=${fileKey}`);
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error retrieving image from API:", error);
      }
    };
    if (user.picture) getImageFromApi(user._id.toString(), user.picture);
  }, [user]);

  return (
    <>
      {imageSrc ? (
        <div
          className={`avatar w-full aspect-square ${(session?.user.id === user._id.toString()) ? "cursor-pointer": ""}`}
          onClick={handlePictureClick}
        >
          <div className="rounded-full w-full">
            <Image src={imageSrc} alt="profile picture" width={96} height={96} priority />
          </div>
        </div>
      ) : (
        <div
          className={`avatar placeholder w-full aspect-square ${(session?.user.id === user._id.toString()) ? "cursor-pointer": ""}`}
          onClick={handlePictureClick}
        >
          <div className="bg-neutral-focus text-neutral-content rounded-full w-full">
            <span className="text-3xl">K</span>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProfilePictureEdit session={session!} imageSrc={imageSrc} closeModal={closeModal} />
      )}
    </>
  );
};

export default ProfilePicture;
