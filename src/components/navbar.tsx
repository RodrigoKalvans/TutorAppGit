import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar px-10 p-3 w-4/5 p-1 content-center flex justify-between rounded-full bg-transparent text-white">
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
      <form className="form-control w-1/4 flex-row relative text-black-800">
        <div className="relative flex items-center">
            <button type="submit" className="absolute inset-y-0 left-3">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
          <input type="search" id="search" className="block z-4 w-4/5 p-3 pl-10 rounded-full bg-white-200 text-black" placeholder="Search" required></input>
          <select className="select max-w-fit text-black">
            <option selected>Both</option>
            <option>Tutors</option>
            <option>Students</option>
          </select>
        </div>
      </form>

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
  );
}
