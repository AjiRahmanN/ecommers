const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

class S3Service {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFile(file, key) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private",
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);
      return {
        key,
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      };
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  async getSignedUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      throw new Error(`Error getting signed URL: ${error.message}`);
    }
  }

  async deleteFile(key) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  generateKey(folder, filename) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = filename.split(".").pop();
    return `${folder}/${timestamp}-${randomString}.${extension}`;
  }
}

module.exports = new S3Service();
