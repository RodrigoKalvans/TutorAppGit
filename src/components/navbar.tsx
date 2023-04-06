import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import logo from "@/public/images/tcorvus-logo-transparent.png";
import profile from "@/public/images/profile-icon-transparent.png";

/**
 *
 * @param {any} param0 plc
 * @return {any} plc
 */
export default function Navbar({black = false}: {black?: boolean}) {
  return (

    <nav className={`w-full py-2 flex items-center justify-around bg-transparent shadow ${black ? "text-black" : "text-white"} `}>
      <span className="">
        <Link href="/">
          <Image
            priority
            src={logo}
            alt="logo"
            width={85}
            height={85}
          />
        </Link>
      </span>
      {/** search field */}
      <div className="w-1/4">
        <NavbarSearch />
      </div>
      <span className="p-1 w-2/5 flex justify-around">
        <Link href="/" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Feed</Link>
        <Link href="/" className="normal-case text-base p-2 hover:text-orange-500 transition-all">About us</Link>
        <Link href="/" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Support us</Link>
      </span>
      <span className="avatar">
        <Link href="/" className="w-8 rounded-full items-center justify-center overflow-hidden">
          <Image
            src={profile}
            alt="profile"
            width={1}
            height={1}
          />
        </Link>
      </span>
    </nav>
  );
}
