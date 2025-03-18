/*
  Warnings:

  - You are about to drop the column `productId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Products` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `type` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to drop the `TransactionsDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[warehouseId]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Categories` DROP FOREIGN KEY `Categories_productId_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionsDetails` DROP FOREIGN KEY `TransactionsDetails_productsId_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionsDetails` DROP FOREIGN KEY `TransactionsDetails_transactionsId_fkey`;

-- DropIndex
DROP INDEX `Categories_productId_key` ON `Categories`;

-- AlterTable
ALTER TABLE `Categories` DROP COLUMN `productId`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `updatedAt`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `stock` INTEGER NOT NULL,
    ADD COLUMN `warehouseId` INTEGER NOT NULL,
    MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `TransactionsDetails`;

-- DropTable
DROP TABLE `Warehouse`;

-- CreateTable
CREATE TABLE `transactionsItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `transactionsId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Products_warehouseId_key` ON `Products`(`warehouseId`);

-- CreateIndex
CREATE UNIQUE INDEX `Products_categoryId_key` ON `Products`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactionsItem` ADD CONSTRAINT `transactionsItem_transactionsId_fkey` FOREIGN KEY (`transactionsId`) REFERENCES `Transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactionsItem` ADD CONSTRAINT `transactionsItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
