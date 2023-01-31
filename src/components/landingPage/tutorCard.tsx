import Button from "../button";

export default function TutorCard({ id }: { id?: number }) {
  // get tutor from id
  const name: string = "Illya Brodovskyy";
  const bio: string = "Lorem ipsum bio";
  const subject: string = "subject";

  const followers: number = 1000;
  const following: number = 1000;


  return (
    <div className="bord bg-blue-900 w-2/5 text-white">
      {/**
         * 2 top section
         */}
      <div className="p-2 w-full flex">

        {/**
             * image, followers and following
             */}
        <div className="w-1/2 bord">
                picture
          <div className="flex items-center justify-around">
            <span className="p-1">Followers: {followers}</span>
            <span className="p-1">Follwing: {following}</span>
          </div>
        </div>

        {/**
             * description
             */}
        <div className="w-1/2 bord">
          {name}
          <br/>
          {bio}
          <br/>
          <Button style="bg-orange-600">View Profile</Button>
        </div>

        {/**
             * subject and contact
             */}
        <div className="bord w-1/2">
            {subject}
          <Button style="bg-blue-600" >Follow</Button>
        </div>

        {/**
             * reviews
             */}
        <div className="bord w-1/2">

        </div>
      </div>

    </div>
  );
}
