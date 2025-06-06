import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import MobileNavbar from "./MobileNavbar";
import {useState} from "react";
import useSWR from "swr";
import {signOut, useSession} from "next-auth/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Navbar component
 * @param {boolean} black will determine a change in style for the lighter pages
 * @return {JSX} Navbar
 */
const Navbar = ({
  black = false,
} : {
  black?: boolean
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {data: session} = useSession();

  const {data: avatar} = useSWR(
    (session && session.user.picture) ? `/api/${session.user.role}s/${session.user.id}/picture?key=${session.user.picture}` : null,
    fetcher,
  );

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
                src={"/logo.png"}
                alt="logo"
                width={70}
                height={70}
              />
            </Link>
          </div>

          {/** search field */}
          <div className="hidden md:flex w-full justify-between items-center">
            <div className="w-1/3">
              <NavbarSearch />
            </div>
            <span className="p-1 w-2/5 flex justify-around">
              <Link href="/feed" className="nav-link">Feed</Link>
              <Link href="/about" className="nav-link">About us</Link>
              <Link href="/support" className="nav-link">Support us</Link>
            </span>

            {/** Avatar */}
            {session ? (
                <div className="dropdown dropdown-end">
                  <span className="avatar cursor-pointer">
                    <div tabIndex={0} className="w-[45px] mt-1 flex items-center justify-center rounded-full">
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
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-orange-400  text-white rounded-box w-52 z-50">
                    <li><Link href={`/${session.user.role}s/${session.user.id}`}>Profile</Link></li>
                    <li><div onClick={async () => await signOut()}>Logout</div></li>
                  </ul>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/auth/signin" className="hover:opacity-80 focus:opacity-70 transition-all">
                    Log in
                  </Link>
                  <Link href="/auth/signup" className="btn btn-sm border-none blue capitalize rounded-4xl font-normal">
                    Sign up
                  </Link>
                </div>
              )}
          </div>
          <button type="button" className="md:hidden" onClick={() => {
            setIsOpen(true);
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 4.5H20.25V6H3.75V4.5ZM3.75 11.25H20.25V12.75H3.75V11.25ZM3.75 18H20.25V19.5H3.75V18Z" fill="#EEFFF6"/>
            </svg>
          </button>
        </div>
      </nav>
      <MobileNavbar handleClose={() => setIsOpen(false)} isOpen={isOpen} avatar={avatar} />
    </>
  );
};

export default Navbar;
