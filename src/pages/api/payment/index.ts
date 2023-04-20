import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const STRIPE_API_VERSION = "2022-11-15";
const STRIPE_BASE_URL = "https://api.stripe.com";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // token check
  const token = await getToken({req});
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Login or create an account first!",
        });
    return;
  }

  if (token.role !== "admin") {
    // admin check
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not prohibited to perform this action"});
    return;
  } else if (req.method != "GET") {
    // method check
    res.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: "Only get request is accepted"});
    return;
  }

  let limit = undefined;

  try {
    const l = parseInt(req.query.limit, 10);
    if (!Number.isNaN(l)) limit = l;
  } catch (err) {
    console.log(err);
  }

  const intents = await getIntents(limit);

  res.status(StatusCodes.OK).send(intents);

  return;
};

const getIntents = async (limit: number | undefined) => {
  if (!limit) {
    return await stripe.paymentIntents.list();
  }
  return await stripe.paymentIntents.list({
    limit,
  });
};

export default handler;
