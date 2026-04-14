import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "us-east-1", // любое значение
  endpoint: "https://s3-nl.hostkey.com",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // 🔥 обязательно
});

export const uploadImage = async (filePath, fileName) => {
  const fileStream = fs.createReadStream(filePath);

  const key = `products/${fileName}`;

  await s3.send(new PutObjectCommand({
    Bucket: "b0ef80df8-dev",
    Key: key,
    Body: fileStream,
    ContentType: "image/png",
    ACL: "public-read", // 💥 КЛЮЧЕВОЙ МОМЕНТ
  }));

  return key; // ❗ НЕ URL
};

