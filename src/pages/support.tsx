import Navbar from "@/components/Navbar";
import Head from "next/head";
import {supportText} from "@/public/support";
import Footer from "@/components/Footer";

/**
 * Support us page
 * @return {JSX}
 */
const Support = () => {
  return (
    <>
      <Head>
        <title>Support Us</title>
      </Head>
      <Navbar black/>
      <div className="w-screen flex flex-col gap-8 py-8">
        <div className="w-screen flex justify-center">
          <a href="https://donate.stripe.com/test_3csaFe1p67sL0b69AA" target="_blank" rel="noreferrer">
            <button className="btn btn-xl btn-primary">donate</button>
          </a>
        </div>
        <p className="px-10">{supportText}</p>
        <div className="w-screen text-2xl flex justify-center">Please consider making a donation!</div>
      </div>
      <Footer />
    </>
  );
};

export default Support;
