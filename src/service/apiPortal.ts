import axios from "axios";

export const apiPortal = axios.create({
  baseURL: process.env.PORTAL_URL ?? "",
});
