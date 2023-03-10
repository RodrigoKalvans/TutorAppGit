import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";

/**
 *
 * @param {any} param0 plc
 * @return {any} plc
 */
export default function Navbar({black = false}: {black?: boolean}) {
  return (
    <div className="w-full flex justify-center">
      <nav className={`navbar px-10 p-3 w-4/5 p-1 content-center flex justify-between rounded-full bg-transparent text-white ${black ? "text-black" : "text-white"} `}>
        <span className="">
          <Link href="/" className="">
            <Image
              priority
              src="/images/logo.png"
              alt="logo"
              width={20}
              height={20}
            />
          </Link>
        </span>
        {/** search field */}
        <div className="w-1/4">
          <NavbarSearch />
        </div>
        <span className="p-1 w-2/5 flex justify-between">
          <Link href="/" className="btn btn-ghost normal-case text-xl p-2">Feed</Link>
          <Link href="/" className="btn btn-ghost normal-case text-xl p-2">About us</Link>
          <Link href="/" className="btn btn-ghost normal-case text-xl p-2">Support us</Link>
        </span>
        <span className="avatar">
          <Link href="/" className="w-24 rounded-full items-center justify-center overflow-hidden">
            <Image
              src="/images/profile-icon.png"
              alt="P"
              width={16}
              height={16}
            />
          </Link>
        </span>
      </nav>
    </div>
  );
}
