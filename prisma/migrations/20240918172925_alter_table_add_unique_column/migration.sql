/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `product_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image]` on the table `product_image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `product_tag` will be added. If there are existing duplicate values, this will fail.
  - Made the column `type` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "file" ALTER COLUMN "type" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_name_key" ON "product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_description_key" ON "product_category"("description");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_image_key" ON "product_image"("image");

-- CreateIndex
CREATE UNIQUE INDEX "product_tag_description_key" ON "product_tag"("description");
