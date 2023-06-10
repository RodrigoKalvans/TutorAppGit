import {IncomingForm} from "formidable";
import {StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";

const mv = require("mv");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authenticated"});
    return;
  }
  if (token.id !== "admin") {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not authorized"});
    return;
  }

  await new Promise((reject) => {
    const form = new IncomingForm();
    form.parse(req, (err: any, fields: any, file: any) => {
      if (err) return reject(err);
      const oldPath = file.image.filepath;
      const newPath = `./public/icons/subjectIcons/${fields.name}`;
      mv(oldPath, newPath, function(err: any) { // moves the file to the newPath
        reject(err);
        res.status(StatusCodes.IM_A_TEAPOT).send({message: err});
      });
    });
  }).then((data) => res.status(200).send({data}));
};

export default handler;
