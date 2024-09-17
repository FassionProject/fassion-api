/*
  Warnings:

  - You are about to drop the column `productId` on the `product_tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_tag" DROP CONSTRAINT "product_tag_productId_fkey";

-- AlterTable
ALTER TABLE "product_category" ADD COLUMN     "parent_id" TEXT;

-- AlterTable
ALTER TABLE "product_tag" DROP COLUMN "productId";

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
