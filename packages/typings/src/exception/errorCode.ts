export const enum ERROR_CODE_ENUM {
    PARAMETER_ERROR = 400,
    INVAILD_ADDRESS = 60001,
}
export const ERROR_CODE_OBJ = {
    [ERROR_CODE_ENUM.PARAMETER_ERROR]: "PARAMETER ERROR",
    [ERROR_CODE_ENUM.INVAILD_ADDRESS]: "invaild address, can not broadcast transaction",
};
