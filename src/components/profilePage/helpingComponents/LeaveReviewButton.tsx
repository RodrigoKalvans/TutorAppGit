import {useSession} from "next-auth/react";
import React, {useState} from "react";
import CreateReviewModal from "../CreateReviewModal";

const LeaveReviewButton = ({reviewedUserId, reviewedUserRole}:
  {reviewedUserId: string, reviewedUserRole: string}) => {
  const [openCreatePost, setOpenCreatePost] = useState<boolean>(false);
  const {data: session} = useSession();

  const closeModal = () => {
    setOpenCreatePost(false);
  };

  return (
    <>
      {session && (
        <button type="button" onClick={() => setOpenCreatePost(true)} className="btn btn-sm rounded-full capitalize">Leave Review</button>
      )}

      {openCreatePost && (
        <CreateReviewModal closeModal={closeModal} reviewedUserId={reviewedUserId}
          reviewedUserRole={reviewedUserRole} />
      )}
    </>
  );
};

export default LeaveReviewButton;
