import Router from "next/router";
import {useState} from "react";

export default function NavbarSearch() {
  const [query, setQuery] = useState<string>("");
  const [role, setRole] = useState<string>("both");

  const search = (e: any) => {
    Router.push({
      pathname: "/search",
      query: {
        query,
        role,
      },
    });
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={(e) => search(e)} className="form-control w-full flex-row relative text-black-800">
          <div className="relative flex items-center">
            <button type="submit" className="absolute inset-y-0 left-3">
              <svg aria-hidden="true" className="ml-3 w-5 h-5" fill="none" stroke="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <input onChange={(e) => setQuery(e.target.value)} type="search" id="search" className="w-full mr-0 pl-10 rounded-l-full bg-white-200 text-black" placeholder="Search" required>

            </input>
            <select onChange={(e) => setRole(e.target.value)} defaultValue={"both"} className="select rounded-l-none rounded-r-full max-w-fit text-black">
              <option value={"both"}>Both</option>
              <option value={"tutors"}>Tutors</option>
              <option value={"students"}>Students</option>
            </select>
          </div>
        </form>
      </div>
    </>
  );
}
