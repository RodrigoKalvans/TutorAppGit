import Image from "next/image";
import Link from "next/link";

/**
 * Custom 500 error page
 * @param {number} statusCode
 * @return {JSX}
 */
const Custom500 = () => {
  return (
    <>
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
            <b className="flex justify-center text-[24px]">Apologies for that!</b>
            <p className="text-subtitle text-[18px] flex justify-center">Error 500 has occured</p>
            <p className="text-subtitle text-[18px] flex justify-center">We will try to resolve this issue as soon as possible! In the mean time please wait for a moment and then try again.</p>
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

export default Custom500;
