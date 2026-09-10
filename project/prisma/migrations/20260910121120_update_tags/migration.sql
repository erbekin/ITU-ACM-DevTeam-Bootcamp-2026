/*
  Warnings:

  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `todo_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tag_id` on the `todo_tags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "todo_tags" DROP CONSTRAINT "todo_tags_tag_id_fkey";

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "todo_tags" DROP CONSTRAINT "todo_tags_pkey",
DROP COLUMN "tag_id",
ADD COLUMN     "tag_id" UUID NOT NULL,
ADD CONSTRAINT "todo_tags_pkey" PRIMARY KEY ("todo_id", "tag_id");

-- AddForeignKey
ALTER TABLE "todo_tags" ADD CONSTRAINT "todo_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
