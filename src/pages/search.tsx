import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SearchPanel from "@/components/search/SearchPanel";
import Subject from "@/models/Subject";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} search page
 */
export default function Search({subjects, students, tutors}: {subjects: Array<any>, students: Array<any>, tutors: Array<any>}) {
  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <Navbar black={true} />
      <main className="flex-col justify-center min-h-screen container">
        <SearchPanel subjects={subjects} students={students} tutors={tutors} />
      </main>
      <Footer />
    </>
  );
}

/**
 * plc jsdoc
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
