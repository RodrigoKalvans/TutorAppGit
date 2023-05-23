/* eslint-disable react-hooks/exhaustive-deps */
import {useSession} from "next-auth/react";
import Post from "./Post";
import {useCallback, useEffect, useState} from "react";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts as postsProp
 * @return {JSX} component
 */
const PostManager = ({
  followed = false,
  userId = undefined,
} : {
  followed?: boolean,
  userId?: string | undefined,
}) => {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [startingPostId, setStartingPostId] = useState<any>(null);
  const {data: session} = useSession();

  const handleDeletePost = async (index: number) => {
    const post = posts!.at(index);

    if (session && session.user.id !== post.userId) return;

    const response = await fetch(`/api/posts/${post._id.toString()}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const arr = new Array(...posts!);
      arr.splice(index, 1);
      setPosts(arr);
    } else {
      alert("Error appeared while deleting the post.");
      console.error(await response.json());
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = `/api/posts?page=${page}${startingPostId ? `&startingPost=${startingPostId.toString()}` : ""}${followed ? `&follow=${followed}` : ""}${userId ? `&userId=${userId}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      // This occurs if there are no more posts
      if (data.length === 0) {
        // No more posts available
        setLoading(false);
        return;
      }
      // This prevents double loading on mount
      if (page === 0) {
        setPosts(data);
        setStartingPostId(data.at(0)._id);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  };

  // load initial posts
  useEffect(() => {
    fetchPosts();
    return () => {
      setPosts([]);
    };
  }, []);

  // fetch posts when user scrolls to the bottom of the page
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 &&
      !loading
    ) {
      console.log("Fetching more posts...");
      fetchPosts();
    }
  }, [loading]);

  // setup scroll listener
  useEffect(() => {
    const handleScrollThrottled = throttle(handleScroll, 200);

    window.addEventListener("scroll", handleScrollThrottled);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
    };
  }, [handleScroll]);

  return (
    <>
      <div className="h-fit flex flex-col gap-10">
        {loading && "loading"}
        {posts && posts.length > 0 ?
          posts.map((post: any, index: number) =>
            <Post post={post} key={index} index={index} handleDelete={handleDeletePost} session={session} />,
          ) :
          <div className="text-black text-xl m-5 flex justify-center">
              No posts found!
          </div>
        }
      </div>
    </>
  );
};

export default PostManager;

/**
 * throttle function to limit the rate of scroll event firing
 * @param {Function} fn
 * @param {number} delay
 * @return {any} callback
 */
const throttle = (fn: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null;
  return () => {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn();
        timeout = null;
      }, delay);
    }
  };
};
