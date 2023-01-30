import Button from "./button";

export default function TutorCard(id: number = 0) {
  // get tutor from id
  var name: string = "Illya Brodovskyy";
  var bio: string = "Lorem ipsum bio";
  var subject: string = "subject";

  var followers: number = 1000;
  var following: number = 1000;


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
                <Button text="View Profile" color="orange" link="/" />
            </div>

            {/**
             * subject and contact
             */}
            <div className="bord w-1/2">
                <Button text="Follow" color="blue" link="/" />
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
