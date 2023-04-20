import {Session} from "next-auth";
import {MouseEventHandler, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import LanguageSelect from "../LanguageSelect";
import SubjectSelect from "../SubjectSelect";

const EditProfileModal = ({closeModal, allSubjects, user, session, userSubjects}:
   {closeModal: MouseEventHandler, allSubjects: Array<any>, user: any, session: Session | null, userSubjects: any[]}) => {
  const [selectedSubjects, setSelectedSubjects] = useState();
  const [selectedLanguages, setSelectedLanguages] = useState();
  console.log(user.priceForLessons);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const updatedUser: {
      firstName?: string,
      lastName?: string,
      description?: string,
      languages?: string[],
      phoneNumber?: string,
      priceForLessons?: Map<string, string>,
    } = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      description: event.target.about.value,
      languages: selectedLanguages,
    };

    if (user.role === "tutor") {
      updatedUser.phoneNumber = event.target.phoneNumber.value;
      const map: any = {};
      map[event.target.minutes0.value] = event.target.price0.value;

      if (event.target.minutes1.value && event.target.price1.value) {
        map[event.target.minutes1.value] = event.target.price1.value;
      }

      updatedUser.priceForLessons = map;
      console.log(map);

      const response = await fetch(`http://localhost:3000/api/tutors/${session!.user.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        if (selectedSubjects) {
          const res = await fetch("http://localhost:3000/api/subjects/subscribeTutorToSubjects", {
            method: "PUT",
            body: JSON.stringify({
              subjectIds: selectedSubjects,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const json = await res.json();
            console.log(json);
          }
        }
        window.location.reload();
      } else {
        const json = await response.json();
        console.log(json);
      }
    } else {
      const response = await fetch(`http://localhost:3000/api/students/${session!.user.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const json = await response.json();
        console.log(json);
      }
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg px-6 w-full mx-3 md:w-1/2">
        <div className="flex justify-between mt-6 pb-3 border-b-2">
          <h1 className="text-xl">Edit your profile</h1>
          <button onClick={closeModal}>
            <AiOutlineClose color="#505050" />
          </button>
        </div>

        <form className="mb-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-7 py-3 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="font-light mb-2 block">First Name</label>
              <input type="text" defaultValue={user.firstName} id="firstName" className="w-full border h-8" />
            </div>
            <div>
              <label className="font-light mb-2 block">Last Name</label>
              <input type="text" defaultValue={user.lastName} id="lastName" className="w-full border h-8" />
            </div>
            <div>
              <label className="font-light mb-2 block">Subjects</label>
              <SubjectSelect setFunction={setSelectedSubjects} subjects={allSubjects} userSubjects={userSubjects} />
            </div>
            <div>
              <label className="font-light mb-2 block">Languages</label>
              {/* <input type="text" defaultValue={user.languages} className="w-full border h-8" /> */}
              <LanguageSelect setFunction={setSelectedLanguages} userLanguages={user.languages} />
            </div>
            {user.role === "tutor" && (
              <>
                <div>
                  <label className="font-light mb-2 block">Location</label>
                  <input type="text" defaultValue={(user.location ? user.location : null)} id="location" className="w-full border h-8" />
                </div>
                <div>
                  <label className="font-light mb-2 block">Contact phone number</label>
                  <input type="tel" defaultValue={user.phoneNumber} id="phoneNumber" className="w-full border h-8" />
                </div>
                <div>
                  <label className="font-light mb-2 block">Contact email</label>
                  <input type="email" defaultValue={user.email} id="contactEmail" className="w-full border h-8" />
                </div>
                <div>
                  <label className="font-light mb-2 block">Prices</label>
                  <table className="table table-compact">
                    <thead>
                      <tr className="text-left">
                        <th className="font-light text-sm capitalize">Minutes</th>
                        <th className="font-light text-sm capitalize">Price (euro)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.keys(user.priceForLessons).map((key: string, index: number) => (
                        <tr key={index}>
                          <td><input type="number" id={`minutes${index}`} defaultValue={key} /></td>
                          <td><input type="number" id={`price${index}`} defaultValue={user.priceForLessons[key]} /></td>
                        </tr>
                      ),
                      )}

                      {(Object.keys(user.priceForLessons).length < 2) && (
                        <tr>
                          <td><input type="number" id="minutes1" /></td>
                          <td><input type="number" id="price1" /></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div>
              <label className="font-light mb-2 block">About me</label>
              <textarea rows={4} defaultValue={(user.description ? user.description : "")} maxLength={200} id="about" className="w-full border" />
            </div>
          </div>

          <div className="border-t-2">
            <button type="submit" className="btn btn-primary rounded-4xl btn-sm mt-3">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
