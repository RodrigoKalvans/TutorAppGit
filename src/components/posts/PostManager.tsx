import {useSession} from "next-auth/react";
import Post from "./Post";
import {useEffect, useState} from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts as postsProp
 * @return {JSX} component
 */
const PostManager = ({
  posts: postsProp = undefined,
  followed = false,
  loggedInUser,
} : {
  posts?: Array<any>,
  followed?: boolean,
  loggedInUser?: any,
}) => {
  const [posts, setPosts] = useState<Array<any> | undefined>(undefined);
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

  const {data, error, isLoading} = useSWR("/api/posts", fetcher);

  useEffect(() => {
    try {
      if (postsProp) {
        setPosts(postsProp);
      } else if (followed) {
        setPosts(data.filter((post: any) => loggedInUser.following.some((following: any) => post.userId == following.userId)));
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
    return () => {
      setPosts([]);
    };
  }, [data, followed, loggedInUser?.following, postsProp]);

  return (
    <div className="h-fit flex flex-col-reverse gap-10">
      {error && "error"}
      {isLoading && "loading"}
      {posts && posts.length > 0 ?
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
