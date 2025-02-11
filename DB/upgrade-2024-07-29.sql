ALTER TABLE `bfmchain_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `bfchainv2_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `ccchain_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `pmchain_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;
    
ALTER TABLE `ethmeta_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `btcmeta_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `btgmeta_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;

ALTER TABLE `biwmeta_transactions` 
    MODIFY COLUMN `tr_json` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '交易体' AFTER `link_id`;