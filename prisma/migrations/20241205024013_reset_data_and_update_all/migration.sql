/*
  Warnings:

  - The primary key for the `loan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `loan` table. All the data in the column will be lost.
  - The primary key for the `returnn` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `returnn` table. All the data in the column will be lost.
  - Added the required column `borrow_id` to the `loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `return_id` to the `returnn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `returnn` DROP FOREIGN KEY `returnn_borrow_id_fkey`;

-- DropIndex
DROP INDEX `user_username_key` ON `user`;

-- AlterTable
ALTER TABLE `loan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `borrow_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`borrow_id`);

-- AlterTable
ALTER TABLE `returnn` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `return_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`return_id`);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('Admin', 'User') NOT NULL;

-- AddForeignKey
ALTER TABLE `returnn` ADD CONSTRAINT `returnn_borrow_id_fkey` FOREIGN KEY (`borrow_id`) REFERENCES `loan`(`borrow_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
