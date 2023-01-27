import { ReactElement, useState } from "react";

import Button from "@/components/button";
import Head from "next/head";
import Navbar from "@/components/navbar";
import SubjectBox from "@/components/subject_box";

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

        <h1 className="content-center mt-80 p-20 text-bold text-5xl flex justify-center ">Browse tutors by subject.</h1>
        
        <div className="w-4/5 bord">
          {subjects.forEach((s) => {
            <div className="bg-black-800">
              <SubjectBox subject={`${s}`} img="" />
            </div>
          })}
        </div>

      </main>
    </>
  );
}
