import logo from "@/public/images/tcorvus-logo-transparent.png";
import Image from "next/image";
import Link from "next/link";

/**
 * Custom error page
 * @param {number} statusCode
 * @return {JSX}
 */
const Error = ({statusCode}: {statusCode: number}) => {
  return (
    <>
      <div className="flex justify-center my-10 bg-white">
        <div className="w-96 h-[36rem] bg-orange-100 flex flex-col rounded-3xl p-5 border-2 border-orange-400 shadow-xl relative">
          <div className="flex justify-center">
            <Image
              src={logo}
              alt="logo"
              width={140}
            />
          </div>
          <div className="text-red-500 flex justify-center text-[40px] my-5">{statusCode}</div>
          <div className="h-64 flex flex-col">
            <b className="flex justify-center text-[24px]">Apologies for that!</b>
            <p className="text-subtitle text-[18px] flex justify-center">Error {statusCode} has occured</p>
            <p className="text-subtitle text-[18px] flex justify-center">We will try to resolve this issue as soon as possible!</p>
          </div>
          <Link
            href="/"
            className="text-subtitle text-[16px] hover:text-[20px] hover:font-bold hover:-translate-y-[0.4rem] transition-all duration-300 flex justify-center mt-10"
          >
            Home
          </Link>
        </div>
      </div>
    </>
  );
};

Error.getInitialProps = ({res, err}: {res?: any, err?: any}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {statusCode};
};

export default Error;
