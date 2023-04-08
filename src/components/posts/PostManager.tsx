import Post from "./Post";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts
 * @return {JSX} component
 */
const PostManager = ({posts, loggedIn}: {posts: Array<any>, loggedIn: boolean}) => {
  return (
    <>
      <div className="mx-auto h-fit flex flex-col-reverse">
        {posts.length > 0 ?
            posts.map((post: any) => <Post post={post} key={post._id} loggedIn={loggedIn}/>) :
          <div className="text-black text-xl m-5 flex justify-center">
            Follow other users in order to view their posts in this feed!
          </div>
        }
      </div>
    </>
  );
};

export default PostManager;
