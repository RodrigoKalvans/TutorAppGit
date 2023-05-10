import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Head from "next/head";
import LandingPageBlurBox from "@/components/landingPage/LandingPageBlurBox";
import Navbar from "@/components/Navbar";
import SubjectBox from "@/components/landingPage/SubjectBox";
import Image from "next/image";
import TutorCard from "@/components/landingPage/TutorCard";
import Subject from "@/models/Subject";
import db from "@/utils/db";
import {getLandingPageTutors} from "@/utils/featuredTutors";
import {LandingPageCard} from "@/types/ambiguous-types";

/**
 * placeholder docs
 * @return {any} JSX landing page
 */
export default function Home({subjects, carouselItems}: {subjects: Array<any>, carouselItems: Array<any>}) {
  return (
    <>
      <Head>
        <title>TCorvus</title>
      </Head>
      <Navbar />

      {/* Top part of page (everything in front of bg image) */}
      <section className="h-[calc(100vh-64px)] mb-14 lg:mb-28 z-0">
        <Image
          src={"/images/landing-background-image.jpg"}
          alt={"Landing page background image"}
          fill
          style={
            {
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }
          }
        />
        <div className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-center gap-8 pl-5 lg:pl-20 z-0">
          <div>
            <h1 className="mb-8 text-5xl md:text-6xl text-white font-black">Connect with <br/>
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
      <section className="container mb-16">
        <h1 className="mb-10 lg:mb-20 text-center font-medium">Browse tutors by&nbsp;<span className="text-orange-500 ">Subject</span></h1>

        <div className="grid grid-cols-2 md:grid-cols-3 justify-items-center">
          {subjects && subjects.map((subject) => <SubjectBox subject={subject} key={subject._id}/>)}
        </div>
      </section>

      {/* Top tutors */}
      <div className="container mb-16">
        <LandingPageBlurBox style="bg-blue-200">
          <div className="flex flex-col lg:py-10">
            <div className="mb-10 w-full font-medium text-center">
              <h1>Take a look at our&nbsp;<span className="text-orange-500">Featured Tutors</span></h1>
            </div>
            <div className="carousel rounded-box flex gap-10 overflow-y-hidden">
              {carouselItems && carouselItems.map((item: any | LandingPageCard) =>
                <TutorCard card={item} key={item.tutor._id} subjects={subjects}/>,
              )}
            </div>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Discover more about us */}
      <div className="container mb-16">
        <LandingPageBlurBox style="bg-blue-200 ">
          <div className="lg:pl-10 lg:py-10 mx-auto flex flex-col lg:items-end">
            <h1 className="text-center lg:text-right px-5 font-medium">Discover more <br/><div className="text-blue-900">about us</div></h1>
            <p className="lg:w-1/2 md:text-2xl my-10 text-center lg:text-right ">
                    We are so excited to connect you with the best tutors to help you excel in your studies.
                    If you want to know more about our mission,
                    values, and the story behind our platform, visit our about us page!
            </p>
            <Button style="bg-blue-600 hover:bg-blue-700" link="/aboutUs">Learn more about us</Button>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Support our mission */}
      <div className="container">
        <LandingPageBlurBox style="bg-blue-200">
          <div className="lg:pl-10 lg:py-10 mx-auto flex flex-col lg:items-start">
            <h1 className="font-medium text-center lg:text-left">Support our mission <br/>to provide <br/><div className="text-blue-900">quality education</div></h1>
            <p className="lg:w-3/5 lg:text-2xl my-10 text-center lg:text-left">
                  At our platform, we are committed to providing quality education to students of all ages by
                  connecting them with highly qualified and experienced tutors.
                  Your support will help us to continue to improve and expand our services
                  to reach more students who need our help.
            </p>
            <Button style="bg-blue-600 hover:bg-blue-700" link="/supportUs">Support us now</Button>
          </div>
        </LandingPageBlurBox>
      </div>

      {/** Footer */}
      <Footer />
    </>
  );
}

/**
 * Get carousel tutors and 9 subjects
 * @return {any} props
 */
export async function getStaticProps() {
  await db.connect();
  const subjects = await Subject.find();
  // await db.disconnect();

  const carouselItems = await getLandingPageTutors();

  return {
    props: {
      subjects: JSON.parse(JSON.stringify(subjects.slice(0, 9))),
      carouselItems: JSON.parse(JSON.stringify(carouselItems)),
    },
  };
}
