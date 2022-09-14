-- DropForeignKey
ALTER TABLE "ItemStats" DROP CONSTRAINT "ItemStats_itemId_fkey";

-- AddForeignKey
ALTER TABLE "ItemStats" ADD CONSTRAINT "ItemStats_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
