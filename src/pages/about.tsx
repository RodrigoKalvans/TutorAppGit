import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";
import {aboutText} from "@/lib/aboutContent";
import Image from "next/image";

/**
 * About us page
 * @return {JSX}
 */
const About = () => {
  return (
    <>
      <Head>
        <title>About Us</title>
      </Head>

      <Navbar black/>

      <main className="flex items-center">
        <div className="w-1/2 h-[calc(100vh-64px)] hidden md:block">
          <Image src="/images/about.jpg" alt="teaching" width={1000} height={1000} style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }} />
        </div>
        <div className="text-center md:text-left p-4 md:py-0 md:px-8 lg:px-16 w-full md:w-1/2 h-full space-y-4 md:space-y-8">
          <h1 className="text-blue-900 font-black">About us</h1>
          <div className="" dangerouslySetInnerHTML={{__html: aboutText}}></div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
