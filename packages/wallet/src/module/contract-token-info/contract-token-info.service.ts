import { Injectable, Inject } from "@nestjs/common";
import { memTimeCache, MEM_TIME_CACHE_STRATEGY, getPagination, Logger, BaseRepository, ExternalChainName } from "@bnqkl/wallet-sdk";
import type { DataSource } from "typeorm";
import type { TokenInfoDetailReqDto, TokenInfoListReqDto } from "./dto/index.js";
import { ContractTokenInfo } from "../../common/entity/index.js";
import { externalChainHelper } from "../../helper/index.js";

@Injectable()
export class ContractTokenInfoRepository extends BaseRepository<ContractTokenInfo> {
    constructor(dataSource: DataSource) {
        super(ContractTokenInfo, dataSource);
    }
}

@Injectable()
export class ContractTokenInfoService {
    @Inject(ContractTokenInfoRepository)
    public readonly repository!: ContractTokenInfoRepository;

    getInfoListByPage(dto: TokenInfoListReqDto) {
        return this.findByPage(dto.page, dto.pageSize, dto.chain, dto.keywords, dto.contractAddress);
    }

    getTokenInfoDetail(dto: TokenInfoDetailReqDto) {
        return this.findDetail(dto.chain, dto.symbol);
    }

    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.TEN_MINUTE })
    async getTokenInfoMap(chain: ExternalChainName): Promise<Map<string, ContractTokenInfo>> {
        const tokenList = await this.getTokenInfoByChain(chain);
        // 为空的情况下，必须先进行初始化
        const resultMap = new Map<string, ContractTokenInfo>();
        tokenList?.forEach((token) => {
            if (ExternalChainName.TRON === chain) {
                /** 波场地址兼容性处理 */
                const tronAddress = externalChainHelper.convertTronAddress(token.address);
                resultMap.set(tronAddress.base58.toLocaleLowerCase(), token);
                resultMap.set(tronAddress.hex.toLocaleLowerCase(), token);
            } else {
                resultMap.set(token.address?.toLowerCase(), token);
            }
        });
        return resultMap;
    }

    getTokenInfoByChain(chain: ExternalChainName) {
        return this.findByChain(chain);
    }

    private async findByPage(page: number, pageSize: number, chain: ExternalChainName, keywords: string, contractAddress: string) {
        if (contractAddress && contractAddress.length >= 34) {
            // 精准匹配
            const tokenMap = await this.getTokenInfoMap(chain);
            const token = tokenMap.get(contractAddress.toLowerCase());
            const pagination = getPagination(page, pageSize, token ? 1 : 0);
            return {
                data: token ? [token] : [],
                ...pagination,
            };
        }
        const getList = keywords && keywords.length > 0 ? this.search(page, pageSize, chain, keywords) : this.queryByPage(page, pageSize, chain);
        const [list, total] = await getList;
        const pagination = getPagination(page, pageSize, total);
        return {
            data: list,
            ...pagination,
        };
    }

    private async queryByPage(page: number, pageSize: number, chain: string) {
        try {
            return this.repository
                .createQueryBuilder("contract_token_info")
                .select([
                    "contract_token_info.chain",
                    "contract_token_info.name",
                    "contract_token_info.symbol",
                    "contract_token_info.address",
                    "contract_token_info.icon",
                    "contract_token_info.decimals",
                ])
                .where("contract_token_info.chain = :chain", {
                    chain: chain,
                })
                .orderBy("contract_token_info.symbol", "ASC")
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
        } catch (error) {
            Logger.error(error);
            return [];
        }
    }

    private async search(page: number, pageSize: number, chain: string, keywords: string) {
        try {
            return this.repository
                .createQueryBuilder("contract_token_info")
                .select([
                    "contract_token_info.chain",
                    "contract_token_info.name",
                    "contract_token_info.symbol",
                    "contract_token_info.address",
                    "contract_token_info.icon",
                    "contract_token_info.decimals",
                ])
                .where("contract_token_info.chain = :chain", {
                    chain: chain,
                })
                .andWhere("contract_token_info.symbol like :symbol", {
                    symbol: `${keywords}%`,
                })
                .orderBy("contract_token_info.symbol", "ASC")
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
        } catch (error) {
            Logger.error(error);
            return [];
        }
    }

    private async findDetail(chain: string, symbol: string) {
        try {
            return await this.repository
                .createQueryBuilder("contract_token_info")
                .select([
                    "contract_token_info.chain",
                    "contract_token_info.name",
                    "contract_token_info.address",
                    "contract_token_info.icon",
                    "contract_token_info.symbol",
                    "contract_token_info.decimals",
                    "contract_token_info.totalSupply",
                    "contract_token_info.website",
                    "contract_token_info.publishTime",
                ])
                .where("contract_token_info.chain = :chain AND contract_token_info.symbol = :symbol", {
                    chain: chain,
                    symbol: symbol,
                })
                .getOne();
        } catch (error) {
            Logger.error(error);
        }
        return null;
    }

    private async findByChain(chain: ExternalChainName) {
        try {
            return await this.repository.find({ where: { chain } });
        } catch (error) {
            Logger.error(error);
        }
        return [];
    }

    /**
     * 获取合约token信息
     * @param chain
     * @param contractAddress
     * @returns
     */
    @memTimeCache({ time: MEM_TIME_CACHE_STRATEGY.ONE_HOUR })
    async getContractInfoForce(chain: ExternalChainName, contractAddress: string) {
        return await this.repository.findOneForce({ where: { chain, address: contractAddress } });
    }
}
