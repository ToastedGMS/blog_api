-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_repliedCommentId_fkey";

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_repliedCommentId_fkey" FOREIGN KEY ("repliedCommentId") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
