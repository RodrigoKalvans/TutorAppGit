import {useSession} from "next-auth/react";
import {useState} from "react";

const CreatePost = () => {
  const {data: session} = useSession();
  const [description, setDescription] = useState("");

  const createPostRequest = async () => {
    const res = await fetch("/api/posts",
        {
          method: "POST",
          body: JSON.stringify({
            description: description,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
    );

    const json = await res.json();

    console.log(json);
  };

  return (
    <div>
      {!session && (
        <h1>You are not logged in! Log in before creating a post!</h1>
      )}

      {session && (
        <>
          <h1>Create Post</h1>
          <form>
            <label>Description</label>
            <input type="text" onChange={(e) => setDescription(e.target.value)} />
            <button onClick={async (e) => {
              e.preventDefault();
              await createPostRequest();
            }}>Create</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreatePost;
