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
      var offset = 0;
      for (const content of splitArrObj(data, 20000)) {
        offset += content.length;
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
          },
        });
      }
    } catch (error) {
      const err: AxiosError = error;

      if (this.isRefreshing) {
        this.isRefreshing = false;

        if (err.response.status === 401) {
          this.token = (await this.authorizationRepository.singIn()).token;
          this.post(pathUrl, data);
        }
      }
    }
  }
}
