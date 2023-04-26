import Post from "@/models/Post";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {PutObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {StatusCodes} from "http-status-codes";
import multer, {Multer} from "multer";
import {NextApiRequest, NextApiResponse} from "next";
import sharp from "sharp";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const client = new S3Client({region: "eu-north-1"});
const upload: Multer = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("The file has to be an image"));
    }

    cb(null, true);
  },
});

export const uploadPostImages = async (req: NextApiRequest, res: NextApiResponse, postId: string, userId: string) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      res.status(StatusCodes.NOT_FOUND).send({error: "Post was not found."});
      return;
    } else if (post.userId !== userId) {
      res.status(StatusCodes.FORBIDDEN).send({error: "You cannot upload images to other people's posts!"});
      return;
    }

    await new Promise<any>((resolve, reject) => {
      upload.array("images")(req as any, res as any, async (err: any) => {
        if (err) {
          reject(err);
        } else {
          const files = (req as any).files;

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const optimizedImageBuffer = await sharp(file.buffer).resize({width: 600}).png({quality: 80}).toBuffer();
            const key = `${i}-${Date.now()}-${postId}`;

            const command = new PutObjectCommand({
              Bucket: "tcorvus-post-images-bucket",
              Key: key,
              Body: optimizedImageBuffer,
              ContentType: "image/png",
            });

            try {
              await client.send(command);
              post.images.push(key);
            } catch (error) {
              reject(error);
            }
          }

          await post.save();
          resolve(post);
        }
      });
    }).then((post) => res.status(StatusCodes.OK).send(post)).
        catch((error) => res.status(StatusCodes.BAD_REQUEST).send(error));
    return;
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).send(err);
    return;
  }
};

export const uploadProfilePicture = async (req: NextApiRequest, res: NextApiResponse, id: string, role: string) => {
  try {
    let user: any;

    switch (role) {
      case "student":
        user = await Student.findById(id);
        break;

      case "tutor":
        user = await Tutor.findById(id);
        break;
    }

    if (!user) {
      res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "The user you are logged in as cannot be found! Your account was either deleted or blocked. Please, update the page."});
      return;
    }

    await new Promise<any>((resolve, reject) => {
      upload.single("image")(req as any, res as any, async (err: any) => {
        if (err) {
          reject(err);
        } else {
          const file = (req as any).file;
          const optimizedImageBuffer = await sharp(file.buffer).resize({width: 600}).png({quality: 80}).toBuffer();
          const key = `${Date.now()}-${id}`;

          const command = new PutObjectCommand({
            Bucket: "tcorvus-profile-images-bucket",
            Key: key,
            Body: optimizedImageBuffer,
            ContentType: "image/png",
          });

          try {
            const response = await client.send(command);

            if (response.$metadata.httpStatusCode !== 200) {
              reject(new Error("The upload of the image to AWS S3 failed."));
            }

            user.picture = key;
            await user.save();
            resolve(user);
          } catch (error) {
            reject(err);
          }
        }
      });
    }).then((user) => res.status(StatusCodes.OK).send({user})).
        catch((error) => res.status(StatusCodes.BAD_REQUEST).send(error));
    return;
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).send(err);
    return;
  }
};

export const getProfilePicture = async (res: NextApiResponse, key: string) => {
  const command = new GetObjectCommand({
    Bucket: "tcorvus-profile-images-bucket",
    Key: key as string,
  });

  try {
    const response = await client.send(command);
    const image = response.Body;

    res.setHeader("Content-Type", "image/png");
    res.status(StatusCodes.OK).send(image);
    return;
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    return;
  }
};

export const getProfilePicturePresigned = async (res: NextApiResponse, key: string) => {
  const command = new GetObjectCommand({
    Bucket: "tcorvus-profile-images-bucket",
    Key: key as string,
  });

  try {
    const url = await getSignedUrl(client, command, {expiresIn: 3600});

    res.status(StatusCodes.OK).send({presignedUrl: url});
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

export const getPostPictures = async (res: NextApiResponse, keys: Array<string>) => {
  const commands = keys.map((key: string) => {
    return new GetObjectCommand({
      Bucket: "tcorvus-post-images-bucket",
      Key: key,
    });
  });

  try {
    const responses = await Promise.all(commands.map((command) => client.send(command)));
    const images = responses.map((response) => response.Body);
    const firstImage = images[0];

    res.setHeader("Content-Type", "image/png");
    res.status(StatusCodes.OK).send(firstImage);
    return;
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    console.log(error);
    return;
  }
};

export const getPostPicturesPresigned = async (res: NextApiResponse, keys: Array<string>) => {
  const commands = keys.map((key: string) => {
    return new GetObjectCommand({
      Bucket: "tcorvus-post-images-bucket",
      Key: key,
    });
  });

  try {
    const presignedUrls = [];

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      const url = await getSignedUrl(client, command, {expiresIn: 3600});
      presignedUrls.push(url);
    }

    res.status(StatusCodes.OK).send(presignedUrls);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
    console.log(error);
  }
};

export const deleteProfilePicture = async (req: NextApiRequest, res: NextApiResponse, key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: "tcorvus-profile-images-bucket",
    Key: key,
  });

  try {
    const response = await client.send(command);
    res.status(StatusCodes.OK).send("Profile picture with key " + key + " has been deleted.");
    console.log(response);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};

export const deletePostPicture = async (req: NextApiRequest, res: NextApiResponse, key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: "tcorvus-post-images-bucket",
    Key: key,
  });

  try {
    const response = await client.send(command);
    res.status(StatusCodes.OK).send("Profile picture with key " + key + " has been deleted.");
    console.log(response);
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
};
