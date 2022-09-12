/*
  Warnings:

  - You are about to drop the column `likesCount` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "likesCount",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
