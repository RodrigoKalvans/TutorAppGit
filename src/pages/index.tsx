import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SubjectBox from "@/components/landingPage/SubjectBox";
import Image from "next/image";
import TutorCard from "@/components/landingPage/TutorCard";
import Subject from "@/models/Subject";
import db from "@/utils/db";
import {getLandingPageTutors} from "@/utils/featuredTutors";
import {LandingPageCard} from "@/types/ambiguous-types";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import {useSession} from "next-auth/react";
import Carousel from "@/components/landingPage/Carousel";

/**
 * Landing page
 * @param {Array<any>} subjects
 * @param {Array<any>} carouselItems for the featured tutors section
 * @return {JSX}
 */
export default function Home({subjects, carouselItems}: {subjects: Array<any>, carouselItems: Array<any>}) {
  const {data: session} = useSession();

  const path = session ? `/${session.user.role}s/${session.user.id}` : "/auth/signup";

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
            <h1 className="mb-8 text-5xl md:text-6xl text-light font-black">Connect with <br/>
              <span className="text-orange-400">Expert Tutors Now</span>
            </h1>
            <p className="max-w-md text-lg text-light">
                Find the perfect tutor to help you excel in your studies.
                Our platform connects you with qualified and experienced tutors who can assist you with a variety of subjects,
                from math and science to English and history.
                Follow tutors and students to stay updated with their activities. Sign up now and start your learning journey!
            </p>
          </div>
          <div className="flex gap-8">
            <Link href="/feed" className="buttonLink orange">Browse</Link>
            <Link href={path} className="buttonLink blue">Join us</Link>
          </div>
        </div>
      </section>

      {/* Top subjects */}
      <section className="container mb-14 md:mb-28">
        <h1 className="mb-10 text-center font-medium">Browse tutors by&nbsp;<span className="text-blue-900">subject.</span></h1>

        <div className="grid grid-cols-2 md:grid-cols-3 justify-items-center">
          {subjects && subjects.map((subject) => <SubjectBox subject={subject} key={subject._id}/>)}
        </div>
      </section>

      {/* Top tutors */}
      <section className="container mb-14 md:mb-28">
        <Image src={"/images/little-bird.png"} width={50} height={50} alt="little bird" className="ml-4" />
        <div className="relative">
          <Image
            src={"/images/circle-background.png"}
            alt="circles"
            fill
            style={{
              objectFit: "cover",
            }}
          />
          <div className={`${styles.gradientTrending} ${styles.box} flex flex-col z-10`}>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-light">Take a look at our&nbsp;<span className="text-orange-400">featured tutors.</span></h1>
              <Image src={"/icons/trending_tutors_star.svg"} width={50} height={50} alt="star image" />
            </div>
            <Carousel carouselItems={carouselItems} subjects={subjects} />
          </div>
        </div>
      </section>

      {/** Discover more about us */}
      <section className="container mb-14 md:mb-28">
        <div
          className={`${styles.box} h-[615px] flex flex-col lg:items-end justify-center`}
          style={{
            background: "url(/images/teaching.jpg) top / cover",
          }}>
          <h1 className="text-center lg:text-right font-medium">Discover more <br/><div className="text-blue-900">about us.</div></h1>
          <p className="lg:w-1/2 md:text-2xl my-10 text-center lg:text-right ">
                    We are so excited to connect you with the best tutors to help you excel in your studies.
                    If you want to know more about our mission,
                    values, and the story behind our platform, visit our about us page!
          </p>
          <Link href="/signin" className="buttonLink blue">Learn more about us</Link>
        </div>
      </section>

      {/** Support our mission */}
      <section className="container">
        <div className="relative">
          <Image
            src={"/images/birds-bg.png"}
            alt="circles"
            fill
            style={{
              objectFit: "cover",
            }}
          />
          <div
            className={`${styles.box} ${styles.bgSupport} h-[615px] flex flex-col lg:items-start justify-center`}>
            <h1 className="font-medium text-center lg:text-left">Support our mission <br/>to provide <br/><div className="text-blue-900">quality education.</div></h1>
            <p className="lg:w-3/5 lg:text-2xl my-10 text-center lg:text-left">
                    At our platform, we are committed to providing quality education to students of all ages by
                    connecting them with highly qualified and experienced tutors.
                    Your support will help us to continue to improve and expand our services
                    to reach more students who need our help.
            </p>
            <Link href="/signin" className="buttonLink blue">Support us now</Link>
          </div>
        </div>
      </section>

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
