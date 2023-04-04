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
    <div className="w-full flex justify-center max-h-20">
      <nav className={`px-10 p-3 w-4/5 flex items-center justify-between bg-transparen ${black ? "text-black" : "text-white"} `}>
        <Link href="/">
          <Image
            priority
            src={logo}
            alt="logo"
            width={85}
            height={85}
          />
        </Link>
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
    </div>
  );
}
