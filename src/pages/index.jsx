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

          <div className="flex-col ml-20">
            <Button text="Browse" color="orange" link="" />
            <Button text="Join Us" color="blue" link="" />
          </div>
        </div>

        {/* Top subjects */}
        <h1 className="content-center mt-80 p-20 text-bold text-5xl flex justify-center ">Browse tutors by subject.</h1>
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

        {/* Top tutors */}
        <div className="flex justify-center m-20 w-4/5 p-1">
          <div className="bord rounded-md flex justify-center">
            <div className="text-4xl pl-5 py-10">Take a look at our <div className="text-orange-500">trending tutors</div></div>
            <TutorCard />
          </div>
        </div>


      </main>
    </>
  );
}
