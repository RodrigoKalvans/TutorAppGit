import PostManager from "@/components/posts/PostManager";
import Navbar from "@/components/Navbar";
import {useState} from "react";
import Footer from "@/components/Footer";
import useSWR from "swr";
import CreatePostButton from "@/components/CreatePostButton";
import FeedPageTopTutor from "@/components/feed/FeedPageTopTutor";
import Head from "next/head";
import {useSession} from "next-auth/react";
import {LoadingIcon} from "@/utils/icons";

/**
 * Feed page
 * @param {Array<any>} allPosts
 * @return {JSX}
 */
const Feed = () => {
  const [general, setGeneral] = useState<boolean>(true);
  const {data: session} = useSession();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: topTutors, error, isLoading} = useSWR("/api/tutors?topTutors=true", fetcher);

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <Navbar black/>
      <main className="min-h-screen container">
        <div className="flex flex-col items-center lg:flex-row lg:items-start justify-center gap-10 mt-5">
          {/** sidebar (top tutors & create post) */}
          <div className="w-full lg:w-[30%]">
            <CreatePostButton style="w-full btn bg-[#3F678A] bg-opacity-80 hover:bg-[#3F678A] hover:bg-opacity-100 border-none normal-case text-white font-medium text-md rounded-box mb-2" />
            <div className="flex-col">
              <div className="bg-white rounded-box p-3 py-5">
                <h1 className="w-full flex justify-center font-bold text-xl">Top tutors</h1>
                {isLoading && <div className="text-xl mt-10 w-full flex justify-center">Loading...</div>}
                {error && <div className="text-xl mt-10 w-full flex justify-center text-red-600">Error...</div>}
                <div className="w-full mt-3">
                  {isLoading ? (
                    <LoadingIcon className="animate-spin" />
                  ) : (
                    <>
                      {topTutors && topTutors.map((tutor: any) => (
                        <FeedPageTopTutor tutor={tutor} key={tutor._id} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/** posts section */}
          <div className="w-full lg:w-3/5 bg-white pb-5 rounded-2xl">
            <div className="w-full rounded-b-none flex items-center mb-5">
              <button onClick={() => setGeneral(true)} className="border-solid border-r-2 border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tl-2xl hover:bg-gray-200 text-black transition-colors duration-500">General</button>
              <button onClick={() => setGeneral(false)} className="border-solid border-l-2 border-b-2 font-bold border-gray-300 w-1/2 h-8 rounded-tr-2xl hover:bg-gray-200 text-black transition-colors duration-500">Follow</button>
            </div>
            <div className="w-full flex justify-center">
              {general && <PostManager />}
              {!general && session && <PostManager followed />}
              {!general && !session && <div className="m-5 mt-10 flex justify-center text-xl">Log in to view the follow feed</div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Feed;
