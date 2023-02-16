import { AxiosError } from "axios";
import splitArrObj from "../../../helpers/splitArrObj";
import { apiPortal } from "../../../service/apiPortal";
import { AuthorizationRepository } from "./Authorization";

export class SendData {
  private token: string;
  private isRefreshing = true;

  constructor(private authorizationRepository: AuthorizationRepository) {}

  async post(pathUrl: string, data: any[]) {
    try {
      if (!this.token) {
        this.token = (await this.authorizationRepository.singIn()).token;
      }

      const page = pathUrl === "/order/importV2" ? 500 : 20000;

      var offset = 0;
      for (const content of splitArrObj(data, page)) {
        offset += content.length;
        try {
          await apiPortal({
            method: "post",
            url: pathUrl,
            headers: {
              ["x-access-token"]: `Bearer ${this.token}`,
            },
            data: {
              total: data.length,
              offset: offset,
              contents: content,
              newSiger: true,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }

      console.log(
        `[ENVIADO] ${data.length} para "${
          process.env.PORTAL_URL
        }${pathUrl}" - ${new Date().toLocaleString("pt-br", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}`
      );
    } catch (error) {
      const err: AxiosError = error;

      if (this.isRefreshing) {
        this.isRefreshing = false;

        if (err?.response?.status === 401) {
          this.token = (await this.authorizationRepository.singIn()).token;
          this.post(pathUrl, data);
        }
      }
    }
  }
}
