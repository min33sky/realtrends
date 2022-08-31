/*
  Warnings:

  - Made the column `siteInfoId` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_siteInfoId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "siteInfoId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_siteInfoId_fkey" FOREIGN KEY ("siteInfoId") REFERENCES "SiteInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
