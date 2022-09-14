import axios from "axios";

export const apiSiger = axios.create({
  baseURL: process.env.RECH_URL ?? "",
});

apiSiger.interceptors.request.use(async (config) => {
  config.headers["Authorization"] = `Bearer ${process.env.RECH_TOKEN}`;

  return config;
});
