import { AxiosError } from "axios";
import * as FormData from "form-data";
import * as path from "path";
import { csv } from "../../../helpers/csv";
import { file as serviceFile } from "../../../helpers/file";
import splitArrObj from "../../../helpers/splitArrObj";
import { apiCommerce } from "../../../service/apiCommerce";
import { AuthorizationRepository } from "./AuthorizationRepository";

export class SendDataRepository {
  private token: string;
  private isRefreshing = true;

  constructor(private authorizationRepository: AuthorizationRepository) {}

  async refreshToken() {
    const responseAuthorization = await this.authorizationRepository.singIn();
    this.token = responseAuthorization.token;
  }

  async post(pathUrl: string, data: any[]) {
    try {
      if (!this.token) {
        const getToken = await this.authorizationRepository.singIn();
        this.token = getToken.token;
      }
      var offset = 0;
      for (const content of splitArrObj(data, 1000)) {
        offset += content.length;

        const filename = path.resolve(
          __filename,
          "..",
          "..",
          "..",
          "..",
          "..",
          "temp",
          new Date().toISOString() + ".csv"
        );
        await csv.createFile(filename, content);

        const file = new FormData();
        file.append("file", serviceFile.readStream(filename) as any);

        apiCommerce({
          method: "get",
          url: "/auth/me",
          headers: {
            ["Authorization"]: `Bearer ${this.token}`,
          },
        })
          .then(() => null)
          .catch(async () => await this.refreshToken());

        await apiCommerce({
          method: "post",
          url: pathUrl,
          headers: {
            ["Authorization"]: `Bearer ${this.token}`,
          },
          data: file,
        });

        await serviceFile.delete(filename);
      }
    } catch (error) {
      console.log(error);

      const err: AxiosError = error;

      if (this.isRefreshing) {
        this.isRefreshing = false;

        if (err?.response?.status === 401) {
          await this.post(pathUrl, data);
        }
      }
    }
  }
}
