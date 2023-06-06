import Link from "next/link";
import Image from "next/image";
import {MouseEventHandler} from "react";
import NavbarSearch from "./NavbarSearch";
import {signOut, useSession} from "next-auth/react";

const MobileNavbar = ({handleClose, isOpen, avatar}: {handleClose: MouseEventHandler, isOpen: boolean, avatar: any}) => {
  const {data: session} = useSession();

  return (
    <div className={`pt-12 fixed inset-0 z-50 overflow-y-auto overscroll-y-none max-w-full h-screen max-h-screen bg-[#2c4e6b] transition-all duration-500 ${isOpen ? "opacity-100 translate-x-[0%]" : "opacity-0 -translate-x-full transition-all duration-500"}`} >
      <button
        className="absolute top-6 right-6 select-none"
        onClick={handleClose}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.65674 6.34314L12.0207 12.7071L6.36384 18.364" stroke="#EEFFF6" strokeWidth="1.5"/>
          <path d="M18.364 18.7279L12.0001 12.3639L18.364 5.99998" stroke="#EEFFF6" strokeWidth="1.5"/>
        </svg>
      </button>

      <div className="flex flex-col px-6 py-10 gap-10 h-full">
        <NavbarSearch />

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

        {/** Avatar */}
        {session ? (
          <div className="flex flex-col mt-auto gap-4 text-center">
            <Link href={`/${session.user.role}s/${session.user.id}`}>

              <span className="avatar cursor-pointer">
                <div className="avatar w-24 mt-1 flex items-center justify-center rounded-full">
                  {avatar && avatar.presignedUrl ? (
                  <Image src={avatar.presignedUrl} alt="profile image" width={100} height={100} />
                ) : (
                  <div className="avatar placeholder w-full aspect-square">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-full">
                      <span className="text-2xl">{session.user.firstName[0]}</span>
                    </div>
                  </div>
                )}
                </div>
              </span>
            </Link>

            <button type="button" onClick={async () => await signOut()} className="text-gray-300 text-xl hover:opacity-80 focus:opacity-70 transition-all">Logout</button>
          </div>
        ) : (
          <div className="flex flex-col mt-auto gap-4 text-center">
            <Link href="/auth/signin" className="text-white text-xl hover:opacity-80 focus:opacity-70 transition-all">
            Log in
            </Link>
            <Link href="/auth/signup" className="btn btn-md border-none blue capitalize rounded-4xl font-normal text-xl">
            Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;
