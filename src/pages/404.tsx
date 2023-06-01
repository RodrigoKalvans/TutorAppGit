import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/**
 * Custom 404 error page
 * @param {number} statusCode
 * @return {JSX}
 */
const Custom404 = () => {
  return (
    <>
      <Head>
        <title>TCorvus | 404</title>
      </Head>
      <div className="flex justify-center my-10 bg-white">
        <div className="w-96 h-[36rem] bg-orange-100 flex flex-col rounded-3xl p-5 border-2 border-orange-400 shadow-xl relative">
          <div className="flex justify-center">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={140}
              height={140}
            />
          </div>
          <div className="h-64 flex flex-col">
            <p className="text-subtitle text-[18px] flex justify-center">Error 404 has occured</p>
            <p className="text-subtitle text-[18px] flex justify-center">The resource you are trying to access does not exist. Please try again later.</p>
          </div>
          <div className="flex justify-center">
            <Link
              href="/"
              className="text-subtitle text-[16px] hover:text-[20px] hover:font-bold hover:-translate-y-[0.2rem] transition-all duration-300 flex justify-center w-fit"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
