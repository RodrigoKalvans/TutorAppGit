import Footer from "@/components/Footer";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import SearchPanel from "@/components/search/SearchPanel";
import { useRouter } from "next/router";

export default function Search({tutors}: {tutors:any}) {

    // get search queries 
    const router = useRouter()

    const {query: {queryFromNav, roleFromNav}}: any = router;

    const navProps: {
        query: string,
        role: string,
    } = {
        query: queryFromNav,
        role: roleFromNav,
    }

    console.log(tutors)

    return (
        <>
        <Head>
            <title>Search</title>
        </Head>
        <main className="flex-col justify-center min-h-screen"> 
            <Navbar black={true} />
            <SearchPanel props={navProps} users={tutors} />
            <Footer />
        </main>
        </>
    )
}

/**
 *  this is here just for initial testing purposes, later this functionality should be changed to fetch elsewhere
 * @returns {{tutor}[]} all tutors
 */
export async function getStaticProps() {

    const res = await fetch("http://localhost:3000/api/tutors", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    })

    return {
        props: {
            tutors: await res.json()
        }
    }

}
