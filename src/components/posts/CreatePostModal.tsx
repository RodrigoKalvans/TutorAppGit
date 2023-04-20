import React, {ChangeEvent, MouseEventHandler, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import Image from "next/image";

const MAX_COUNT = 3;

const CreatePostModal = ({closeModal}: {closeModal: MouseEventHandler}) => {
  const [fileLimit, setFileLimit] = useState(false);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [chosenFiles, setChosenFiles] = useState<File[]>([]);

  const uploadImages = async (files: File[], postId: string) => {
    // Create a FormData object to send the file to the API endpoint
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      formData.append("images", file!);
    }

    // Make a POST request to the API endpoint to upload the file
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/image`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      console.log(json);
      alert("ERROR");
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
        if (alreadyChosen.length === MAX_COUNT) setFileLimit(true);
        if (alreadyChosen.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
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
    const post: {
      description: string,
      images?: string[],
    } = {
      description: e.target.description.value,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      if (response.ok) {
        // Add images if chosen
        if (chosenFiles) {
          try {
            const resData = await uploadImages(chosenFiles, json.post._id);
            console.log("Image uploaded:", resData);
          } catch (err) {
            console.error(err);
            alert("Error uploading file");
          }
        }
        window.location.reload();
      } else {
        console.log(json);
        alert("An error ocurred during post creation! See console for more information.");
      }
    } catch (error) {
      console.log(error);
      alert("ERROR");
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col py-3">
            {previewImageUrls && (
              <div className="flex gap-2">
                {previewImageUrls.map((url: string) => (
                  <div className="w-48">
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
              <input type="text" id="description" className="w-full border h-8"/>
            </div>
          </div>
          <div className="border-t-2">
            <button
              type="submit"
              className="btn btn-primary rounded-4xl btn-sm mt-3"
            >
                Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
