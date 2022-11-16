import axios from "axios";
import * as https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const apiCommerce = axios.create({
  baseURL: process.env.COMMERCE_URL ?? "",
  httpsAgent: agent,
});
