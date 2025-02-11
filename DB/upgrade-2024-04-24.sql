-- 外链
ALTER TABLE `eth_transactions` 
    DROP INDEX `idx_status`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `bsc_transactions` 
    DROP INDEX `idx_status`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `tron_transactions` 
    DROP INDEX `idx_status`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

-- 内链
ALTER TABLE `bfchain_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `bfchainv2_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `bfmchain_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `ccchain_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `pmchain_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;
    
ALTER TABLE `ethmeta_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;

ALTER TABLE `btgmeta_transactions` 
    DROP INDEX `idx_state`,
    ADD INDEX `idx_state_linkType`(`state`, `link_type`) USING BTREE;