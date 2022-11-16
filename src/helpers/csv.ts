import * as fs from "fs";
import * as jsonToCsv from "json2csv";

export class Csv {
  async createFile(filename: string, data: any[]): Promise<string> {
    const objToCsv = await this.objToCsv(data);

    return new Promise((resolve, reject) => {
      fs.writeFile(filename, objToCsv, (err) => {
        if (err) {
          reject(err);
        }

        resolve(filename);
      });
    });
  }
  async objToCsv(data: any[]): Promise<string> {
    return jsonToCsv.parseAsync(data, { header: false });
  }
}

export const csv = new Csv();
