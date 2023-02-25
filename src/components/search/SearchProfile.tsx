
/**
 * 
 * @param {tutor or student {}} user object to be displayed in the component
 * @returns 
 */
export default function SearchProfile({user}: {user: any}) {

    const name: string = user.secondName ? `${user.firstName} ${user.secondName} ${user.lastName}` : `${user.firstName} ${user.lastName}`;
    
    // fetch subjects that the user is linked to
    // placeholder
    const subjects: string[] = ['someid', 'someid2'];
    const languages: string[] = ['english', 'spanish'];

    return (
        <>
        {/** TODO: add Link to user's profile */}
        <div className="w-full p-2">
            <div className="w-full min-w-40 bg-blue-100 rounded-2xl shadow-2xl flex inline-block align-middle p-2">
                {/** profile image */}
                <div className="w-1/4 flex justify-center inline-block align-middle">
                    {/** TODO: replace with profile image */}
                    <div className="">
                        image
                    </div>
                </div>

                <div className="flex p-2 w-3/4">

                    {/** name and such */}
                    <div className="p-1 flex-col w-1/2 ">
                        <div className="flex-col space-between">
                            {/** name */}
                            <div className="w-1/2 text-xl">
                                {name}
                            </div>
                            {/** tutor or student */}
                            <div className="w-1/2 font-bold">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                            {/** rating */}
                            <div className="w-1/2 text-xs">
                                {user.rating.number}/5
                            </div>
                            {/** location */}
                            <div className="w-1/2 text-xs">
                                location
                            </div>
                            {/** followers */}
                            <div className="text-xs">
                                {user.length}testnumber followers
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-around w-1/2">
                        {/** languages */}
                        <div className="text-lg">
                            {languages.map((language) => (
                                <div className="">
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </div>
                            ))}
                        </div>
                        {/** subjects */}
                        <div className="text-lg">
                            {subjects.map((subject) => (
                                <div className="">
                                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
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
