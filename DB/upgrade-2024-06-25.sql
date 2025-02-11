CREATE TABLE IF NOT EXISTS `wallet_airdrop_order` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `entity_id` varchar(50) NOT NULL DEFAULT '' COMMENT '唯一id',
    `mq_id` varchar(255) NOT NULL DEFAULT '' COMMENT '消息队列id',
    `type` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '空投类型',
    `chain_name` varchar(10) NOT NULL DEFAULT '' COMMENT '空投链名',
    `state` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '订单状态',
    `issue_dp_info` varchar(2000) NOT NULL DEFAULT '{}' COMMENT 'dp发行信息',
    `issue_tx_id` varchar(50) NOT NULL DEFAULT '' COMMENT '空投发行交易id',
    `transfer_address` varchar(255) NOT NULL DEFAULT '' COMMENT '空投转移地址',
    `transfer_tx_id` varchar(50) NOT NULL DEFAULT '' COMMENT '空投转移交易id',
    `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `del_flag` tinyint(2) NOT NULL DEFAULT '0' COMMENT '逻辑删除标志：0：正常，1：删除，默认0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_entityId` (`entity_id`) USING BTREE,
    UNIQUE KEY `uniq_issueTxId` (`issue_tx_id`) USING BTREE,
    UNIQUE KEY `uniq_transferTxId` (`transfer_tx_id`) USING BTREE,
    KEY `idx_state` (`state`) USING BTREE,
    KEY `idx_type_state` (`type`, `state`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='空投订单表';

CREATE TABLE IF NOT EXISTS `wallet_airdrop_transfer_tx` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `order_id` varchar(50) NOT NULL DEFAULT '' COMMENT '订单id',
    `dp_no` smallint(6) NOT NULL DEFAULT 0 COMMENT 'dp编号',
    `address` varchar(255) NOT NULL DEFAULT '' COMMENT 'dp转移地址',
    `transfer_tx_id` varchar(50) NOT NULL DEFAULT '' COMMENT '空投转移交易id',
    `transfer_tx_onchain` tinyint(1) NOT NULL DEFAULT 0 COMMENT '转移交易已上链',
    `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_dpNo` (`order_id`, `dp_no`) USING BTREE,
    UNIQUE KEY `uniq_transferTxId` (`transfer_tx_id`) USING BTREE,
    KEY `idx_orderId` (`order_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='空投转移交易表';
