import {MouseEventHandler, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";

const CreateReviewModal = ({closeModal, reviewedUserId, reviewedUserRole}:
   {closeModal: MouseEventHandler, reviewedUserId: string, reviewedUserRole: string}) => {
  const [rating, setRating] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<String | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const updateRating = (e: any) => {
    setRating(e.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const review: {
      text?: string,
      rating?: number,
    } = {};

    if (event.target.reviewText.value) review.text = event.target.reviewText.value;
    if (rating > -1) review.rating = rating;

    const res = await fetch(`/api/${reviewedUserRole}s/${reviewedUserId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      window.location.reload();
    } else {
      const json = await res.json();

      setErrorMessage(json.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg px-6 w-full mx-3 md:w-1/2">
        <div className="flex justify-between mt-6 pb-3 border-b-2">
          <h1 className="text-xl">Leave review</h1>
          <button onClick={closeModal}>
            <AiOutlineClose color="#505050" />
          </button>
        </div>

        <form className="mb-5" onSubmit={handleSubmit}>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex flex-col gap-y-3 py-3 max-h-[70vh] overflow-y-auto">
            <div>
              <div className="rating rating-md" onChange={updateRating}>
                <input type="radio" name="rating-2" className="rating-hidden hidden" defaultChecked />
                <input type="radio" value={1} name="rating-2" className="mask mask-star-2 bg-orange-400" />
                <input type="radio" value={2} name="rating-2" className="mask mask-star-2 bg-orange-400" />
                <input type="radio" value={3} name="rating-2" className="mask mask-star-2 bg-orange-400" />
                <input type="radio" value={4} name="rating-2" className="mask mask-star-2 bg-orange-400" />
                <input type="radio" value={5} name="rating-2" className="mask mask-star-2 bg-orange-400" />
              </div>
            </div>

            <div>
              <textarea rows={4} maxLength={200} id="reviewText" className="w-full border" placeholder="Leave your review here" />
            </div>
          </div>

          <div className="border-t-2">
            <button
              type="submit"
              className="btn btn-primary rounded-4xl btn-sm mt-3"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewModal;
