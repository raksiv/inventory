import { topic, api, bucket, collection } from "@nitric/sdk";

// Collections
export const products = collection("products").for("writing", "reading");

// API
export const inventoryApi = api("inventory");

// Topics
export const inventoryPub = topic('inventoryTopic').for('publishing');

export const inventorySub = topic('inventoryTopic')

// Buckets
export const imageBucket = bucket('images').for('reading', 'writing');

