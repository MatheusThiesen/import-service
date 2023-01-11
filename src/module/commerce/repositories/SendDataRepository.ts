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

  generateRandomString(num: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result1 = Math.random().toString(36).substring(0, num);

    return result1;
  }

  async refreshToken() {
    const responseAuthorization = await this.authorizationRepository.singIn();
    this.token = responseAuthorization.token;
  }

  async post(pathUrl: string, data: any[]) {
    try {
      if (data.length > 0) {
        var offset = 0;

        if (!this.token) {
          const getToken = await this.authorizationRepository.singIn();
          this.token = getToken.token;
        }

        for (const content of splitArrObj(data, 500)) {
          offset += content.length;

          const filename = path.resolve(
            __filename,
            "..",
            "..",
            "..",
            "..",
            "..",
            "temp",
            this.generateRandomString(8) + ".csv"
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

        console.log(`[ENVIADO] ${data.length} para "${pathUrl}"`);
      }
    } catch (error) {
      const err: AxiosError = error;

      if (err?.response?.status > 401) {
        throw Error(error);
      }

      if (this.isRefreshing) {
        this.isRefreshing = false;

        if (err?.response?.status === 401) {
          await this.post(pathUrl, data);
        }
      }
    }
  }
}
