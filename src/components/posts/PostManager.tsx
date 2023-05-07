import {useSession} from "next-auth/react";
import Post from "./Post";
import {useState} from "react";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {any[]} posts
 * @return {JSX} component
 */
const PostManager = ({posts: postsArr}: {posts: any[]}) => {
  const [posts, setPosts] = useState<any[]>(postsArr);
  const {data: session} = useSession();

  const handleDeletePost = async (index: number) => {
    const post = posts.at(index);

    if (session && session.user.id !== post.userId) return;

    const response = await fetch(`/api/posts/${post._id.toString()}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const arr = new Array(...posts);
      arr.splice(index, 1);
      setPosts(arr);
    } else {
      alert("Error appeared while deleting the post.");
      console.log(await response.json());
    }
  };

  return (
    <div className="mx-auto h-fit flex flex-col-reverse gap-10">
      {posts.length > 0 ?
        posts.map((post: any, index: number) =>
          <Post post={post} key={post._id} index={index} handleDelete={handleDeletePost} session={session} />) :
        <div className="text-black text-xl m-5 flex justify-center">
            Follow other users in order to view their posts in this feed!
        </div>
      }
    </div>
  );
};

export default PostManager;
