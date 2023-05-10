import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";
import {aboutText} from "@/lib/about";

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
      <div className="w-screen flex flex-col gap-8 py-8">
        <h1 className="px-20">About us</h1>
        <p className="px-10">{aboutText}</p>
      </div>
      <Footer />
    </>
  );
};

export default About;
