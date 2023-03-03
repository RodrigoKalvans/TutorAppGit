import { useEffect, useState } from "react";

/**
 * Card that displays user info on search page
 * @param {tutor or student {}} user object to be displayed in the component
 * @returns 
 */
export default function SearchProfile({user}: {user: any}) {

    const name: string = user.secondName ? `${user.firstName} ${user.secondName} ${user.lastName}` : `${user.firstName} ${user.lastName}`;
    
    const [subjects, setSubjects] = useState<any>([])

    // TODO: this needs to be changed when fields in db are renamed
    const subjectsFieldName = user.role == "student" ? user.subjectsStudied : user.subjectsOfSpecialty

    // TODO: replace with a single get that takes an array of subject ids
    const getSubjects = async () => {
        const res = await fetch(`http://localhost:3000/api/subjects`)
        const json = await res.json();

        let subs: string[] = []
        for (let i = 0; i < subjectsFieldName.length; i++) {
            for (let j = 0; j < json.length; j++) {
                if (json.at(j)._id == subjectsFieldName.at(i)) {
                    subs.push(json.at(i).name);
                }
            }
        }
        setSubjects(subs);
    }

    useEffect(() => {
        getSubjects();
    }, [])

    return (
        <>
        {/** TODO: add Link to user's profile */}
        <div className="w-full p-2">
            <div className="w-full min-w-40 max-h-40 bg-blue-100 rounded-2xl shadow flex inline-block align-middle p-2">
                {/** profile image */}
                <div className="w-1/4 flex justify-center inline-block align-middle">
                    {/** TODO: replace with profile image */}
                    <div className="">
                        image
                    </div> 
                </div>

                <div className="flex p-2 w-3/4">

                    {/** name and such */}
                    <div className="p-1 flex-col w-1/2">
                        <div className="flex-col space-between">
                            {/** name */}
                            <div className="text-xl">
                                {name}
                            </div>
                            {/** tutor or student */}
                            <div className="font-bold">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                            {/** rating */}
                            <div className="text-xs">
                                {user.rating.number}/5
                            </div>
                            {/** location */}
                            <div className="text-xs">
                                {user.location}
                            </div>
                            {/** followers */}
                            <div className="text-xs">
                                {user.followers.length} followers
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-around w-1/2 text-lg">
                        {/** languages */}
                        <div className="">
                            {user.languages ? user.languages.map((language: string) => (
                                <div className="">
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </div>
                            )) : null}
                        </div>
                        {/** subjects */}
                        {/** TODO fix displaying before data is fetched */}
                        <div className="">
                            {subjects.length > 0 && subjects.map((subject: any) => (
                                <div className="">  
                                    {subject}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}
