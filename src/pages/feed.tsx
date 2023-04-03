import PostManager from "@/components/posts/PostManager";
import {Session, getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSidePropsContext} from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {useState} from "react";

/**
 * Feed page
 * @param {Array<any>} posts
 * @return {JSX}
 */
const Feed = ({allPosts, followedPosts, loggedIn}: {allPosts: Array<any>, followedPosts: Array<any>, loggedIn: boolean}) => {
  const [general, setGeneral] = useState<boolean>(true);

  return (
    <>
      <Navbar black/>
      <div className="min-h-screen w-full flex-col pt-5">
        <div className="w-full flex justify-center">
          <div className="btn-group">
            <button onClick={() => setGeneral(true)} className="btn bg-blue-100 hover:bg-blue-200 text-black">General</button>
            <button onClick={() => setGeneral(false)} className="btn bg-blue-100 hover:bg-blue-200 text-black">Follow</button>
          </div>
        </div>
        <div className="w-full flex justify-center ">
          <div className="w-4/5 ">
            {general && <PostManager posts={allPosts} />}
            {!general && loggedIn && followedPosts.length > 0 && <PostManager posts={followedPosts} />}
            {!general && loggedIn && followedPosts.length === 0 && <div className="m-5 mt-10 flex justify-center text-xl">Follow other users in order to see their posts in this feed</div>}
            {!general && !loggedIn && <div className="m-5 mt-10 flex justify-center text-xl">Log in to view the follow feed</div>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const resPosts = await fetch("http://localhost:3000/api/posts");
  const allPosts = await resPosts.json();

  const session: Session | null = await getServerSession(context.req, context.res, authOptions);

  const followedPosts = allPosts.filter((post: any) => post.userId === session?.user.id.toString());

  return {
    props: {
      allPosts,
      followedPosts,
      loggedIn: (session ? true : false),
    },
  };
};
