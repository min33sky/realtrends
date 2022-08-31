/*
  Warnings:

  - You are about to drop the column `siteInfoId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `SiteInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisherId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_siteInfoId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "siteInfoId",
ADD COLUMN     "publisherId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SiteInfo";

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "favicon" TEXT,
    "domain" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_domain_key" ON "Publisher"("domain");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
