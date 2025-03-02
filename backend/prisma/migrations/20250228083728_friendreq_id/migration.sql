/*
  Warnings:

  - Added the required column `friendshipId` to the `FriendReq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendReq" ADD COLUMN     "friendshipId" TEXT NOT NULL;
