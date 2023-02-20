import Footer from "@/components/footer";
import Head from "next/head";
import Navbar from "@/components/navbar";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

export default function Search({props}: {props: any}) {

    const router = useRouter()

    console.log(router.query.query)
    console.log(router.query.role)

    return (
        <>
        <Head>
            <title>Search</title>
        </Head>
        <main> 
            <div className="bord">
                <Navbar />
            </div>
            <div className="bord">

            </div>
            <div className="bord">
                <Footer />
            </div>
        </main>
        </>
    )
}
