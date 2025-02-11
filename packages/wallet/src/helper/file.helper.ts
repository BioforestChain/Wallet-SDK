import * as fs from "fs";
import * as crypto from "node:crypto";
import path from "path/posix";
import { staticConfig } from "../config";
import { BLOBS_SAVE_DIR, BLOBS_TEMPS_SAVE_DIR, BLOB_IN_TRS_REMARK_PREFIX } from "../common";

export class FileHelper {
    /**
     * 保存blob文件
     * @param file
     * @returns
     */
    static saveBlobFile(file: Express.Multer.File): string {
        // 校验文件类型
        const fileTypes: string[] = staticConfig.blob.types;
        if (!fileTypes.includes(file.mimetype)) {
            throw Error(`saveBlobFile failed, file type not allowed：file.mimetype=${file.mimetype}`);
        }
        // 限制文件大小
        let fileSizeLimit = staticConfig.blob.maxSize;
        if (file.size > fileSizeLimit) {
            throw Error(`saveBlobFile failed, file.size:${file.size} > fileSizeLimit:${fileSizeLimit}`);
        }
        const uploadFilePath = path.join(process.cwd(), staticConfig.blob.uploadRootPath, BLOBS_TEMPS_SAVE_DIR);
        if (!fs.existsSync(uploadFilePath)) {
            throw Error(`uploadFilePath:${uploadFilePath} doesn't exists`);
        }
        const buffer = file.buffer;
        const hash = crypto.createHash("sha256").update(buffer).digest().toString("hex");
        const destFilePath = path.join(uploadFilePath, hash);
        if (!fs.existsSync(destFilePath)) {
            fs.writeFileSync(destFilePath, buffer);
        } else {
            const newTime = Math.floor(new Date().getTime() / 1000);
            fs.utimesSync(destFilePath, newTime, newTime);
        }
        return `${BLOB_IN_TRS_REMARK_PREFIX.SHA256}${hash}?size=${file.size}`;
    }

    /**
     * 获取blob文件的路径
     * @param hash
     */
    static getBlobPath(hash: string): string {
        let filePath = path.join(process.cwd(), staticConfig.blob.uploadRootPath, BLOBS_TEMPS_SAVE_DIR, hash);
        if (!fs.existsSync(filePath)) {
            filePath = path.join(process.cwd(), staticConfig.blob.uploadRootPath, BLOBS_SAVE_DIR, hash);
            if (!fs.existsSync(filePath)) {
                throw Error(`blob hash:${hash} is not found`);
            }
        }
        return filePath;
    }
}
