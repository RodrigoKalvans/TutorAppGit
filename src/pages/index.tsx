import Button from "@/components/Button";
import Carousel from "@/components/landingPage/Carousel";
import Footer from "@/components/Footer";
import Head from "next/head";
import LandingPageBlurBox from "@/components/landingPage/LandingPageBlurBox";
import Navbar from "@/components/Navbar";
import SubjectBox from "@/components/landingPage/SubjectBox";
import Image from "next/image";
import LandingPageBgImage from "@/public/images/landing-background-image-fixed.jpg";

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
      <main className="w-full">
        {/* Top part of page (everything in front of bg image) */}
        <div className="h-screen flex flex-col justify-center gap-8 pl-20">
          <div className="z-10 relative">
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

          <div className="z-10 relative flex gap-8">
            <Button style="bg-orange-500 text-lg font-medium normal-case" link="/feed">Browse</Button>
            <Button style="bg-blue-600 text-lg font-medium normal-case" link="/signin">Join us</Button>
          </div>
          <div className="absolute inset-0">
            <Image
              src={LandingPageBgImage}
              alt="Landing page background image"
              style={
                {
                  objectFit: "cover",
                  height: "100vh",
                  width: "100vw",
                }
              }
            />
          </div>
        </div>

        {/* Top subjects */}
        <h1 className="mt-80 p-20 text-bold text-5xl flex justify-center font-medium">Browse tutors by&nbsp;<div className="text-orange-500 ">Subject</div></h1>
        <div className="flex justify-center bord">
          <div className="w-4/5 px-10 flex-wrap justify-around">
            {subjects && subjects.map((subject) => <SubjectBox subject={subject} key={subject._id}/>)}
          </div>
        </div>

        {/* Top tutors */}
        <div className="w-full flex justify-center">
          <LandingPageBlurBox style="bg-blue-200">
            <div className="text-5xl pl-10 py-10 w-full flex justify-center font-medium">Take a look at our&nbsp;<span className="text-orange-500">Trending Tutors</span></div>
            <div className="flex items-center justify-around">
              <Carousel tutors={tutors}/>
            </div>
          </LandingPageBlurBox>
        </div>

        {/** Discover more about us */}
        <div className="w-full flex justify-center">
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
        <div className="w-full flex justify-center">
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

      </main>
    </>
  );
}

/**
 * Get 2 tutors and 9 subjects
 * @return {any} props
 */
export async function getStaticProps() {
  const reqSubjects = await fetch("http://localhost:3000/api/subjects");
  const subjects = await reqSubjects.json();

  const reqTutors = await fetch("http://localhost:3000/api/tutors/getTopFiveTutorsByFollowers");
  const tutors = await reqTutors.json();

  return {
    props: {
      subjects: subjects.slice(0, 9),
      tutors,
    },
  };
}
