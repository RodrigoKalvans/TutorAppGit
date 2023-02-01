import Student from "../../../models/Student";
import checkToken from "../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getStudents(req, res);
  // PUT request
  if (req.method === "PUT") await updateStudent(req, res);
  // DELETE request
  if (req.method === "DELETE") await deleteStudent(req, res);

  await db.disconnect();
  return;
};

const getStudents = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundStudents = await Student.find(req.query);

  res.status(StatusCodes.OK).send(foundStudents);
  return;
};

const updateStudent = async (req: NextApiRequest, res: NextApiResponse) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action in!",
        });
    return;
  }

  try {
    const updatedStudent = await Student
        .findByIdAndUpdate(req.query.id,
            {
              $set: req.body,
            },
            {new: true},
        );

    res.status(StatusCodes.OK).send(updatedStudent);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }
};

const deleteStudent = async (req: NextApiRequest, res: NextApiResponse) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action in!",
        });
    return;
  }

  try {
    const studentToDelete = await Student.findByIdAndDelete(req.query.id);

    res.status(StatusCodes.OK).send({
      message: "User has been deleted",
      user: studentToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
