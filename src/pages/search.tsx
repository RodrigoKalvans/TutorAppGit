import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SearchPanel from "@/components/search/SearchPanel";

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} search page
 */
export default function Search({subjects, students, tutors}: {subjects: any, students: any, tutors: any}) {
  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <Navbar black={true} />
      <main className="flex-col justify-center min-h-screen container">
        <SearchPanel subjects={subjects} students={students} tutors={tutors} />
        <Footer />
      </main>
    </>
  );
}

/**
 * plc jsdoc
 * @return {any} props
 */
export async function getStaticProps() {
  const subjectsRes = await fetch("http://localhost:3000/api/subjects");
  const studentsRes = await fetch("http://localhost:3000/api/students");
  const tutorsRes = await fetch("http://localhost:3000/api/tutors");

  const subjects = await subjectsRes.json();
  const students = await studentsRes.json();
  const tutors = await tutorsRes.json();

  return {
    props: {
      subjects,
      students,
      tutors,
    },
    revalidate: 10,
  };
}
