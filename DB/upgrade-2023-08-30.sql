ALTER TABLE `eth_transactions` 
    MODIFY COLUMN `state` smallint(6) NOT NULL DEFAULT 0 COMMENT '交易状态' AFTER `is_broadcasted`,
    ADD COLUMN `contract_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '合约地址' AFTER `asset_symbol`;

ALTER TABLE `bsc_transactions` 
    MODIFY COLUMN `state` smallint(6) NOT NULL DEFAULT 0 COMMENT '交易状态' AFTER `is_broadcasted`,
    ADD COLUMN `contract_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '合约地址' AFTER `asset_symbol`;

ALTER TABLE `tron_transactions` 
    MODIFY COLUMN `state` smallint(6) NOT NULL DEFAULT 0 COMMENT '交易状态' AFTER `is_broadcasted`,
    ADD COLUMN `contract_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '合约地址' AFTER `asset_symbol`;