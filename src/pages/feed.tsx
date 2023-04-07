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
import ProfilePicture from "@/components/profilePage/helpingComponents/ProfilePicture";
import Link from "next/link";
import Rating from "@/components/profilePage/helpingComponents/Rating";
import CreatePostButton from "@/components/CreatePostButton";
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
      <Navbar black/>
      <main className="min-h-screen w-full flex-col pt-5 -mt-5 container">
        <div className="flex justify-center gap-10 pt-3">
          {/** sidebar (top tutors & create post) */}
          <div className="w-[30%] px-5">
            <CreatePostButton style="w-full btn bg-[#3F678A] bg-opacity-80 hover:bg-blue-600 hover:bg-opacity-100 border-none normal-case text-white font-medium text-md rounded-box" />
            <div className="mt-5 flex-col">
              <div className="bg-white rounded-box p-3 py-5">
                <h1 className="w-full flex justify-center font-bold">Top tutors</h1>
                {isLoading && <div className="text-xl mt-10 w-full flex justify-center">Loading...</div>}
                {error && <div className="text-xl mt-10 w-full flex justify-center text-red-600">Error...</div>}
                <div className="w-full mt-3">
                  {data && data.map((tutor: any) => (
                    <Link href={`/tutors/${tutor._id}`}>
                      <div className="rounded-full bg-yellow-100 py-3 max-w-full my-4 h-20 flex items-center gap-3 hov">
                        <div className="ml-2 w-1/5">
                          <ProfilePicture user={tutor} key={tutor._id}/>
                        </div>
                        <div className="flex-col w-4/5">
                          <div className="my-1 h-1/2 flex pr-1 justify-between overflow-hidden">
                            <div className="max-w-1/2">{tutor.firstName + " " + tutor.lastName}</div>
                            <div className="w-1/4 pr-1"><Rating rating={tutor.rating}/></div>
                          </div>
                          <div className="my-1 h-1/2 flex justify-between overflow-hidden">
                            <div className="text-xs">{tutor.location}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/** posts section */}
          <div className="w-3/5 bg-white rounded-t-2xl">
            <div className="w-full rounded-b-none flex items-center">
              <button onClick={() => setGeneral(true)} className="border-solid border-r-2 border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tl-2xl hover:bg-gray-200 text-black transition-colors duration-500">General</button>
              <button onClick={() => setGeneral(false)} className="border-solid border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tr-2xl hover:bg-gray-200 text-black transition-colors duration-500">Follow</button>
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
  const followedPosts = allPosts.filter((post: any) => post.userId === session?.user.id.toString());

  await db.disconnect();

  return {
    props: {
      allPosts: JSON.parse(JSON.stringify(allPosts)),
      followedPosts: JSON.parse(JSON.stringify(followedPosts)),
      loggedIn: (session ? true : false),
    },
  };
};
