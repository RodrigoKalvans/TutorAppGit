import Filter from "./Filter";
import SearchProfile from "./SearchProfile";
import useSWR from 'swr'
import { useState } from "react";

/**
 * 
 * @param {string} props.query query input by the user 
 * @param {string} props.role either 'student', 'tutor' or 'both'
 * @returns 
 */
export default function SearchPanel({props, filterSubjects}: {props: {query?: string, role?: string}, filterSubjects: any}) {

    // errors should be display if they exist
    const [err, setError] = useState<any>();

    const [query, setQuery] = useState<any>();
    const [role, setRole] = useState<string>("tutors")

    // in case the nav search was used
    if (props.query) setQuery(props.query)
    if (props.role) setRole(props.role)

    // this will be called by the filter to reload the results
    const search: any = () => {
        try {

            console.log("SearchPanel", query);

        } catch (e: any) {
            setError(e);
        }
    }


    // request users
    const fetcher = (url: string) => fetch(url, {
        
    }).then(res => res.json())
    const { data, error, isLoading } = useSWR(`/api/${role}`, fetcher)
    
    if (error) setError(error);

    return (
        <>
        <div className="w-full flex justify-center min-h-screen">
            <div className="w-4/5 shadow-xl rounded-xl bg-white-500 mt-5 flex-col justify-center bg-orange-200">
                {err && (
                    <div className="w-full flex justify-center">
                        <h1 className="text-red-500 font-bold">
                            {err}
                        </h1>
                    </div>
                )}
                <div className="flex p-2">
                    <div className="w-2/5 m-3 rounded-xl shadow bg-white">
                        {/** filter */}
                        <Filter storeQueryStateFunction={(data: any) => setQuery(data)} buttonAction={() => search()} passedRole={role} subjects={filterSubjects} />
                    </div>

                    <div className="w-4/5 m-3">

                        {isLoading && ("Loading...")}

                        {data && data.map((user: any) => (
                            <SearchProfile user={user} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}