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
    let result1 = Math.random().toString(36).substring(0, num);

    return result1;
  }

  async refreshToken() {
    const responseAuthorization = await this.authorizationRepository.singIn();
    this.token = responseAuthorization.token;
  }

  async sendData(pathUrl, data: any[]) {
    const filename = path.resolve(
      __filename,
      "..",
      "..",
      "..",
      "..",
      "..",
      "temp",
      this.generateRandomString(18) + ".csv"
    );
    await csv.createFile(filename, data);

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

  async post(pathUrl: string, data: any[]) {
    try {
      if (data.length > 0) {
        var offset = 0;

        if (!this.token) {
          const getToken = await this.authorizationRepository.singIn();
          this.token = getToken.token;
        }

        for (const content of splitArrObj(
          data,
          pathUrl.startsWith("/clients-to-sellers/import/") ? 99999 : 2000
        )) {
          offset += content.length;

          try {
            await this.sendData(pathUrl, data);
          } catch (error) {
            this.token = (await this.authorizationRepository.singIn())?.token;
            await this.sendData(pathUrl, data);
          }
        }

        console.log(
          `[ENVIADO] ${
            data.length
          } para "${pathUrl}" - ${new Date().toLocaleString("pt-br", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}`
        );
      }
    } catch (error) {
      const err: AxiosError = error;
      console.log("Error aqui: ", error);

      if (this.isRefreshing) {
        this.isRefreshing = false;

        if (err?.response?.status === 401) {
          this.token = (await this.authorizationRepository.singIn())?.token;
          this.post(pathUrl, data);
        }
      }
    }
  }
}
