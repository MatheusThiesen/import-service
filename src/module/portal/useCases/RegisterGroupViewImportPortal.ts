import { entities } from "../../../module/entities/useCases";
import { SendData } from "../repositories/SendData";

export class RegisterGroupViewImportPortal {
  readonly pageSize = 50000;

  constructor(private sendData: SendData) {}

  async execute({ search }: { search?: string }) {
    try {
      const groups = await entities.registrationGroup.findAll({
        search,
        pagesize: 99999,
        fields: {
          grupoCod: true,
          descricao: true,
        },
      });

      await this.sendData.post("/register-group-client/import", groups);
    } catch (error) {
      console.log(error);
    }
  }
}
