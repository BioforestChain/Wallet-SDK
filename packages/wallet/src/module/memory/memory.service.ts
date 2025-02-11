import { forwardRef, Injectable, Inject } from "@nestjs/common";
import { PromiseOut } from "@bnqkl/util-node";

@Injectable()
export class MemoryService {
    private __internalOnChainQueueInitedPromise = new PromiseOut<void>();
    /**
     * 等待mq内链上链相关队列初始化完毕
     */
    waitInternalOnChainQueueInited() {
        return this.__internalOnChainQueueInitedPromise.promise;
    }

    /**
     * 设置mq内链上链相关队列初始化完毕
     */
    setInternalOnChainQueueInited() {
        return this.__internalOnChainQueueInitedPromise.resolve();
    }
}
