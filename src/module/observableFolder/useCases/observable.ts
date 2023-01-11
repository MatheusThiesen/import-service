import { promises as fsPromises } from "fs";
import * as path from "path";
import { file as serviceFile } from "../../../helpers/file";
import { xlsxToJson } from "../../../helpers/xlsxToJson";

interface ObservableResponse<T> {
  file: string;
  data: T[];
}

export class Observable {
  private observableFolder: string;

  constructor() {
    this.observableFolder = process.env.OBSERVABLE_FOLDER;
  }

  async execute<T>({
    entity,
  }: {
    entity: string;
  }): Promise<ObservableResponse<T>[]> {
    const listFiles = await fsPromises.readdir(
      path.resolve(this.observableFolder, entity)
    );

    const listFilter = listFiles.filter((file) => {
      const [namefile, mimetype] = file.split(".");
      const [firstName] = namefile.split("_");

      if (
        mimetype !== undefined &&
        mimetype?.trim()?.toUpperCase() === "XLSX" &&
        firstName?.trim()?.toUpperCase() === entity?.trim()?.toUpperCase()
      ) {
        return true;
      } else {
        return false;
      }
    });

    let files: ObservableResponse<T>[] = [];

    for (const file of listFilter) {
      try {
        await serviceFile.move(
          path.resolve(this.observableFolder, entity, file),
          path.resolve(this.observableFolder, entity, "processing", file)
        );

        const normalized: T[] = await xlsxToJson<T>(
          path.resolve(this.observableFolder, entity, "processing", file)
        );

        files.push({
          data: normalized,
          file: file,
        });
      } catch (error) {
        console.log(error);

        await serviceFile.move(
          path.resolve(this.observableFolder, entity, "processing", file),
          path.resolve(this.observableFolder, entity, "noimported", file)
        );
      }
    }

    return files;
  }
}
