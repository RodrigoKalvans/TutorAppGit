import Button from "../button";

export default function TutorCard({id}: { id?: number }) {
  // get tutor from id

  const name: string = "Placeholder name";
  const bio: string = "Lorem ipsum bio Lorem ipsum bio Lorem ipsum bio Lorem ipsum bio Lorem ipsum bio Lorem ipsum bio Lorem ipsum bio ";
  const subject: string = "Subject";

  const followers: number = 1000;
  const following: number = 1000;

  const email: string = "example@example.com";
  const facebook: string = "examplefacebook";
  const twitter: string = "exampletwitter";

  return (
    <div className=" bg-blue-900 w-9/20 text-white rounded-xl">
      <div className="w-full flex-wrap">

        <div className="w-full flex justify-content pb-5">
          {/** image, followers and following */}
          <span className="w-1/2">
            <div className="h-64">picture</div>
            <div className="flex items-center justify-around">
              <span className="p-1">Followers: {followers}</span>
              <span className="p-1">Follwing: {following}</span>
            </div>
          </span>

          {/** description */}
          <span className="w-1/2 flex-col px-5 justify-center shadow-lg bg-blue-800 rounded-xl">
            <div className="font-bold py-4 text-xl">{name}</div>
            <div className="">{bio}</div>
            <Button style="bg-orange-600 hover:bg-orange-700 m-5">View Profile</Button>
          </span>
        </div>

        <div className="w-full flex">
          {/** subject and contact */}
          <span className="w-1/2 ml-6">
            <div className=" pt-4 pl px-10">icon<span className="text-2xl pl-5">{subject}</span></div>
            <div className="p-5 ">
              <div className="text-xl font-bold">Contact Details</div>
              <div>
                <div className="text-md"><span>icon</span>{email}</div>
                <div className="text-md"><span>icon</span>{facebook}</div>
                <div className="text-md"><span>icon</span>{twitter}</div>
              </div>
            </div>
            <Button style="bg-blue-600 hover:bg-blue-700 m-5 mb-8">Follow</Button>
          </span>

          {/** reviews */}
          <span className="w-1/2 ">

          </span>
        </div>
      </div>

    </div>
  );
}
