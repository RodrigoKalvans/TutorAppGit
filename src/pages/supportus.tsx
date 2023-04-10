import Navbar from "@/components/Navbar";
import Head from "next/head";
import Link from "next/link";

// Payments are currently handled in a no-code way
// Simply redirect to the Stripe link for TCorvus
// No redirecting is handled this way

/**
 * Support us page
 * @return {JSX}
 */
const SupportUs = () => {
  return (
    <>
      <Head>
        <title>Support Us</title>
      </Head>
      <Navbar black/>
      <div className="w-screen flex flex-col gap-20 py-20">
        <div className="w-screen text-2xl flex justify-center">Please consider making a donation!</div>
        <div className="w-screen flex justify-center">
          <a href="https://donate.stripe.com/test_3csaFe1p67sL0b69AA" target="_blank">
            <button className="btn btn-xl btn-primary">donate</button>
          </a>
        </div>
      </div>
    </>
  );
};

export default SupportUs;
