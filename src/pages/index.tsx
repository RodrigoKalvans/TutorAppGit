import { ReactElement, useState } from "react";

import Button from "@/components/button";
import Footer from "@/components/footer";
import Head from "next/head";
import LandingPageBlurBox from "@/components/landingPage/landingPageBlurBox";
import LandingPageContainer from "@/components/landingPage/landingPageContainer";
import Navbar from "@/components/navbar";
import SubjectBox from "@/components/landingPage/subjectBox";
import TutorCard from "@/components/landingPage/tutorCard";

var subjects = ['Math', 'History'];

// TODO: Get subjects that will be displayed
// TODO: Get tutors that will be displayed

export default function Home() {
  return (
    <>
      <Head>
        <title>TCorvus</title>
      </Head>
      <main className="bg-landing bgimage z-0 w-full flex-wrap justify-center absolute">

      <div className="flex justify-center mt-5">
        <Navbar />
      </div>

        {/* Top part of page (everything in front of bg image) */}
        <div className="h-screen">
          <div className="m-5 p-3 ml-20 mt-20 text-white">
            <h1 className="p-1 m-1 text-6xl">Connect with <br/> <div className="mb-8 text-orange-400">Expert Tutors Now</div></h1> 
            <p className="p max-w-md text-lg ml-4">
              Find the perfect tutor to help you excel in your studies. 
              Our platform connects you with qualified and experienced tutors who can assist you with a variety of subjects, 
              from math and science to English and history. 
              Follow tutors and students to stay updated with their activities. Sign up now and start your learning journey!
            </p>
          </div>

          <div className="ml-32">
            <Button style="bg-orange-500 text-lg" >Browse</Button>
            <Button style="bg-blue-600 text-lg" >Join us</Button>
          </div>
        </div>

        {/* Top subjects */}
          <h1 className="mt-80 p-20 text-bold text-5xl flex justify-center ">Browse tutors by&nbsp;<div className="text-orange-500 ">Subject</div></h1>
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
        <LandingPageContainer>
          <LandingPageBlurBox style="bg-blue-200">
            <div className="text-5xl pl-10 py-10 w-full flex justify-center">Take a look at our&nbsp;<span className="text-orange-500">Trending Tutors</span></div>
            <div className="flex items-center justify-around">
              <TutorCard />
              <TutorCard />
            </div>
          </LandingPageBlurBox>
        </LandingPageContainer>

        {/** Discover more about us */}
        <LandingPageContainer>
          <LandingPageBlurBox style="bg-blue-200 ">
            <div className=" pl-10 py-10 ml-auto mr-0 ">
              <h1 className="text-5xl">Discover more <br/><div className="text-blue-900">about us</div></h1>
              <p className="w-1/2 text-2xl my-10">
                We are so excited to connect you with the best tutors to help you excel in your studies. 
                If you want to know more about our mission, 
                values, and the story behind our platform, visit our about us page! 
              </p>
              <Button style="bg-blue-600" >Learn more about us</Button>
            </div>
          </LandingPageBlurBox>
        </LandingPageContainer>

        {/** Support our mission */}
        <LandingPageContainer style="">
          <LandingPageBlurBox style="bg-blue-200">
            <div className="pl-10 py-10">
              <h1 className="text-5xl mt-5">Support our mission <br/>to provide <br/><div className="text-blue-900">quality education</div></h1>
              <p className="w-3/5 text-2xl my-10">
                At our platform, we are committed to providing quality education to students of all ages by 
                connecting them with highly qualified and experienced tutors. 
                Your support will help us to continue to improve and expand our services 
                to reach more students who need our help.
              </p>
              <Button style="bg-blue-600" >Support us now</Button>
            </div>
          </LandingPageBlurBox>
        </LandingPageContainer>

        {/** Footer */}
        <Footer />
        
      </main>
    </>
  );
}
