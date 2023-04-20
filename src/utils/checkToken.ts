import {getToken} from "next-auth/jwt";
import {NextApiRequest} from "next/types";

/**
 * Checks if user is logged in and if user's (student/tutor) id that the action is connected to
 * is the same as theirs
 * @param {NextApiRequest} req request received from client
 * @return {JWT} returns jwt when the checks are passed, otherwise returns undefined
 */
const validateUser = async (req: NextApiRequest) => {
  const token = await getToken({req});

  if (!token || token?.id !== req.query.id) {
    return undefined;
  }

  return token;
};

export default validateUser;
