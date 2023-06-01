import {Session} from "next-auth";
import {MouseEventHandler, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import LanguageSelect from "../LanguageSelect";
import SubjectSelect from "../SubjectSelect";
import {useRouter} from "next/router";
import {signOut} from "next-auth/react";
import useSWR from "swr";
import {LoadingIcon} from "@/utils/icons";

/**
 * This component is mounted whenever the user tries to edit their profile details from their profile page
 * @param {MouseEventHandler} closeModal
 * @param {Array<any>} allSubjects
 * @param {any} user
 * @param {Session | null} session
 * @param {Array<any>} userSubjects
 * @return {JSX}
 */
const EditProfileModal = ({
  closeModal,
  user,
  session,
  userSubjects,
} : {
  closeModal: MouseEventHandler,
  user: any,
  session: Session | null,
  userSubjects: Array<any>,
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState();
  const [selectedLanguages, setSelectedLanguages] = useState();
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const router = useRouter();

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const {data: allSubjects, isLoading} = useSWR("/api/subjects", fetcher);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const updatedUser: {
      firstName?: string,
      lastName?: string,
      description?: string,
      languages?: string[],
      phoneNumber?: string,
      contactEmail?: string,
      priceForLessons?: Map<string, string>,
      location?: string,
      isOnlineAvailable?: boolean,
    } = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      description: event.target.about.value,
      languages: selectedLanguages,
    };

    if (user.role === "tutor") {
      updatedUser.location = event.target.location.value;

      updatedUser.phoneNumber = event.target.phoneNumber.value;
      updatedUser.contactEmail = event.target.contactEmail.value;

      const map: any = {};
      map[event.target.minutes0.value] = event.target.price0.value;

      if (event.target.minutes1.value && event.target.price1.value) {
        map[event.target.minutes1.value] = event.target.price1.value;
      }

      updatedUser.priceForLessons = map;

      if (isOnlineAvailable) {
        updatedUser.isOnlineAvailable = true;
      }
    }

    const response = await fetch(`/api/${session!.user.role}s/${session!.user.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      if (selectedSubjects) {
        const res = await fetch("/api/subjects/subscribeUserToSubjects", {
          method: "PUT",
          body: JSON.stringify({
            subjectIds: selectedSubjects,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const {message} = await res.json();
          setError(message);
        }
      }
      window.location.reload();
    } else {
      const {message} = await response.json();
      setError(message);
    }
  };

  const deleteProfile = async () => {
    if (!session) return;

    const res = await fetch(`/api/${user.role}s/${user._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await signOut();
      router.push("/");
    } else if (res.status === 401) {
      setError("You have to log in first to delete the account");
    } else if (res.status === 404) {
      setError("Your profile was not found. If you are still logged in to your account, please log out");
    }
  };

  return (
    <>
      <div className="modal-container">
        <div className="modal-content-box">
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
                {isLoading ? (
                  <LoadingIcon className="animate-spin" />
                ) : (
                  <SubjectSelect setSubjectsState={setSelectedSubjects} subjects={allSubjects} userSubjects={userSubjects} />
                )}
              </div>
              <div>
                <label className="font-light mb-2 block">Languages</label>
                {/* <input type="text" defaultValue={user.languages} className="w-full border h-8" /> */}
                <LanguageSelect setLanguagesState={setSelectedLanguages} userLanguages={user.languages} />
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
                    <input type="email" defaultValue={user.contactEmail ? user.contactEmail : user.email} id="contactEmail" className="w-full border h-8" />
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
                            <td>
                              <input type="number" id={`minutes${index}`} defaultValue={key} className="w-full" />
                            </td>
                            <td>
                              <input type="number" id={`price${index}`} defaultValue={user.priceForLessons[key]} className="w-full" />
                            </td>
                          </tr>
                        ),
                        )}

                        {(Object.keys(user.priceForLessons).length < 2) && (
                          <tr>
                            <td><input type="number" id="minutes1" className="w-full" /></td>
                            <td><input type="number" id="price1" className="w-full" /></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2">
                    <input type="checkbox" id="online" checked={user.isOnlineAvailable} onChange={() => setIsOnlineAvailable(!isOnlineAvailable)} />
                    <label className="font-normal capitalize">Online lessons available</label>
                  </div>
                </>
              )}

              <div>
                <label className="font-light mb-2 block">About me</label>
                <textarea rows={4} defaultValue={(user.description ? user.description : "")} maxLength={200} id="about" className="w-full border" />
              </div>
            </div>

            <div className="border-t-2 flex justify-between">
              <button
                type="submit"
                className="btn btn-primary rounded-4xl btn-sm mt-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="opacity-60 hover:opacity-100 hover:text-red-600 transition-all underline mt-3"
                onClick={() => setOpen(true)}
              >
              Delete profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {open && <div className="modal-container">
        <div className="modal-content-box p-7">
          <h3 className="font-bold text-lg">Delete Profile</h3>
          <p className="py-4">Are you sure you want to wipe your profile out from existence?</p>
          <div className="flex gap-4 justify-end items-center">
            <button
              type="button"
              className="btn btn-error rounded-4xl btn-sm capitalize"
              onClick={deleteProfile}
            >
              Yes, delete!
            </button>
            <button
              type="button"
              className="btn btn-sm rounded-4xl capitalize"
              onClick={() => setOpen(false)}
            >
                No
            </button>
          </div>
        </div>
      </div>}

      {error && (
        <div className="alert alert-error shadow-lg fixed left-1/2 w-[90%] -translate-x-1/2 top-2">
          <div className="flex w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto">&#10006;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;
