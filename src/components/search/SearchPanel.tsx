import { useEffect, useState } from "react";

import Filter from "./Filter";
import SearchProfile from "./SearchProfile";

/**
 * 
 * @param {string} props.query query input by the user 
 * @param {string} props.role either 'student', 'tutor' or 'both'
 * @returns 
 */
export default function SearchPanel({props, users}: {props: {query?: string, role?: string}, users: any}) {

    // errors should be display if they exist
    const [error, setError] = useState<any>(null);

    const [query, setQuery] = useState<string>();
    const [role, setRole] = useState<string>()

    // in case the nav search was used
    if (props.query) setQuery(props.query)
    if (props.role) setRole(props.role)

    // this will be called by the filter to reload the results
    const search: any = (data: any) => {
        try {

        } catch (e: any) {
            setError(e);
        }
    }


    return (
        <>
        <div className="w-full flex justify-center min-h-screen">
            <div className="w-4/5 shadow-xl rounded-xl bg-white-500 mt-5 flex-col justify-center bg-orange-200">
                {error ? (
                    <div className="w-full flex justify-center bord">
                        <h1 className="text-red-500 font-bold">
                            {error}
                        </h1>
                    </div>
                ):(null)}
                <div className="flex p-2">
                    <div className="w-2/5 m-3 rounded-xl shadow bg-white">
                        {/** filter */}
                        <Filter storeState={setQuery} buttonAction={search} passedRole={role} />
                    </div>
                    <div className="w-4/5 m-3">

                        {/** loading */}
                        {users.length == 0 ? (
                            <div className="uppercase font-bold text-white">
                                No results
                            </div>
                        ) : (
                            (users.map((element: any) => {
                                return <SearchProfile user={element} />
                            }))
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}