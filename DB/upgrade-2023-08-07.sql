-- 外链
ALTER TABLE `eth_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

ALTER TABLE `bsc_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

ALTER TABLE `tron_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

-- 内链
ALTER TABLE `bfchain_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

ALTER TABLE `bfmchain_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

ALTER TABLE `ccchain_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;

ALTER TABLE `pmchain_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;
    
ALTER TABLE `ethmeta_transactions` 
    ADD COLUMN `mq_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '消息队列id' AFTER `chain_name`;
