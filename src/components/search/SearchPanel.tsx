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
  // TODO: types
  const [profiles, setProfiles] = useState<any>();

  const [error, setError] = useState<any>();

  const router: NextRouter = useRouter();

  // this will be called by the filter to reload the results
  const filter = async () => {
    // TODO: type
    let filteredUsers: any[] = [];

    // filter users
    switch (router.query.role) {
      // must end with 's': 'students' or 'tutors'
      case "students": {
        console.log("students");
        filteredUsers = filterArrayBasedOnQuery(students, router.query);
        break;
      }
      case "tutors": {
        console.log("tutors");
        filteredUsers = filterArrayBasedOnQuery(tutors, router.query);
        break;
      }
      case "both": {
        console.log("both");
        const temp = tutors;
        temp.push(...students);
        filteredUsers = filterArrayBasedOnQuery(temp, router.query);
        break;
      }
      default: {
        setError(Error("Invalid role"));
      }
    }

    setProfiles(filteredUsers);
  };

  useEffect(() => {
    console.log("search panel useEffect");
    filter();
    return () => {
      setError(null);
      setProfiles(null);
    };
  }, []);

  return (
    <>
      <div className="w-full flex justify-center min-h-screen ">
        <div className="w-4/5 rounded-xl bg-white-500 mt-5 flex-col justify-center">
          <div className="w-full flex justify-center">
            <h1 className="text-red-500 font-bold">
              {!profiles && error && `${error}`}
            </h1>
          </div>
          <div className="flex p-2">
            <div className="w-2/5 m-3">
              {/** filter */}
              <Filter subjects={subjects} action={filter} />
            </div>

            <div className="w-4/5 min-h-fit m-3 ">
              <div className="overflow-auto max-h-screen rounded-3xl p-0">
                {/** profiles */}
                {profiles ? (profiles.map((item: any) => (
                  <SearchProfile user={item} subjects={subjects} />
                ))) : (
                  <div className="w-full flex justify-center">
                    <div className="w-fit m-2 mt-5 uppercase text-xl">
                      Not found
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// TODO: types
/**
 * This is called when searching via the filter or nav bar
 * @param {user[]} arr array to be filtered
 * @param {user} query filter to apply to array
 * @return {user[]} filtered array
 */
function filterArrayBasedOnQuery(arr: any[], query: any) {
  console.log("filter function called", arr, query);

  // TODO: type
  const filteredArr: any = [];

  // filter arr using query
  try {
    for (let i = 0; i < arr.length; i++) { // make this dynamic
      if (query.firstName && query.firstName !== "" && arr.at(i).firstName.toLowerCase().includes(query.firstName.toLowerCase())) filteredArr.push(arr.at(i));
      else if (query.lastName && query.lastName !== "" && arr.at(i).lastName.toLowerCase().includes(query.lastName.toLowerCase())) filteredArr.push(arr.at(i));
      else if (query.rating && arr.at(i).rating.number == query.rating) filteredArr.push(arr.at(i));

      // add this in when field names are corrected in db
      // else if (query.subjects && query.subjects.length > 0) {
      //   for (let j = 0; j < query.subjects.length; j++) {
      //     for (let k = 0; k < arr.at(i).subjects.length; k++) {
      //       if (query.subjects.at(j) == arr.at(i).subjects.at(k)) filteredArr.push(arr.at(i));
      //     }
      //   }
      // }
      // else if (query.languages && query.languages.length > 0) {

      // }
    }
  } catch (e) {
    throw Error(`error ${e}`);
  }

  if (filteredArr.length == 0) return null; // in case no results are found

  return filteredArr;
}
