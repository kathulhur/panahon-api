/*
  Warnings:

  - You are about to drop the column `name` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `prefix` on the `ApiKey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "name",
DROP COLUMN "prefix";

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");
