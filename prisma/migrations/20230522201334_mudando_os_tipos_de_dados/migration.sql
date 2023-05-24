/*
  Warnings:

  - You are about to alter the column `seconds` on the `queries` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_queries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "query" TEXT NOT NULL,
    "response" TEXT,
    "responseLines" INTEGER,
    "startAt" DATETIME NOT NULL,
    "endAnt" DATETIME,
    "error" TEXT,
    "seconds" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_queries" ("createdAt", "endAnt", "error", "id", "query", "response", "responseLines", "seconds", "startAt", "updatedAt") SELECT "createdAt", "endAnt", "error", "id", "query", "response", "responseLines", "seconds", "startAt", "updatedAt" FROM "queries";
DROP TABLE "queries";
ALTER TABLE "new_queries" RENAME TO "queries";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
