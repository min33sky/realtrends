-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "subcommentsCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "parentCommentId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CommentLike_commentId_idx" ON "CommentLike"("commentId");

-- CreateIndex
CREATE INDEX "ItemLike_itemId_idx" ON "ItemLike"("itemId");
