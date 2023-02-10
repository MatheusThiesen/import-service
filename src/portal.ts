import { dbSiger } from "./service/dbSiger";

export class Portal {
  async execute() {
    try {
      const response = await dbSiger.$ExecuteQuery(
        "select * from 01010s005.dim_marca dm limit 1"
      );

      console.log(response);
    } catch (err) {
      console.log("error!");
      console.log(err);
    }
  }
}
