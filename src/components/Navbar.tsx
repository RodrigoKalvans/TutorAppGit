import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import logo from "@/public/images/tcorvus-logo-transparent.png";
import profile from "@/public/images/profile-icon-transparent.png";
import MobileNavbar from "./MobileNavbar";
import {useState} from "react";

/**
 *
 * @param {any} param0 plc
 * @return {any} plc
 */
export default function Navbar({black = false}: {black?: boolean}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <nav
        className={`sticky top-0 w-full h-16 shadow bg-slate-900
        ${black ? "bg-opacity-80" : "bg-opacity-30"} text-white z-40 backdrop-blur-md`}>
        <div className="flex h-full items-center px-5 lg:px-7 xl:px-10 justify-between gap-14">
          {/* Logo */}
          <div className="basis-24">
            <Link href="/">
              <Image
                priority
                src={logo}
                alt="logo"
                width={85}
                height={85}
              />
            </Link>
          </div>

          {/** search field */}
          <div className="hidden md:flex w-full justify-between items-center">
            <div className="w-1/3">
              <NavbarSearch />
            </div>
            <span className="p-1 w-2/5 flex justify-around">
              <Link href="/feed" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Feed</Link>
              <Link href="/aboutUs" className="normal-case text-base p-2 hover:text-orange-500 transition-all">About us</Link>
              <Link href="/supportUs" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Support us</Link>
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
          <button type="button" className="md:hidden" onClick={() => {
            console.log("open");
            setIsOpen(true);
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 4.5H20.25V6H3.75V4.5ZM3.75 11.25H20.25V12.75H3.75V11.25ZM3.75 18H20.25V19.5H3.75V18Z" fill="#EEFFF6"/>
            </svg>
          </button>
        </div>
      </nav>
      <MobileNavbar handleClose={() => setIsOpen(false)} isOpen={isOpen} />
    </>
  );
}
