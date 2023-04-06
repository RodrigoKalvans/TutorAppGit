import {useRouter} from "next/router";
import {useState} from "react";
import TutorsIcon from "@/public/icons/tutors.svg";
import EveryoneIcon from "@/public/icons/everyone.svg";
import Image from "next/image";

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
  const [query, setQuery] = useState<string>(""); // currently this is assumed to be first name
  const [role, setRole] = useState<string>("tutors");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const search = (e: any) => {
    const toSearch: TQuery = {
      role: role,
      firstName: query,
      lastName: undefined,
      rating: undefined,
      subjects: undefined,
    };
    router.push({
      pathname: `/search/${router.asPath}`,
      query: toSearch,
    });
  };

  const arrowSvg = <svg aria-hidden="true" className={`w-4 h-4 ml-1 transition-all ${isOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>;

  return (
    <>
      <form onSubmit={(e) => search(e)} className="form-control w-full text-black-800">
        <div className="relative flex items-center h-10">
          <button type="submit" className="absolute inset-y-0">
            <svg aria-hidden="true" className="ml-3 w-5 h-5" fill="none" stroke="grey" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <input onChange={(e) => setQuery(e.target.value)} type="search" id="search" className="w-full h-full mr-0 pl-10 rounded-full bg-white-200 text-black focus:outline-none" placeholder="Search" required />
          {/* <select onChange={(e) => setRole(e.target.value)} defaultValue={"tutors"} className={"absolute right-0 select min-h-0 h-full px-5 rounded-full max-w-fit bg-[#3F678A] bg-opacity-90 text-light font-normal black focus:outline-none"}>
            <option className="bg-light text-current rounded-lg" value={"both"}>Both</option>
            <option className="bg-light text-current rounded-lg" value={"tutors"} selected>Tutors</option>
            <option className="bg-light text-current rounded-lg" value={"students"}>Students</option>
          </select> */}

          <button type="button" id="dropdownBtn" onClick={() => setIsOpen(!isOpen)} className="capitalize absolute right-0 min-h-0 h-full px-5 rounded-full max-w-fit bg-[#3F678A] bg-opacity-90 text-light font-normal black focus:outline-none flex items-center
          hover:bg-opacity-[0.85] transition-all focus:bg-opacity-100">
            {role} {arrowSvg}
          </button>

          {isOpen && (
            <div
              className="absolute right-0 top-10 mt-2 flex flex-col bg-light w-50 transition-all rounded-lg shadow"
              onBlur={() => setIsOpen(false)}>
              <ul className="list-none">
                <li>
                  <button type="button" className="text-current flex items-center gap-3 p-3 hover:bg-gray-200 transition-all w-full rounded-t-lg" onClick={() => setRole("tutors")} value={"tutors"}>
                    <Image src={TutorsIcon} alt="Tutors icon" width={25} height={25}></Image>
                    <div className="text-left">
                      <p className="text-sm p-0 m-0">Tutors</p>
                      <p className="text-[10px] leading-none p-0 m-0">Search amongst tutors only</p>
                    </div>
                  </button>
                </li>
                <li>
                  <button type="button" className="text-current flex items-center gap-3 p-3 hover:bg-gray-200 transition-all w-full rounded-b-lg" onClick={() => setRole("both")} value={"both"}>
                    <Image src={EveryoneIcon} alt="Everyone icon" width={25} height={25}></Image>
                    <div className="text-left">
                      <p className="text-sm p-0 m-0">Both</p>
                      <p className="text-[10px] leading-none p-0 m-0">Search amongst all users</p>
                    </div>
                  </button>

                </li>
              </ul>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
