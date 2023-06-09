import React, {ChangeEvent, MouseEventHandler, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import Image from "next/image";
import {MAX_POST_DESCRIPTION_LENGTH, MAX_POST_IMAGES_COUNT} from "@/utils/consts";

/**
 * This modal component allows the user to create a post
 * @param {MouseEventHandler} closeModal button interaction
 * @return {JSX}
 */
const CreatePostModal = ({closeModal}: {closeModal: MouseEventHandler}) => {
  const [fileLimit, setFileLimit] = useState<boolean>(false);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [chosenFiles, setChosenFiles] = useState<File[]>([]);
  const [descriptionLengthError, setDescriptionLengthError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<String | null>();

  /**
   * used to make sure description does not exceed allowed limit
   * @param {string} description as entered by the user
   */
  const validateDescriptionLength = (description: string) => {
    if (description.length > MAX_POST_DESCRIPTION_LENGTH) {
      setDescriptionLengthError(true);
    } else {
      setDescriptionLengthError(false);
    }
  };

  const uploadImages = async (files: File[], postId: string) => {
    // Create a FormData object to send the file to the API endpoint
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("images", file!);
    }

    // Make a POST request to the API endpoint to upload the file
    const response = await fetch(`/api/posts/${postId}/image`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      const {error} = json;

      if (error.message) {
        return {error: {message: error.message, error}};
      }

      return {error: {message: "Error occured while uploading images to the post.", error}};
    }
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(e.target.files);

    const lastFile = files[files.length-1];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImageUrls([reader.result as string, ...previewImageUrls]);
    };
    reader.readAsDataURL(lastFile);

    const alreadyChosen = chosenFiles;
    let limitExceeded = false;
    files.some((file) => {
      if (alreadyChosen.findIndex((f) => f.name === file.name) === -1) {
        alreadyChosen.push(file);
        if (alreadyChosen.length === MAX_POST_IMAGES_COUNT) setFileLimit(true);
        if (alreadyChosen.length > MAX_POST_IMAGES_COUNT) {
          alert(`You can only add a maximum of ${MAX_POST_IMAGES_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setChosenFiles(alreadyChosen);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (descriptionLengthError) {
      setError("The description lengths is too big. Max amout of characters allowed is " + MAX_POST_DESCRIPTION_LENGTH);
      return;
    }
    setIsLoading(true);

    const post: {
      description?: string,
      imagesAdded?: boolean,
    } = {
      description: e.target.description.value,
      imagesAdded: chosenFiles.length > 0,
    };

    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.ok) {
      // Add images if chosen
      if (chosenFiles.length > 0) {
        const result = await uploadImages(chosenFiles, json.post._id);

        if (result.error) {
          setError(result.error.message);

          if (!post.description) {
            // Delete empty post
            const res = await fetch(`/api/posts/${json.post._id}`, {
              method: "DELETE",
            });

            if (!res.ok) {
              setError("Error deleteing the post");
            }
          }
          setIsLoading(false);
          return;
        }
      }

      window.location.reload();
    } else {
      setIsLoading(false);
      setError(json.message);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg px-6 py-6 w-full mx-3 md:w-1/2">
        <div className="flex justify-between pb-3 border-b-2">
          <h1 className="text-xl">Create post</h1>
          <button onClick={closeModal}>
            <AiOutlineClose color="#505050" />
          </button>
        </div>
        {error && (
          <p className="text-red-900">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col py-3">
            {previewImageUrls && (
              <div className="flex gap-2">
                {previewImageUrls.map((url: string, index: number) => (
                  <div key={index} className="w-48">
                    <Image src={url} alt="Post picture" width={192} height={192} />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col">
              <label className="text-lg mb-3">Upload image</label>
              <input
                type="file"
                multiple
                accept=".jpg, .jpeg, .png"
                className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  if (event?.target?.files?.[0]) {
                    handleFilesChange(event);
                  }
                }}
                disabled={fileLimit} />
            </div>

            <div>
              <label>Description</label>
              <textarea id="description" className="w-full border h-20" onChange={(e) => validateDescriptionLength(e.target.value)}/>
              {descriptionLengthError ? <div className="text-red-500 text-sm">{MAX_POST_DESCRIPTION_LENGTH} character limit</div> : <></>}
            </div>
          </div>
          <div className="border-t-2">
            <button
              type="submit"
              className="btn btn-primary rounded-4xl btn-sm mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
