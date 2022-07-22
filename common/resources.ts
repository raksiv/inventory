import { topic, api, bucket, collection } from "@nitric/sdk";
import { Rekognition } from "aws-sdk";


// Retrieve SES configuration from ENV.
function getConfig(): Rekognition.Types.ClientConfiguration {
    return {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      region: process.env.AWS_SES_REGION,
    };
  }

export const rekognition = new Rekognition(getConfig());

// Collections
export const products = collection("products").for("writing", "reading");

// API
export const inventoryApi = api("inventory");

// Topics
export const inventoryPub = topic('topic').for('publishing');

export const inventorySub = topic('topic')

// Buckets
export const imageBucket = bucket('images').for('reading', 'writing');


export const recognize = async (name: string, bucket: string) =>
    rekognition.detectLabels({
      Image: {
        S3Object: {
          Bucket: bucket,
          Name: name,
        },
      },
      MaxLabels: 10,
      MinConfidence: 50,
    }).promise()


    

