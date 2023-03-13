import * as mariadb from "mariadb";

class DbSiger {
  public async $ExecuteQuery<T>(query: string): Promise<T[]> {
    const pool = mariadb.createPool({
      host: process.env.RECH_MARIADB_HOST,
      port: Number(process.env.RECH_MARIADB_PORT),
      user: process.env.RECH_MARIADB_USER,
      password: process.env.RECH_MARIADB_PASS,
      connectionLimit: 15,
    });

    const connection = await pool.getConnection();
    const rows = await connection.query(query);

    try {
      delete rows.meta;
      await connection.end();
      return rows;
    } catch (err) {
      await connection.end();
      throw err;
    }
  }
}

export const dbSiger = new DbSiger();
