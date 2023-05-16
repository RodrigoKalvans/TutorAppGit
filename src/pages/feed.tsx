import PostManager from "@/components/posts/PostManager";
import {Session, getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSidePropsContext} from "next";
import Navbar from "@/components/Navbar";
import {useState} from "react";
import Footer from "@/components/Footer";
import db from "@/utils/db";
import useSWR from "swr";
import CreatePostButton from "@/components/CreatePostButton";
import FeedPageTopTutor from "@/components/feed/FeedPageTopTutor";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import Head from "next/head";

/**
 * Feed page
 * @param {Array<any>} allPosts
 * @return {JSX}
 */
const Feed = ({
  user,
} : {
  user?: any,
}) => {
  const [general, setGeneral] = useState<boolean>(true);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: topTutors, error, isLoading} = useSWR("/api/tutors?topTutors=true", fetcher);

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
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
                  {topTutors && topTutors.map((tutor: any) => (
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
                {general && <PostManager loggedInUser={user} />}
                {!general && user && <PostManager followed loggedInUser={user}/>}
                {!general && !user && <div className="m-5 mt-10 flex justify-center text-xl">Log in to view the follow feed</div>}
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

  // get posts for follow feed
  let loggedInUser: any;
  if (session) {
    if (session.user.role === "tutor") {
      loggedInUser = await Tutor.findById(session.user.id);
    } else if (session.user.role === "student") {
      loggedInUser = await Student.findById(session.user.id);
    }
  }

  // await db.disconnect();

  return {
    props: {
      user: loggedInUser ? JSON.parse(JSON.stringify(loggedInUser)) : null,
    },
  };
};
