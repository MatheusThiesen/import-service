import * as mariadb from "mariadb";

class DbSiger {
  private pool = mariadb.createPool({
    host: process.env.RECH_MARIADB_HOST,
    port: Number(process.env.RECH_MARIADB_PORT),
    user: process.env.RECH_MARIADB_USER,
    password: process.env.RECH_MARIADB_PASS,
    connectionLimit: 15,
  });

  private connection: any;

  private async openConnection() {
    this.connection = await this.pool.getConnection();
  }
  private async closeConnection() {
    this.connection.end();
  }

  public async $ExecuteQuery<T>(query: string): Promise<T[]> {
    try {
      await this.openConnection();
      const rows = await this.connection.query(query);

      delete rows.meta;
      return rows;
    } catch (err) {
      throw err;
    } finally {
      await this.closeConnection();
    }
  }
}

export const dbSiger = new DbSiger();
