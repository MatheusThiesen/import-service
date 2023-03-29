import axios from "axios";
import * as https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const apiPortal = axios.create({
  baseURL: process.env.PORTAL_URL ?? "",
  httpsAgent: agent,
});
