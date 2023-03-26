import Post from "./Post";

/**
 * contains Post components and controls the data flow to and from Posts
 * @param {Array<any>} posts
 */
const PostManager = ({posts}: {posts: Array<any>}) => {
  return (
    <>
      <main className="w-full h-fit p-1">
        {posts.map((post: any) => <Post post={post} key={post._id} />)}
      </main>
    </>
  )
};

export default PostManager;
