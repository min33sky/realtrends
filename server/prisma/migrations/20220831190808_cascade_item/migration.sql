-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_publisherId_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
