CREATE DATABASE IF NOT EXISTS `pob`;
USE `pob`;

-- pob.user
CREATE TABLE IF NOT EXISTS `user` (
                                      `subscription_type` int NOT NULL,
                                      `created` datetime(6) NOT NULL,
    `updated` datetime(6) NOT NULL,
    `user_key` binary(16) NOT NULL,
    `user_name` varchar(50) NOT NULL,
    `user_password` varchar(255) NOT NULL,
    PRIMARY KEY (`user_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- pob.directory
CREATE TABLE IF NOT EXISTS `directory` (
                                           `institution_code` int NOT NULL,
                                           `created` datetime(6) NOT NULL,
    `directory_id` bigint NOT NULL AUTO_INCREMENT,
    `updated` datetime(6) NOT NULL,
    `user_key` binary(16) NOT NULL,
    `name` varchar(50) NOT NULL,
    `account_no` varchar(255) NOT NULL,
    PRIMARY KEY (`directory_id`),
    KEY `FKsouad3hkirwbem2jr85w8wjgi` (`user_key`),
    CONSTRAINT `FKsouad3hkirwbem2jr85w8wjgi` FOREIGN KEY (`user_key`) REFERENCES `user` (`user_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- pob.media
CREATE TABLE IF NOT EXISTS `media` (
                                       `media_id` bigint NOT NULL AUTO_INCREMENT,
                                       `transaction_unique_no` bigint DEFAULT NULL,
                                       `url` varchar(255) DEFAULT NULL,
    `type` varbinary(255) DEFAULT NULL,
    PRIMARY KEY (`media_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- pob.pending_history
CREATE TABLE IF NOT EXISTS `pending_history` (
                                                 `is_accepted` bit(1) DEFAULT NULL,
    `pending_history_id` int NOT NULL AUTO_INCREMENT,
    `transaction_balance` bigint NOT NULL,
    `account_no` varchar(255) NOT NULL,
    `transaction_account_no` varchar(255) NOT NULL,
    `transaction_memo` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`pending_history_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- pob.subscription
CREATE TABLE IF NOT EXISTS `subscription` (
                                              `daily_transfer_limit` bigint DEFAULT NULL,
                                              `one_time_transfer_limit` bigint DEFAULT NULL,
                                              `subscription_id` bigint NOT NULL AUTO_INCREMENT,
                                              `protect_key` binary(16) NOT NULL,
    `target_key` binary(16) NOT NULL,
    PRIMARY KEY (`subscription_id`),
    UNIQUE KEY `UKle63j4ivkd6vytt6ga67stvmr` (`protect_key`),
    UNIQUE KEY `UKfn9yr61dtntn6966d83r31lok` (`target_key`),
    CONSTRAINT `FK2to29b09epqd70pbyasgdvlgq` FOREIGN KEY (`protect_key`) REFERENCES `user` (`user_key`),
    CONSTRAINT `FKjhod4mqipp8vusa9n5i0h84oc` FOREIGN KEY (`target_key`) REFERENCES `user` (`user_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
