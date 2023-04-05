import {NextRouter, useRouter} from "next/router";
import {useEffect, useState} from "react";

import Filter from "./Filter";
import SearchProfile from "./SearchProfile";

// this should be moved to a 'types' file or something
// type TQuery = {
//   role: string,
//   firstName: string | undefined,
//   lastName: string | undefined,
//   rating: number | undefined,
//   subjects: string[] | undefined,
// }

/** TODO: correct this
 * @param {string} props.query query input by the user
 * @param {string} props.role either 'student', 'tutor' or 'both'
 * @return {any} plc
 */
export default function SearchPanel({subjects, students, tutors}: {subjects: any, students: any, tutors: any}) {
  const [profiles, setProfiles] = useState<any>(); // these will be displayed

  const router: NextRouter = useRouter();

  const search = (filt: any) => {
    setProfiles(filter(filt));
  };

  const filter = (f: any | undefined) => {
    const arr = [...tutors, ...students];
    if (f == undefined) f = router.query; // in case we got here from the navbar
    const keys = Object.keys(f); // keys in the filter (eg  { firstName: "john" } )
    return arr.filter((user: any) => { // do the following on every user object
      return keys.every((key: any) => {
        if (f[key] == undefined || f[key].length == 0) return true; // no value present in filter field
        if (key == "role" && f[key] == "both") return true; // handle role == "both"
        if (key == "rating") return f[key] == user[key].number; // rating is a number
        if (Array.isArray(user[key])) return f[key].every((val: any) => user[key].includes(val)); // every value in filter must be present in user
        return user[key].toLowerCase().includes(f[key].toLowerCase());
      });
    });
  };

  useEffect(() => {
    if (Object.keys(router.query).length !== 0) setProfiles(filter(router.query));
    else setProfiles(filter(undefined));

    return () => {
      setProfiles(null);
    };
  }, [router.query]);

  return (
    <>
      <div className="w-full flex justify-center min-h-screen ">
        <div className="w-4/5 rounded-xl bg-white-500 mt-5 flex-col justify-center">
          <div className="flex p-2">
            <div className="w-2/5 m-3">
              {/** filter */}
              <Filter subjects={subjects} action={search} />
            </div>

            <div className="w-4/5 min-h-fit m-3 ">
              <div className="overflow-auto max-h-screen rounded-3xl p-0">
                {/** profiles */}
                {profiles && (profiles.map((user: any) => (
                  <SearchProfile user={user} key={user._id}/>
                ))) }
                {profiles && profiles.length === 0 &&
                  <div className="w-full flex justify-center">
                    <div className="w-fit m-2 mt-5 uppercase text-xl">
                      no profiles found
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
