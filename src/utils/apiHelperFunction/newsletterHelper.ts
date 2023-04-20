// For ECMAScript (ESM)
import MailerLite from "@mailerlite/mailerlite-nodejs";
import {format} from "date-fns";

if (!process.env.MAILER_API_KEY) {
  throw new Error("Missing API key for MailerLite");
}

const mailerLite = new MailerLite({
  api_key: process.env.MAILER_API_KEY,
});

export const subscribeUserToNewsletter = async (email: string, firstName?: string, lastName?: string, role?: string) => {
  const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  let params: {
    email: string,
    fields?: {
      firstName?: string,
      lastName?: string,
      role?: string,
    },
    subscribed_at: string,
  };

  if (firstName && lastName && role) {
    params = {
      email: email,
      fields: {
        firstName: firstName,
        lastName: lastName,
        role: role,
      },
      subscribed_at: date,
    };
  } else {
    params = {
      email: email,
      subscribed_at: date,
    };
  }

  const res = await mailerLite.subscribers.createOrUpdate(params);

  return res.data;
};

export const getAllSubscribers = async () => {
  const params = {
    filter: {
      status: "active" as "active", // Weird but working fix for TS
    },
    limit: 10,
    page: 1,
  };

  const res = await mailerLite.subscribers.get(params);

  return res.data;
};

export const getSubscriber = async (subscriberId: string) => {
  const res = await mailerLite.subscribers.find(subscriberId);

  return res.data;
};

export const deleteSubscriber = async (subscriberId: string) => {
  const res = await mailerLite.subscribers.delete(subscriberId);

  return res.data;
};
