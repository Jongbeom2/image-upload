const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });
const port = process.env.PORT;
const app = express();
const http = require("http").Server(app);
const AWS = require("aws-sdk");

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
AWS.config.update({
  credentials: credentials,
  region: process.env.AWS_REGION,
});

try {
  if (!port) {
    throw new Error("PORT Undefined");
  }

  app.use(cors());

  app.get("/test", (req, res) => {
    console.log("Get /test");
    res.send(true);
  });

  app.get("/check", (req, res) => {
    res.send(true);
  });

  app.get("/presigned-url-get/:key", (req, res) => {
    const key = req.params.key;
    const bucektParams = {
      Bucket: process.env.AWS_S3,
      Key: `test/${key}`,
      Expires: 60,
    };
    const s3 = new AWS.S3();
    const presignedGETURL = s3.getSignedUrl("getObject", bucektParams);
    res.send(presignedGETURL);
  });

  app.get("/presigned-url-put/:key", (req, res) => {
    const key = req.params.key;
    const bucektParams = {
      Bucket: process.env.AWS_S3,
      Key: `test/${key}`,
      Expires: 60,
    };
    const s3 = new AWS.S3();
    const presignedGETURL = s3.getSignedUrl("putObject", bucektParams);
    res.send(presignedGETURL);
  });

  http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} catch (error) {
  console.log(error);
}
