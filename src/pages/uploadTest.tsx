import ImageComponent from "@/components/ImageComponent";
import Tutor from "@/models/Tutor";
import {GetServerSidePropsContext} from "next";
import {getServerSession, Session} from "next-auth";
import {useSession} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";
import {authOptions} from "./api/auth/[...nextauth]";

const uploadTest = ({tutor}: {tutor: any}) => {
  const {data: session} = useSession();
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(tutor.picture);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const uploadImage = async (file: File) => {
    if (!session) {
      return;
    }

    // Create a FormData object to send the file to the API endpoint
    const formData = new FormData();
    formData.append("image", file);

    // Make a POST request to the API endpoint to upload the file
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors/${session.user.id}/picture`, {
      method: "POST",
      body: formData,
    });
    const json = await response.json();

    if (response.ok) {
      setFileKey(json.user.picture);
      console.log(json);
    } else {
      console.log(json);
    }
  };

  const handleUploadClick = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      const resData = await uploadImage(file);
      console.log("Image uploaded:", resData);

      // Do something with the uploaded image URL, e.g. update user profile
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadClick}>Upload</button>
      </div>
      {!session && (
        <Link href="/auth/signin">Sign in</Link>
      )}
      {(session && fileKey) && (
        <ImageComponent userId={session.user.id} fileKey={fileKey} ></ImageComponent>
      )}
      {(session && !fileKey) && (
        <p>You have not uploaded image yet</p>
      )}
      {/* <div>
        <img src={image} alt="" />
      </div> */}
    </div>
  );
};

export default uploadTest;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  // Get tutor
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  let tutor = await Tutor.findById(session?.user.id);
  tutor = JSON.parse(JSON.stringify(tutor));

  return {
    props: {
      tutor,
    },
  };
};
