import type { NetWorkHelper } from "@bnqkl/wallet";

export abstract class CommonApi {
    // static async getToken(argv: MetaLordCore.Verify.GetTokenReq, networkHelper: NetWorkHelper) {
    //     const apiPath = "metalord/verify/token";
    //     Logger.debug("getToken = ", argv);
    //     const result = await networkHelper.post<MetaLordCore.Verify.GetTokenReq, MetaLordCore.Verify.GetTokenResp>(apiPath, argv);
    //     return result;
    // }

    static async login(info: WalletTest.Account["info"], networkHelper: NetWorkHelper) {
        const { deviceId, secret, secret2 } = info;
        // const authInfos: MetaLordCore.Verify.AuthInfo[] = [];
        // const argv = { secret, deviceId };
        // authInfos.push(await BaseHelper.signWithBioforest(argv));
        // authInfos.push(await BaseHelper.signWithEthereum(argv));
        // authInfos.push(await BaseHelper.signWithBsc(argv));
        // authInfos.push(await BaseHelper.signWithTron({ ...argv, secret: secret2 }));
        // const { token, addressCode } = await this.getToken({ deviceId, authInfos }, networkHelper);
        // // token
        // Logger.debug(`token =`, token);
        // networkHelper.httpToken = token;
        // const address = authInfos[0].address;
        // return addressCode[address];
    }
}
