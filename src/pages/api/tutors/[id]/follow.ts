import {followUser} from "@/utils/apiHelperFunction/userHelper";
import db from "@/utils/db";
import {NextApiRequest, NextApiResponse} from "next/types";

/**
 * Follow user route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;
  // PUT request
  if (req.method === "PUT") await followUser(req, res, id as String, "tutor");

  // await db.disconnect();
  return;
};

export default handler;
