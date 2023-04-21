import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Head from "next/head";
import LandingPageBlurBox from "@/components/landingPage/LandingPageBlurBox";
import Navbar from "@/components/Navbar";
import SubjectBox from "@/components/landingPage/SubjectBox";
import Image from "next/image";
import LandingPageBgImage from "@/public/images/landing-background-image-fixed.jpg";
import TutorCard from "@/components/landingPage/TutorCard";
import Subject from "@/models/Subject";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";

// TODO: Add subject images
// TODO: Get tutors that will be displayed

/**
 * placeholder docs
 * @return {any} JSX landing page
 */
export default function Home({subjects, tutors}: {subjects: Array<any>, tutors: Array<any>}) {
  return (
    <>
      <Head>
        <title>TCorvus</title>
      </Head>
      <Navbar />

      {/* Top part of page (everything in front of bg image) */}
      <section className="h-[calc(100vh-64px)]">
        <Image
          src={LandingPageBgImage}
          alt="Landing page background image"
          style={
            {
              objectFit: "cover",
              height: "100vh",
              width: "100vw",
              position: "absolute",
              top: 0,
              left: 0,
            }
          }
        />
        <div className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-center gap-8 pl-20 z-0">
          <div>
            <h1 className="mb-8 text-6xl text-white font-black">Connect with <br/>
              <span className="text-orange-400">Expert Tutors Now</span>
            </h1>
            <p className="max-w-md text-lg text-white">
                Find the perfect tutor to help you excel in your studies.
                Our platform connects you with qualified and experienced tutors who can assist you with a variety of subjects,
                from math and science to English and history.
                Follow tutors and students to stay updated with their activities. Sign up now and start your learning journey!
            </p>
          </div>
          <div className="flex gap-8">
            <Button style="bg-orange-500 text-lg font-medium normal-case" link="/feed">Browse</Button>
            <Button style="bg-blue-600 text-lg font-medium normal-case" link="/signin">Join us</Button>
          </div>
        </div>
      </section>

      {/* Top subjects */}
      <section className="mt-28 container">
        <h1 className="mb-20 text-bold text-5xl text-center font-medium">Browse tutors by&nbsp;<span className="text-orange-500 ">Subject</span></h1>

        <div className="grid grid-cols-3 justify-items-center">
          {subjects && subjects.map((subject) => <SubjectBox subject={subject} key={subject._id}/>)}
        </div>
      </section>

      {/* Top tutors */}
      <div className="container flex justify-center">
        <LandingPageBlurBox style="bg-blue-200">
          <div className="text-5xl pl-10 py-10 w-full flex justify-center font-medium">Take a look at our&nbsp;<span className="text-orange-500">Trending Tutors</span></div>
          <div className="flex items-center justify-around">
            <div className="carousel w-full rounded-box ml-3">
              {tutors && tutors.map((tutor) =>
                <div id="slide1" key={tutor._id} className="carousel-item relative w-1/2">
                  <TutorCard tutor={tutor} />
                </div>,
              )}
            </div>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Discover more about us */}
      <div className="container flex justify-center">
        <LandingPageBlurBox style="bg-blue-200 ">
          <div className=" pl-10 py-10 ml-auto mr-0 flex-col justify-end ">
            <h1 className="text-5xl text-right px-5 font-medium">Discover more <br/><div className="text-blue-900">about us</div></h1>
            <div className="w-full flex justify-end">
              <p className="w-1/2 text-2xl my-10 text-right ">
                    We are so excited to connect you with the best tutors to help you excel in your studies.
                    If you want to know more about our mission,
                    values, and the story behind our platform, visit our about us page!
              </p>
            </div>
            <div className="flex w-full justify-end">
              <Button style="bg-blue-600 hover:bg-blue-700" link="/aboutus">Learn more about us</Button>
            </div>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Support our mission */}
      <div className="container flex justify-center">
        <LandingPageBlurBox style="bg-blue-200">
          <div className="pl-10 py-10">
            <h1 className="text-5xl mt-5 font-medium">Support our mission <br/>to provide <br/><div className="text-blue-900">quality education</div></h1>
            <p className="w-3/5 text-2xl my-10">
                  At our platform, we are committed to providing quality education to students of all ages by
                  connecting them with highly qualified and experienced tutors.
                  Your support will help us to continue to improve and expand our services
                  to reach more students who need our help.
            </p>
            <Button style="bg-blue-600 hover:bg-blue-700" link="/supportus">Support us now</Button>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Footer */}
      <Footer />
    </>
  );
}

/**
 * Get 2 tutors and 9 subjects
 * @return {any} props
 */
export async function getStaticProps() {
  await db.connect();
  const subjects = await Subject.find();
  const allTutors = await Tutor.find();
  await db.disconnect();

  const sortedTutors = quickSort(allTutors, 0, allTutors.length - 1);

  return {
    props: {
      subjects: JSON.parse(JSON.stringify(subjects.slice(0, 9))),
      tutors: JSON.parse(JSON.stringify(sortedTutors)),
    },
  };
}

/**
 * Used for QuickSort algo
 * @param {Array<any>} items
 * @param {number} leftIndex
 * @param {number} rightIndex
 */
function swap(items: Array<any>, leftIndex: number, rightIndex: number) {
  const temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

/**
 * Used for QuickSort algo
 * @param {Array<any>} items
 * @param {number} left
 * @param {number} right
 * @return {any} partition
 */
function partition(items: Array<any>, left: number, right: number) {
  const pivot = items[Math.floor((right + left) / 2)]; // middle element
  let i = left; // left pointer
  let j = right; // right pointer
  while (i <= j) {
    while (items[i].followers.length < pivot.followers.length) {
      i++;
    }
    while (items[j].followers.length > pivot.followers.length) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); // sawpping two elements
      i++;
      j--;
    }
  }
  return i;
}

/**
 * Used to sort tutors by follower count
 * @param {Array<any>} items
 * @param {number} left
 * @param {number} right
 * @return {Array<any>} sorted items
 */
function quickSort(items: Array<any>, left: number, right: number) {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right); // index returned from partition
    if (left < index - 1) { // more elements on the left side of the pivot
      quickSort(items, left, index - 1);
    }
    if (index < right) { // more elements on the right side of the pivot
      quickSort(items, index, right);
    }
  }
  return items;
}
