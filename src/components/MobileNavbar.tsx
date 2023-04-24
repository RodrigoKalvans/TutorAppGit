import Link from "next/link";
import {MouseEventHandler} from "react";
import NavbarSearch from "./NavbarSearch";

const MobileNavbar = ({handleClose, isOpen}: {handleClose: MouseEventHandler, isOpen: boolean}) => {
  return (
    <div className={`pt-12 fixed inset-0 z-50 overflow-y-auto overscroll-y-none max-w-full max-h-screen bg-[#2c4e6b] transition-all duration-500 ${isOpen ? "opacity-100 translate-x-[0%]" : "opacity-0 -translate-x-full transition-all duration-500"}`} >
      <button
        className="absolute top-6 right-6 select-none"
        onClick={handleClose}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.65674 6.34314L12.0207 12.7071L6.36384 18.364" stroke="#EEFFF6" strokeWidth="1.5"/>
          <path d="M18.364 18.7279L12.0001 12.3639L18.364 5.99998" stroke="#EEFFF6" strokeWidth="1.5"/>
        </svg>
      </button>

      <div className="flex flex-col px-6 py-10 gap-20">
        <ul className="list-none text-white text-2xl space-y-7">
          <li>
            <Link href="/feed" className="normal-case p-2 hover:text-orange-500 transition-all">Feed</Link>
          </li>
          <li>
            <Link href="/aboutUs" className="normal-case p-2 hover:text-orange-500 transition-all">About us</Link>
          </li>
          <li>
            <Link href="/supportUs" className="normal-case p-2 hover:text-orange-500 transition-all">Support us</Link>
          </li>
        </ul>

        <NavbarSearch />
      </div>
    </div>
  );
};

export default MobileNavbar;
