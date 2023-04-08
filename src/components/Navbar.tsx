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

    // It is fixed for now, but it should be sticky. With fixed position the navbar is removed from
    // the layer, so other elements do not see it and go up. Therefore, it causes the navbar to cover the elements all the time
    // The solution would be to use sticky, as with sticky position the navbar is not removed from the common with other elements "layer"
    <>
      <div className="h-16 w-full"></div>
      <nav className={`fixed top-0 w-full h-16 py-2 shadow bg-slate-900 ${black ? "bg-opacity-80" : "bg-opacity-30"} text-white z-50 backdrop-blur-md`}>
        <div className="flex items-center justify-around">
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
            <Link href="/feed" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Feed</Link>
            <Link href="/aboutus" className="normal-case text-base p-2 hover:text-orange-500 transition-all">About us</Link>
            <Link href="/supportus" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Support us</Link>
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
        </div>
      </nav>
    </>
  );
}
