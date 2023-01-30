import { ReactElement, useState } from "react";

import Button from "@/components/button";
import Head from "next/head";
import Navbar from "@/components/navbar";
import SubjectBox from "@/components/subjectBox";
import TutorCard from "@/components/tutorCard"

var subjects = ['Math', 'History'];

export default function Home() {
  return (
    <>
      <Head>
        <title>TCorvus</title>
      </Head>
      <main className="bg-scroll bg-landing bg-contain bg-no-repeat bg-top z-0 w-full">

        <div className="flex justify-center sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Top part of page (everything in front of bg image) */}
        <div className="h-screen">
          <div className="m-5 p-3 ml-20 mt-20 text-white">
            <h1 className="p-1 m-1 text-6xl">Connect with</h1> 
            <h1 className="p-1 m-1 text-6xl mb-8 text-orange-400">Expert Tutors Now</h1>
            <p className="max-w-md text-lg ml-4">
              Find the perfect tutor to help you excel in your studies. 
              Our platform connects you with qualified and experienced tutors who can assist you with a variety of subjects, 
              from math and science to English and history. 
              Follow tutors and students to stay updated with their activities. Sign up now and start your learning journey!
            </p>
          </div>

          <div className="ml-20">
            <Button text="Browse" color="orange" link="" />
            <Button text="Join Us" color="blue" link="" />
          </div>
        </div>

        {/* Top subjects */}
        <div>
          <h1 className="content-center mt-80 p-20 text-bold text-5xl flex justify-center ">Browse tutors by&nbsp;<div className="text-orange-500 ">Subject</div></h1>
          <div className="flex justify-center">
            <div className="w-4/5 bord max-w-1/5 flex justify-center">
              {/* {subjects.map((s) => {
                <div className="">
                  yo
                  <SubjectBox  />
                </div>
              })} */}
              <SubjectBox />
              <SubjectBox subject="Mathematics" />
            </div>
          </div>
        </div>

        {/* Top tutors */}
        <div className="flex justify-center mt-20 w-full">
          <div className="bord rounded-md w-4/5 flex-col justify-center p-3">
            <div className="text-4xl pl-10 py-10 w-full">Take a look at our <span className="text-orange-500">Trending Tutors</span></div>
            <div className="flex items-center justify-around">
              <TutorCard />
              <TutorCard />
            </div>
          </div>
        </div>


      </main>
    </>
  );
}
