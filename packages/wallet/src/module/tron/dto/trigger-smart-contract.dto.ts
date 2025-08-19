import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

export enum ContractFunctionEnum {
    transaction = "transfer(address, uint256)",
    balance = "balanceOf(address)",
    decimal = "decimals()",
}

export class TriggerSmartContractDto implements WalletTypings.Tron.Api.TronCreateContractTransReqDto {
    @ApiProperty({ description: "发起合约调用的账户地址 默认使用 Hex 地址" })
    owner_address!: string;

    @ApiProperty({ description: "合约地址 默认使用 Hex 地址" })
    contract_address!: string;

    @ApiProperty({ description: "所调用的函数", enum: ContractFunctionEnum })
    function_selector!: string;

    @ApiProperty({ description: "原始数据，包含转账地址和转账金额" })
    input!: BFChainWallet.TRON.TronContractParameter[];

    @ApiHideProperty()
    parameter?: string;

    @ApiProperty({ description: "最大消耗的 TRX 数量" })
    fee_limit?: number;

    @ApiProperty({ description: "本次调用往合约转账的 TRX 数量" })
    call_value?: number;

    @ApiProperty({
        description: "账户地址是否为 Base58check 格式，默认为 false，使用 Hex 地址",
        required: false,
        default: false,
    })
    visible?: boolean;
}
