import Navbar from "@/components/Navbar";
import Head from "next/head";
import {supportText} from "@/lib/supportContent";
import Footer from "@/components/Footer";
import Image from "next/image";

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
      <main className="flex items-center">
        <div className="text-center lg:text-left p-4 lg:py-0 md:px-8 lg:px-16 w-full lg:w-1/2 h-full space-y-4 lg:space-y-8">
          <h1 className="text-blue-900 font-black">Support us</h1>
          <div className="" dangerouslySetInnerHTML={{__html: supportText}}></div>
          <a href={process.env.PAYMENT_LINK} target="_blank" rel="noreferrer" className="btn btn-xl btn-primary">
            donate
          </a>
        </div>
        <div className="w-1/2 h-[calc(100vh-64px)] hidden md:block">
          <Image src="/images/support.jpg" alt="teaching" width={1000} height={1000} style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Support;
