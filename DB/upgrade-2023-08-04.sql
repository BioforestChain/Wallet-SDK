ALTER TABLE `eth_transactions` 
    ADD COLUMN `is_broadcasted` tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '交易体已广播' AFTER `tx_hash`;
UPDATE `eth_transactions` SET `is_broadcasted` = (CASE WHEN `entity_id` = `tx_hash` THEN 0 ELSE 1 END);

ALTER TABLE `bsc_transactions` 
    ADD COLUMN `is_broadcasted` tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '交易体已广播' AFTER `tx_hash`;
UPDATE `bsc_transactions` SET `is_broadcasted` = (CASE WHEN `entity_id` = `tx_hash` THEN 0 ELSE 1 END);

ALTER TABLE `tron_transactions` 
    ADD COLUMN `is_broadcasted` tinyint(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '交易体已广播' AFTER `tx_hash`;
UPDATE `tron_transactions` SET `is_broadcasted` = (CASE WHEN `entity_id` = `tx_hash` THEN 0 ELSE 1 END);
