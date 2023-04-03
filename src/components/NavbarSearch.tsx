import {NextRouter, useRouter} from "next/router";
import {useRef, useState} from "react";

type TQuery = {
  role: string,
  firstName: string | undefined,
  lastName: string | undefined,
  rating: number | undefined,
  subjects: string[] | undefined,
}

/**
 * yo
 * @return {any} yo
 */
export default function NavbarSearch() {
  const [role, setRole] = useState<string>("tutor");

  const router: NextRouter = useRouter();

  const search = (e: any) => {
    e.preventDefault();
    if (!e.target[1].value) e.target[1].value = ""; // just in case something goes wrong, pass empty string
    const toSearch: any = {
      role: role,
      firstName: e.target[1].value,
    };
    router.push({
      pathname: "/search",
      query: toSearch,
    });
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={(e) => search(e)} className="form-control w-full flex-row relative text-black-800">
          <div className="relative flex items-center">
            <button type="submit" className="absolute inset-y-0">
              <svg aria-hidden="true" className="ml-3 w-5 h-5" fill="none" stroke="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <input type="search" id="search" className="w-full mr-0 pl-10 rounded-l-full bg-white-200 text-black" placeholder="Search" required>

            </input>
            <select onChange={(e) => setRole(e.target.value)} defaultValue={"tutors"} className={"select rounded-l-none rounded-r-full max-w-fit text-black"}>
              <option value={"tutor"}>Tutors</option>
              <option value={"student"}>Students</option>
              <option value={"both"}>Both</option>
            </select>
          </div>
        </form>
      </div>
    </>
  );
}
