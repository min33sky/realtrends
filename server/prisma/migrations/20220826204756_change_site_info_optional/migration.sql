-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_siteInfoId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "siteInfoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_siteInfoId_fkey" FOREIGN KEY ("siteInfoId") REFERENCES "SiteInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
