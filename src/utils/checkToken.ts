import {getToken} from "next-auth/jwt";
import {NextApiRequest} from "next/types";


const checkToken = async (req: NextApiRequest) => {
  const token = await getToken({req});

  if (!token || token?.id !== req.query.id) {
    return false;
  }

  return true;
};

export default checkToken;
