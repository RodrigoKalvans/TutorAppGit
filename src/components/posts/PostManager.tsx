import Post from "./Post";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts
 * @return {JSX} component
 */
const PostManager = ({posts}: {posts: Array<any>}) => {
  return (
    <>
      <div className="w-9/10 mx-auto h-fit p-1 flex flex-col-reverse justify-center">
        {posts.length > 1 ?
            posts.map((post: any) => <Post post={post} key={post._id} />) :
          <div className="text-black text-xl m-5 flex justify-center">
            Follow other users in order to view their posts in this feed!
          </div>
        }
      </div>
    </>
  );
};

export default PostManager;
