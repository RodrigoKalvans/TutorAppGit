import Post from "./Post";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts
 * @return {JSX} component
 */
const PostManager = ({posts}: {posts: Array<any>}) => {
  return (
    <>
      <main className="w-full h-fit p-1 flex justify-center">
        <div className="w-full">
          {posts && posts.map((post: any) => <div className="w-full flex justify-center"><Post post={post} key={post._id}/></div>)}
        </div>
      </main>
    </>
  );
};

export default PostManager;
