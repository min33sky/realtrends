-- DropForeignKey
ALTER TABLE "ItemLike" DROP CONSTRAINT "ItemLike_itemId_fkey";

-- AddForeignKey
ALTER TABLE "ItemLike" ADD CONSTRAINT "ItemLike_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
