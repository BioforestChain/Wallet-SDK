-- 外链
ALTER TABLE `eth_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `state`;

ALTER TABLE `bsc_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `state`;

ALTER TABLE `tron_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `state`;

-- 内链
ALTER TABLE `bfchain_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `fail_height`;

ALTER TABLE `bfmchain_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `fail_height`;

ALTER TABLE `ccchain_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `fail_height`;

ALTER TABLE `pmchain_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `fail_height`;

ALTER TABLE `ethmeta_transactions` 
    ADD COLUMN `fail_reason` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '失败原因' AFTER `fail_height`;

