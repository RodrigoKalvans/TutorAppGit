import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SearchPanel from "@/components/search/SearchPanel";
import {useRouter} from "next/router";

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} search page
 */
export default function Search({subjects}: {subjects: any}) {
  // get search queries
  const router = useRouter();

  const {query: {queryFromNav, roleFromNav}}: any = router;

  const navProps: {
        query: string,
        role: string,
    } = {
      query: queryFromNav,
      role: roleFromNav,
    };

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <main className="flex-col justify-center min-h-screen">
        <Navbar black={true} />
        <SearchPanel props={navProps} filterSubjects={subjects} />
        <Footer />
      </main>
    </>
  );
}

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
