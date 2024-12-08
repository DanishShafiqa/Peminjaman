-- CreateTable
CREATE TABLE `returnn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrow_id` INTEGER NOT NULL DEFAULT 0,
    `item_id` INTEGER NOT NULL DEFAULT 0,
    `user_id` INTEGER NOT NULL DEFAULT 0,
    `actual_return_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `returnn` ADD CONSTRAINT `returnn_borrow_id_fkey` FOREIGN KEY (`borrow_id`) REFERENCES `loan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returnn` ADD CONSTRAINT `returnn_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `returnn` ADD CONSTRAINT `returnn_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
