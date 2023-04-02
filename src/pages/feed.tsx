import PostManager from "@/components/posts/PostManager";
import {Session, getServerSession} from "next-auth";
import {authOptions} from "./api/auth/[...nextauth]";
import {GetServerSidePropsContext} from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import {useState} from "react";
import db from "@/utils/db";
import Post from "@/models/Post";
import Button from "@/components/button";
import useSWR from "swr";
import ProfilePicture from "@/components/profilePage/helpingComponents/ProfilePicture";

/**
 * Feed page
 * @param {Array<any>} posts
 * @return {JSX}
 */
const Feed = ({allPosts, followedPosts, loggedIn}: {allPosts: Array<any>, followedPosts: Array<any>, loggedIn: boolean}) => {
  const [general, setGeneral] = useState<boolean>(true);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data, error, isLoading} = useSWR("http://localhost:3000/api/tutors/getTopFiveTutorsByFollowers", fetcher);

  return (
    <>
      <div className="bg-blue-900">
        <Navbar/>
      </div>
      <div className="min-h-screen w-full flex-col pt-5 -mt-5">
        <div className="w-full flex justify-center gap-10 pt-3">
          <div className="w-[30%] px-5">
            <div className="bg-white rounded-box p-3 py-5">
              <div className="flex justify-center"><Button>Post</Button></div>
              <div className="mt-5 flex-col">
                <h1 className="w-full flex justify-center font-bold">Top tutors</h1>
                {isLoading && <div className="text-xl mt-10 w-full flex justify-center">Loading...</div>}
                {error && <div className="text-xl mt-10 w-full flex justify-center text-red-600">Error...</div>}
                <div className="w-full mt-3">
                  {data && data.map((tutor: any) => (
                    <div className="rounded-box bg-yellow-100 py-3 max-w-full my-4 h-20 flex items-center gap-3 hov">
                      <div className="w-1/5">
                        <ProfilePicture />
                      </div>
                      <div className="flex-col">
                        <div className="my-1 flex overflow-hidden">{tutor.firstName + " " + tutor.lastName}</div>
                        <div className="my-1 flex overflow-hidden">{tutor.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/5 bg-white rounded-t-2xl">
            <div className="w-full rounded-b-none flex items-center">
              <button onClick={() => setGeneral(true)} className="w-1/2 h-8 rounded-tl-2xl hover:bg-gray-300 text-black transition-colors duration-500">General</button>
              <button onClick={() => setGeneral(false)} className="w-1/2 h-8 rounded-tr-2xl hover:bg-gray-300 text-black transition-colors duration-500">Follow</button>
            </div>
            <div className="w-full flex justify-center">
              <div className="w-full">
                {general && <PostManager posts={allPosts} />}
                {!general && loggedIn && followedPosts.length > 0 && <PostManager posts={followedPosts} />}
                {!general && loggedIn && followedPosts.length === 0 && <div className="m-5 mt-10 flex justify-center text-xl">Follow other users in order to see their posts in this feed</div>}
                {!general && !loggedIn && <div className="m-5 mt-10 flex justify-center text-xl">Log in to view the follow feed</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  await db.connect();

  const session: Session | null = await getServerSession(context.req, context.res, authOptions);

  const allPosts = await Post.find();
  const followedPosts = allPosts.filter((post: any) => post.userId === session?.user.id.toString());

  await db.disconnect();

  return {
    props: {
      allPosts: JSON.parse(JSON.stringify(allPosts)),
      followedPosts,
      loggedIn: (session ? true : false),
    },
  };
};
