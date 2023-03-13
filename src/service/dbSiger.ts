import * as mariadb from "mariadb";

class DbSiger {
  private pool = mariadb.createPool({
    host: process.env.RECH_MARIADB_HOST,
    port: Number(process.env.RECH_MARIADB_PORT),
    user: process.env.RECH_MARIADB_USER,
    password: process.env.RECH_MARIADB_PASS,
    connectionLimit: 15,
  });

  public async $ExecuteQuery<T>(query: string): Promise<T[]> {
    let conn = await this.pool.getConnection();
    const rows = await conn.query(query);

    try {
      delete rows.meta;

      return rows;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.end().then();
    }
  }
}

export const dbSiger = new DbSiger();
