import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SearchPanel from "@/components/search/SearchPanel";

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} search page
 */
export default function Search({subjects}: {subjects: any}) {
  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <main className="flex-col justify-center min-h-screen">
        <Navbar black={true} />
        <SearchPanel subjects={subjects} />
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
  const res = await fetch("http://localhost:3000/api/subjects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      subjects: await res.json(),
    },
  };
}
