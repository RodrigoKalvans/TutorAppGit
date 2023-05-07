import Image from "next/image";
import Link from "next/link";
import NavbarSearch from "./NavbarSearch";
import logo from "@/public/images/tcorvus-logo-transparent.png";
import MobileNavbar from "./MobileNavbar";
import {useState} from "react";
import useSWR from "swr";
import {ProfileIcon} from "@/utils/icons";
import {signOut, useSession} from "next-auth/react";
import ProfilePicture from "./profilePage/helpingComponents/ProfilePicture";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Navbar
 * @param {any} param0 plc
 * @return {any} plc
 */
const Navbar = ({black = false}: {black?: boolean}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const {data: session, status} = useSession();

  const {data} = useSWR(
    (session?.user && status === "authenticated") ? `/api/${session.user.role}s/${session.user.id}` : null,
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
              <Link href="/about" className="normal-case text-base p-2 hover:text-orange-500 transition-all">About us</Link>
              <Link href="/support" className="normal-case text-base p-2 hover:text-orange-500 transition-all">Support us</Link>
            </span>

            {/** Avatar */}
            {status == "authenticated" && data ? (
                  <div className="dropdown dropdown-end">
                    <span className="avatar relative cursor-pointer" onClick={() => setDropdown(!dropdown)}>
                      <div tabIndex={0} className="w-[45px] mt-1 flex items-center justify-center rounded-full border-2 border-orange-400">
                        <ProfilePicture user={data} />
                      </div>
                    </span>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-orange-400  text-white rounded-box w-52 z-50">
                      <li><Link href={`/${session.user.role}s/${session.user.id}`}>Profile</Link></li>
                      <li><div onClick={async () => await signOut()}>Logout</div></li>
                    </ul>
                  </div>
                  ) : (
                    <span className="avatar relative cursor-pointer">
                      <Link href={"/signin"}>
                        <ProfileIcon className="text-[32px] text-orange-400" />
                      </Link>
                    </span>
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
      <MobileNavbar handleClose={() => setIsOpen(false)} isOpen={isOpen} />
    </>
  );
};

export default Navbar;
