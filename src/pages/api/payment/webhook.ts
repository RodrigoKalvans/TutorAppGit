import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import Stripe from "stripe";
import {buffer} from "micro";

// test command: stripe listen --forward-to localhost:3000/api/payment/webhook

export const config = {
  api: {
    bodyParser: false,
  },
};

const STRIPE_API_VERSION = "2022-11-15";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!;

/**
 * handler for Stripe calls
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method not permitted");
  }

  handleRequest(req, res);

  return;
};

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqSignature: any = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  let customer: string; // email
  let amount: number; // cents

  // verify that request came from Stripe
  // if it did not, catch
  try {
    event = stripe.webhooks.constructEvent(buf, reqSignature, webhookSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook error: ${err.message}`);
    return null;
  }

  // handle different stages of payment
  switch (event.type) {
    case "payment_intent.created":
      console.log(`A payment request has been created: ${event.data.object}`);
      res.status(200).send("Payment intent created");
      break;
    case "payment_intent.succeeded":
      console.log("payment successful");
      amount = event.data.object.amount;
      const paymentMethod = await stripe.paymentMethods.retrieve(event.data.object.payment_method);
      customer = paymentMethod.billing_details.email!;
      console.log(`A payment was made by: ${customer}`);
      subscribe(customer, res); // handle login on db side
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      res.status(200).send("Type not recognized");
      break;
  }

  return;
};

/**
 * plc
 * @param {string} customerEmail
 * @param {NextApiResponse} res
 * @return {any} plc
 */
const subscribe = async (customerEmail: string, res: NextApiResponse) => {
  // let user: typeof Tutor | typeof Student;
  let user: any;
  //
  await db.connect();

  // find user with the email provided in payment
  // user = Tutor.find({
  //   email: {
  //     $in: email,
  //   },
  // }) ||
  user = await Tutor.find({
    email: "email@email.com",
  });

  console.log(user);

  await db.disconnect();
  return;
};

export default handler;
