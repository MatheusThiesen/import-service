import * as mariadb from "mariadb";

// const prisma = new PrismaClient();

function toJson(data) {
  return JSON.stringify(data, (_, v) =>
    typeof v === "bigint" ? `${v}n` : v
  ).replace(/"(-?\d+)n"/g, (_, a) => a);
}

class DbSiger {
  private pool = mariadb.createPool({
    host: process.env.RECH_MARIADB_HOST,
    port: Number(process.env.RECH_MARIADB_PORT),
    user: process.env.RECH_MARIADB_USER,
    password: process.env.RECH_MARIADB_PASS,
    connectionLimit: 40,
  });

  public async $ExecuteQuery<T>(query: string): Promise<T[]> {
    let conn;

    // const startAt = new Date();

    // const createLog = await prisma.queryDb.create({
    //   data: {
    //     query: String(query.replace(/\r?\n|\r/g, "")).trim(),
    //     startAt,
    //   },
    // });

    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query(query);
      delete rows.meta;

      // const endAnt = new Date();

      // const seconds = (endAnt.getTime() - startAt.getTime()) / 1000;
      // const response = JSON.stringify(toJson(rows));

      // try {
      //   await prisma.queryDb.update({
      //     data: {
      //       endAnt,
      //       seconds,
      //       response,
      //       responseLines: rows?.length,
      //     },
      //     where: {
      //       id: createLog.id,
      //     },
      //   });
      // } catch (error) {
      //   await prisma.queryDb.update({
      //     data: {
      //       endAnt: new Date(),
      //       error: JSON.stringify(String(error)),
      //     },
      //     where: {
      //       id: createLog.id,
      //     },
      //   });
      // }

      return rows;
    } catch (err) {
      // prisma.queryDb
      //   .update({
      //     data: {
      //       endAnt: new Date(),
      //       error: JSON.stringify(String(err)),
      //     },
      //     where: {
      //       id: createLog.id,
      //     },
      //   })
      //   .then();

      throw err;
    } finally {
      if (conn) conn.end().then();
    }
  }
}

export const dbSiger = new DbSiger();
