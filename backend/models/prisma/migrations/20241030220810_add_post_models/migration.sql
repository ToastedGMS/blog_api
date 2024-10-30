/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `RefreshTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "edited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "repliedCommentId" INTEGER,
    "edited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_userEmail_key" ON "RefreshTokens"("userEmail");

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_repliedCommentId_fkey" FOREIGN KEY ("repliedCommentId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
