import Tutor from "../../../models/Tutor";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

const NUMBER_OF_TUTORS: number = 5;

/**
 * Used to get the top 2 tutors by follow count for the landing page
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method !== "GET") res.status(StatusCodes.BAD_REQUEST);

  await getTutors(res);

  // await db.disconnect();
  return;
};

export default handler;

/**
 * Service
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getTutors = async (res: NextApiResponse) => {
  const allTutors = await Tutor.find();

  if (!allTutors) res.status(StatusCodes.NOT_FOUND);

  const sortedTutors: Array<any> = quickSort(allTutors);

  res.status(StatusCodes.OK).send(sortedTutors.slice(0, NUMBER_OF_TUTORS));

  return;
};

/**
 * Used to sort tutors by follower count
 * @param {Array<any>} arr
 * @return {Array<any>} sorted items
 */
const quickSort = (arr: Array<any>) => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].followers.length > pivot.followers.length) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};
