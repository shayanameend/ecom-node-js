import path from "node:path";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

import { env } from "~/lib/env";
import { s3Client } from "~/lib/s3";

function addFile({ file }: { file: Express.Multer.File }) {
  const key = `${uuid()}${path.extname(file.originalname)}`;

  const putCommand = new PutObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  s3Client.send(putCommand);

  return key;
}

function removeFile({ key }: { key: string }) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: key,
  });

  s3Client.send(deleteCommand);

  return key;
}

export { addFile, removeFile };
