import * as fs from "fs";
import { rename } from "fs/promises";

export class File {
  delete(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filename, (err) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  move(oldFilename: string, newFilename): Promise<void> {
    return rename(oldFilename, newFilename);
  }

  readStream(filename: string) {
    return fs.createReadStream(filename);
  }
}

export const file = new File();
