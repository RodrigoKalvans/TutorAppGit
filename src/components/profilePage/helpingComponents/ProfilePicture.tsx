import {Session} from "next-auth";
import {useState} from "react";
import useSWR from "swr";
import Image from "next/image";
import ProfilePictureEdit from "@/components/profilePage/helpingComponents/ProfilePictureEdit";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProfilePicture = ({session, user, rounded = true, style = ""}: {session?: Session | null, user: any, rounded?: boolean, style?: string}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const {data} = useSWR(
      (user && user.picture) ? `/api/${user.role}s/${user._id}/picture?key=${user.picture}` : null,
      fetcher,
  );

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePictureClick = async () => {
    if (!session || session.user.id !== user._id.toString()) return;

    setModalOpen(true);
  };

  return (
    <>
      {data && data.presignedUrl ? (
        <div
          className={`avatar w-full aspect-square ${(session?.user.id === user._id.toString()) ? "cursor-pointer": ""}`}
          onClick={handlePictureClick}
        >
          <div className={`${rounded && "rounded-full"} ${style} w-full`}>
            <Image src={data.presignedUrl} unoptimized alt="profile picture" width={600} height={600} priority />
          </div>
        </div>
      ) : (
        <div
          className={`avatar placeholder w-full aspect-square ${(session?.user.id === user._id.toString()) ? "cursor-pointer": ""}`}
          onClick={handlePictureClick}
        >
          <div className="bg-neutral-focus text-neutral-content rounded-full w-full">
            <span className="text-2xl">{user.firstName[0]}</span>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProfilePictureEdit session={session!} imageSrc={data ? data.presignedUrl : undefined} closeModal={closeModal} />
      )}
    </>
  );
};

export default ProfilePicture;
