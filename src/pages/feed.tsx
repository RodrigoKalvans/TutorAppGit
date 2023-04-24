import PostManager from "@/components/posts/PostManager";
import {Session, getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSidePropsContext} from "next";
import Navbar from "@/components/Navbar";
import {useState} from "react";
import Footer from "@/components/Footer";
import db from "@/utils/db";
import Post from "@/models/Post";
import useSWR from "swr";
import CreatePostButton from "@/components/CreatePostButton";
import FeedPageTopTutor from "@/components/feed/FeedPageTopTutor";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
/**
 * Feed page
 * @param {Array<any>} posts
 * @return {JSX}
 */
const Feed = ({allPosts, followedPosts, loggedIn}: {allPosts: Array<any>, followedPosts: Array<any>, loggedIn: boolean}) => {
  const [general, setGeneral] = useState<boolean>(true);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data, error, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors/getTopFiveTutorsByFollowers`, fetcher);

  return (
    <>
      <Navbar black/>
      <main className="min-h-screen w-full flex-col pt-5 -mt-5 container">
        <div className="flex justify-center gap-10 pt-3">
          {/** sidebar (top tutors & create post) */}
          <div className="w-[30%] px-5">
            <CreatePostButton style="w-full btn bg-[#3F678A] bg-opacity-80 hover:bg-blue-600 hover:bg-opacity-100 border-none normal-case text-white font-medium text-md rounded-box" />
            <div className="mt-5 flex-col">
              <div className="bg-white rounded-box p-3 py-5">
                <h1 className="w-full flex justify-center font-bold text-xl">Top tutors</h1>
                {isLoading && <div className="text-xl mt-10 w-full flex justify-center">Loading...</div>}
                {error && <div className="text-xl mt-10 w-full flex justify-center text-red-600">Error...</div>}
                <div className="w-full mt-3">
                  {data && data.map((tutor: any) => (
                    <FeedPageTopTutor tutor={tutor} key={tutor._id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/** posts section */}
          <div className="w-3/5 bg-white rounded-t-2xl">
            <div className="w-full rounded-b-none flex items-center mb-5">
              <button onClick={() => setGeneral(true)} className="border-solid border-r-2 border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tl-2xl hover:bg-gray-200 text-black transition-colors duration-500">General</button>
              <button onClick={() => setGeneral(false)} className="border-solid border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tr-2xl hover:bg-gray-200 text-black transition-colors duration-500">Follow</button>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-full">
                {general && <PostManager posts={allPosts}/>}
                {!general && loggedIn && <PostManager posts={followedPosts}/>}
                {!general && !loggedIn && <div className="m-5 mt-10 flex justify-center text-xl">Log in to view the follow feed</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Feed;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  await db.connect();

  const session: Session | null = await getServerSession(context.req, context.res, authOptions);

  const allPosts = await Post.find();

  let followedPosts = [];

  // get posts for follow feed
  if (session) {
    let loggedInUser: any;
    if (session.user.role === "tutor") {
      loggedInUser = await Tutor.findById(session.user.id);
    } else if (session.user.role === "student") {
      loggedInUser = await Student.findById(session.user.id);
    }

    followedPosts = allPosts.filter((post: any) => loggedInUser.following.some((following: any) => post.userId == following.userId));
  }

  await db.disconnect();

  return {
    props: {
      allPosts: JSON.parse(JSON.stringify(allPosts)),
      followedPosts: JSON.parse(JSON.stringify(followedPosts)),
      loggedIn: (session ? true : false),
    },
  };
};
