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

  await getTwoTutors(req, res);

  // await db.disconnect();
  return;
};

export default handler;

/**
 * Service
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getTwoTutors = async (req: NextApiRequest, res: NextApiResponse) => {
  const allTutors = await Tutor.find(req.query, {password: 0});

  if (!allTutors) res.status(StatusCodes.NOT_FOUND);

  // TODO: check data type
  const sortedTutors = quickSort(allTutors, 0, allTutors.length - 1);

  res.status(StatusCodes.OK).send(sortedTutors.slice(0, NUMBER_OF_TUTORS));
  return;
};

/**
 * Used for QuickSort algo
 * @param {Array<any>} items
 * @param {number} leftIndex
 * @param {number} rightIndex
 */
function swap(items: Array<any>, leftIndex: number, rightIndex: number) {
  const temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}

/**
 * Used for QuickSort algo
 * @param {Array<any>} items
 * @param {number} left
 * @param {number} right
 * @return {any} partition
 */
function partition(items: Array<any>, left: number, right: number) {
  const pivot = items[Math.floor((right + left) / 2)]; // middle element
  let i = left; // left pointer
  let j = right; // right pointer
  while (i <= j) {
    while (items[i].followers.length < pivot.followers.length) {
      i++;
    }
    while (items[j].followers.length > pivot.followers.length) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); // sawpping two elements
      i++;
      j--;
    }
  }
  return i;
}

/**
 * Used to sort tutors by follower count
 * @param {Array<any>} items
 * @param {number} left
 * @param {number} right
 * @return {Array<any>} sorted items
 */
function quickSort(items: Array<any>, left: number, right: number) {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right); // index returned from partition
    if (left < index - 1) { // more elements on the left side of the pivot
      quickSort(items, left, index - 1);
    }
    if (index < right) { // more elements on the right side of the pivot
      quickSort(items, index, right);
    }
  }
  return items;
}
