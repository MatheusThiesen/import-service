import * as sql from "mssql";

export class DbNextdata {
  private sqlConfig = {
    user: process.env.NEXTDATA_SQLSERVER_USER,
    password: process.env.NEXTDATA_SQLSERVER_PASS,
    database: process.env.NEXTDATA_SQLSERVER_DB,
    server: process.env.NEXTDATA_SQLSERVER_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  public async $ExecuteQuery<T>(query: string): Promise<T[]> {
    try {
      await sql.connect(this.sqlConfig);
      const result = await sql.query(query);

      return result.recordset;
    } catch (err) {
      throw err;
    }
  }
}

export const dbNextdata = new DbNextdata();
