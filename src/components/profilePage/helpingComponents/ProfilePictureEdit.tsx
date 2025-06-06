import {ChangeEvent, MouseEventHandler, useState} from "react";
import Image from "next/image";
import {Session} from "next-auth";
import {AiOutlineClose} from "react-icons/ai";
import {useSession} from "next-auth/react";

const IMAGE_SIZE_LIMIT = 4000000; // 4 MB

const ProfilePictureEdit = ({
  imageSrc,
  closeModal,
} : {
  imageSrc?: string,
  session: Session,
  closeModal: MouseEventHandler
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(imageSrc);
  const [chosenFile, setChosenFile] = useState<File>();
  const {data: session, update} = useSession();
  const [error, setError] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file: File) => {
    // Create a FormData object to send the file to the API endpoint
    const formData = new FormData();
    formData.append("image", file);

    // Make a POST request to the API endpoint to upload the file
    const response = await fetch(`/api/tutors/${session!.user.id}/picture`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();

    if (response.ok) {
      const {user} = json;
      return {
        pictureKey: user.picture,
      };
    } else {
      const {error} = json;
      return {error};
    }
  };

  const handleUploadClick = async () => {
    if (!chosenFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsLoading(true);

    const result = await uploadImage(chosenFile);

    if (result.pictureKey) {
      await update({picture: result.pictureKey});
      window.location.reload();
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg px-6 py-6 w-full mx-3 md:w-1/2">
        <div className="flex justify-between pb-3 border-b-2">
          <h1 className="text-xl">Edit your profile picture</h1>
          <button onClick={closeModal}>
            <AiOutlineClose color="#505050" />
          </button>
        </div>
        <div className="flex flex-col py-3">
          {error && (
            <p className="text-red-900">{error}</p>
          )}
          {previewImageUrl && (
            <div className="avatar self-center mb-3">
              <div className="w-48 rounded-full">
                <Image src={previewImageUrl} alt="profile picture" width={200} height={200} />
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <label className="capitalize font-normal text-lg text-current mb-3">Upload image</label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  if (file.size > IMAGE_SIZE_LIMIT) {
                    // error.current = "File is too large (limit is 4 MB)";
                    setError("File is too large (limit is 4 MB)");
                    return;
                  }

                  setError(null);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImageUrl(reader.result as string);
                    setChosenFile(file);
                  };
                  reader.readAsDataURL(file);
                }
              }} />
          </div>
        </div>
        <div className="border-t-2">
          <button
            className="btn btn-primary rounded-4xl btn-sm mt-3"
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureEdit;
