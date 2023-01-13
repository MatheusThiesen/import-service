import * as path from "path";
import { file as serviceFile } from "../../../helpers/file";
import { SendDataRepository } from "../../commerce/repositories/SendDataRepository";

export class SendData {
  private observableFolder: string;

  constructor(private sendData: SendDataRepository) {
    this.observableFolder = process.env.OBSERVABLE_FOLDER;
  }

  async execute({
    entity,
    data,
    route,
    file,
  }: {
    entity: string;
    data: Object[];
    route: string;
    file: string;
  }) {
    try {
      await this.sendData.post(route, data);

      await serviceFile.move(
        path.resolve(this.observableFolder, entity, "processing", file),
        path.resolve(this.observableFolder, entity, "imported", file)
      );
    } catch (error) {
      console.log(error);

      await serviceFile.move(
        path.resolve(this.observableFolder, entity, "processing", file),
        path.resolve(this.observableFolder, entity, "noimported", file)
      );
    }
  }
}
