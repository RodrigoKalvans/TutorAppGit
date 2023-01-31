import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar px-10 p-3 w-4/5 p-1 content-center flex justify-between rounded-full bg-transparent text-white">
      <span className="">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <Image
            priority
            src="/images/logo.png"
            alt="logo"
            width={20}
            height={20}
          />
        </Link>
      </span>
      <span className="form-control w-1/5 pl-3 flex-row relative text-black-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="search" id="search" className="block w-full p-3 pl-10 rounded-full bg-white-200 text-black" placeholder="Search" required></input>
          <button type="submit" className="text-white absolute right-2.5 bottom-2 bg-blue-700 hover:bg-blue-800 focus:bg-blue-900 font-medium rounded-full text-sm px-4 py-2 ">Search</button>
        </div>
      </span>

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
