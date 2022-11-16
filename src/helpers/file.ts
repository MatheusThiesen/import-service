import * as fs from "fs";

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

  readStream(filename: string) {
    return fs.createReadStream(filename);
  }
}

export const file = new File();
