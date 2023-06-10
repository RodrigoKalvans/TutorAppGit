import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import {deleteSubscriber, getAllSubscribers, subscribeUserToNewsletter} from "@/utils/apiHelperFunction/newsletterHelper";

/**
 * Newsletters subscribers route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // GET request
  if (req.method === "GET") await getSubscribers(res);
  // POST method
  if (req.method === "POST") await subscribeUser(req, res);
  // DELETE method
  if (req.method === "DELETE") await unsubscribeUser(req, res);

  return;
};

/**
 * GET subscribers of the newsletters
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getSubscribers = async (res: NextApiResponse) => {
  try {
    const data = await getAllSubscribers();
    res.status(StatusCodes.OK).send(data);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

/**
 * POST subscribe user to newsletter
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const subscribeUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.email) {
    res.status(StatusCodes.BAD_REQUEST).send("Missing required field [email]");
    return;
  }

  try {
    const data = await subscribeUserToNewsletter(req.body.email, req.body?.firstName, req.body?.lastName, req.body?.role);
    res.status(StatusCodes.OK).send({data});
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({message: "The given data is invalid", error: error});
  }
};

/**
 * DELETE (unsubscribe) user from newsletter
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const unsubscribeUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.subscriberId) {
    res.status(StatusCodes.BAD_REQUEST).send("Missing required field [subscriberId]");
    return;
  }

  try {
    const data = await deleteSubscriber(req.body.subscriberId);
    res.status(StatusCodes.OK).send(data);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};
export default handler;
