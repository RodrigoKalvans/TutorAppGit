import {NextRouter, useRouter} from "next/router";
import {useEffect, useState} from "react";

import Filter from "./Filter";
import SearchProfile from "./SearchProfile";
import useSWR from "swr";

type TQuery = {
  role: string,
  firstName: string | undefined,
  lastName: string | undefined,
  rating: number | undefined,
  subjects: string[] | undefined,
}

const requestUsers = () => {


  //   if (router.query.role == "both") {
  //     console.log("yo");
  //     const tempUsers = [];
  //     const resTutors: SWRResponse = useSWR("/api/tutors", fetcher);
  //     if (resTutors.data) tempUsers.push(resTutors.data);
  //     if (resTutors.error) setError(resTutors.error);
  //     if (resTutors.isLoading) setLoading(resTutors.isLoading);

  //     const resStudents: SWRResponse = useSWR("/api/students", fetcher);
  //     if (resStudents.data) tempUsers.push(resStudents.data);
  //     if (resStudents.error) setError(resStudents.error);
  //     if (resStudents.isLoading) setLoading(resStudents.isLoading);
  //     console.log(resStudents);

//     setUsers(tempUsers);
//   } else if (filter.role === "students" || filter.role === "tutors") {
//     console.log("ye");
//     const resUsers: SWRResponse = useSWR(`/api/${filter.role}`, fetcher);
//     if (resUsers.data) setUsers(resUsers.data);
//     if (resUsers.error) setError(resUsers.error);
//     if (resUsers.isLoading) setLoading(resUsers.isLoading);
//   } else {
//     throw Error("Unknown role in filter object");
//   }
// } catch (e: any) {
//   setError(e);
// }
};

/** TODO: correct this
 * @param {string} props.query query input by the user
 * @param {string} props.role either 'student', 'tutor' or 'both'
 * @return {any} plc
 */
export default function SearchPanel({subjects}: {subjects: any}) {
  // errors should be display if they exist
  const [err, setError] = useState<any>();

  // TODO: types
  const [loading, setLoading] = useState<boolean>();
  const [users, setUsers] = useState<any>();

  const [role, setRole] = useState<string>("both");

  // used for SWR
  const router: NextRouter = useRouter();

  const fetcher = (url: string) => fetch(url, {}).then((res) => res.json());
  const resUsers = useSWR("/api/tutors", fetcher);

  // this will be called by the filter to reload the results
  const search = async (filter: TQuery) => {
    setRole(filter.role);
    console.log("search called");

    router.push({
      query: filter,
    });

    console.log("router query", router.query);
    console.log("router path", router.asPath);
    console.log("users", users);

    setUsers(requestUsers());

    // TODO: make this into something that is not shit
  };

  const handleFilterSubmit = (filterQuery: TQuery) => {
    search(filterQuery);
  };

  useEffect(() => {
    const temp: TQuery = {
      role: role,
      firstName: "",
      lastName: "",
      rating: 0,
      subjects: [],
    };
    if (router.query.query !== undefined || router.query.role !== undefined) {
      // in case the nav search was used ---- assume query is firstName
      temp.firstName = router.query.query;
      temp.role = router.query.role;
      console.log("nav has a query");
    }
    search(temp);
  }, []);

  return (
    <>
      <div className="w-full flex justify-center min-h-screen ">
        <div className="w-4/5 rounded-xl bg-white-500 mt-5 flex-col justify-center">
          <div className="w-full flex justify-center">
            <h1 className="text-red-500 font-bold">
              {err && ("Error")}
            </h1>
          </div>
          <div className="flex p-2 overflow-auto">
            <div className="w-2/5 m-3">
              {/** filter */}
              <Filter buttonAction={handleFilterSubmit} passedRole={role} subjects={subjects} />
            </div>

            <div className="w-4/5 min-h-fit m-3 ">
              <div className="overflow-auto max-h-screen rounded-3xl p-0">
                {loading && ("Loading...")}
                {/** profiles */}
                {resUsers.data && resUsers.data.map((user: any) => (
                  <SearchProfile user={user} subjects={subjects} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
