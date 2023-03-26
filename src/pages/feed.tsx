import PostManager from "@/components/posts/PostManager";

const Feed = () => {
  return (
    <>
      <div className="bord h-screen w-full flex justify-center">
        <PostManager posts={[]} />
      </div>
    </>
  );
};

export default Feed;

export const getServerSideProp = () => {
  return {
    props: {

    },
  };
};
