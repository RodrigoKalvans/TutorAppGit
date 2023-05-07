import Tutor from "../../../models/Tutor";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

const TOP_TUTORS_LIMIT: number = 5;

/**
 * Tutors general route. Used to get all or filtered tutors
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let data;
  await db.connect();

  // handle method
  if (req.method !== "GET") res.status(StatusCodes.METHOD_NOT_ALLOWED);

  // handle querries
  if (req.query && req.query.topTutors) { // feed page top tutors
    data = await getTopTutors();
  } else { // generic GET
    data = await getTutors(req);
  }

  if (!data) res.status(StatusCodes.NO_CONTENT).send({message: "Generic error"});
  if (data.length == 0) res.status(StatusCodes.NOT_FOUND).send({message: "No data found"});

  res.status(StatusCodes.OK).send(data);

  // await db.disconnect();
  return;
};

/**
 * GET tutors request
 * @param {NextApiRequest} req HTTP request received from client side
 * @return {Array<any>} returns all tutors or the ones that match the query
 */
const getTutors = async (req: NextApiRequest) => {
  const foundTutors = await Tutor.find(req.query, {password: 0});

  return foundTutors;
};

/**
 * Used in the feed page
 * @return {Array<any>} returns the top n tutors by follower count
 */
const getTopTutors = async () => {
  const allTutors = await Tutor.find();

  if (!allTutors) return [];

  const sortedTutors: Array<any> = quickSort(allTutors);

  return sortedTutors.slice(0, TOP_TUTORS_LIMIT);
};

/**
 * Used to sort tutors by follower count
 * @param {Array<any>} arr
 * @return {Array<any>} sorted items
 */
const quickSort: any = (arr: Array<any>) => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr.at(0);
  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    arr[i].followers.length > pivot.followers.length ? leftArr.push(arr[i]) : rightArr.push(arr[i]);
  }

  return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
};

export default handler;
