import {useSession} from "next-auth/react";
import {useState} from "react";
import CreatePostModal from "./posts/CreatePostModal";

const CreatePostButton = ({style}: {style?: string}) => {
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const {data: session} = useSession();

  const closeModal = () => {
    setOpenCreatePost(false);
  };

  return (
    <>
      {session && (
        <button type="button" onClick={() => setOpenCreatePost(true)} className={style || "btn btn-sm rounded-full capitalize"}>Create Post</button>
      )}

      {openCreatePost && (
        <CreatePostModal closeModal={closeModal} />
      )}
    </>
  );
};

export default CreatePostButton;
