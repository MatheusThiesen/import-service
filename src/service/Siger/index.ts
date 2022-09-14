import axios from "axios";

export class Siger {
  private base_url: string;
  private token: string;
  constructor(base_url: string, token: string) {
    this.base_url = base_url;
    this.token = token;
  }

  api() {
    const apiSiger = axios.create({
      baseURL: this.base_url,
    });

    apiSiger.interceptors.request.use(async (config) => {
      config.headers["Authorization"] = `Bearer ${this.token}`;

      return config;
    });

    return apiSiger;
  }
}
