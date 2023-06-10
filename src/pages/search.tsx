import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Subject from "@/models/Subject";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";
import Filter from "@/components/search/Filter";
import SearchProfile from "@/components/search/SearchProfile";
import {useState, useMemo} from "react";
import Sorter from "@/components/search/Sorter";

/**
 * Search page
 * @param {Array<any>} subjects
 * @param {Array<any>} students
 * @param {Array<any>} tutors
 * @return {JSX} search page
 */
export default function Search({
  subjects,
  students,
  tutors,
} : {
  subjects: Array<any>,
  students: Array<any>,
  tutors: Array<any>,
}) {
  const [profiles, setProfiles] = useState<any>(); // these will be displayed
  const allUsers = useMemo(() => [...tutors, ...students], [tutors, students]); // cache optimization for when there are a lot of profiles

  return (
    <>
      <Head>
        <title>TCorvus | Search</title>
      </Head>
      <Navbar black={true} />
      <main className="flex flex-col lg:flex-row justify-between gap-14 min-h-screen py-2 container">
        {/** filter */}
        <div className="flex flex-col w-full lg:w-96 2xl:w-[30rem]">
          <Filter subjects={subjects} setProfileState={setProfiles} allUsers={allUsers} />
          <Sorter inputProfiles={profiles} setProfileState={setProfiles} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/** profiles */}
          {profiles && (profiles.map((user: any) => (
            <SearchProfile user={user} allSubjects={subjects} key={user._id}/>
          ))) }
          {profiles && profiles.length === 0 &&
              <div className="w-full flex justify-center">
                <div className="w-fit m-2 mt-5 uppercase text-xl">
                  no profiles found
                </div>
              </div>}
        </div>
      </main>
      <Footer />
    </>
  );
}

/**
 * Load necessary data
 * @return {any} props
 */
export async function getStaticProps() {
  await db.connect();
  const subjects = await Subject.find();
  const students = await Student.find();
  const tutors = await Tutor.find();
  // await db.disconnect();

  return {
    props: {
      subjects: JSON.parse(JSON.stringify(subjects)),
      students: JSON.parse(JSON.stringify(students)),
      tutors: JSON.parse(JSON.stringify(tutors)),
    },
    revalidate: 10,
  };
}
