class GetterController {
    handlerController = null;
    buffer = null;
    constructor(handlerController, buffer) {
        this.handlerController = handlerController;
        this.buffer = buffer;
    }

    work(request) {
        // if (freeHandler !== null) {
        //     if (this.buffer.isAnyBufferUnitFree() !== true) {
        //         this.sendRequestToHandler(this.getRequestFromBuffer(request.generatedTime));
        //     }
        // }
        const requestList = [];
        while (this.handlerController.getFreeHandler(request.generatedTime) !== null) {
            const requestFromBuffer = this.getRequestFromBuffer(request.generatedTime);
            if (requestFromBuffer !== undefined) {
                const request = this.sendRequestToHandler(requestFromBuffer);
                requestList.push(request);
            } else {
                break;
            }
        }
        // if (freeHandler !== null) {
        //     const requestFromBuffer = this.getRequestFromBuffer(request.generatedTime);
        //     return this.sendRequestToHandler(requestFromBuffer);
        // }
        return requestList;
    }

    freeBuffer() {
        const returnStructure = {
            requestId: 0,
            bufferId: 0,
            handlerId: 0,
            bufferedTime: 0,
            releasedTime: 0
        }
        const request = this.buffer.getRequest(this.handlerController.getMinHandler().releasedTime);
        this.sendLastRequestFromBuffer(request);
        returnStructure.requestId = request.requestId;
        returnStructure.bufferId = request.bufferId;
        returnStructure.handlerId = request.handlerId;
        returnStructure.bufferedTime = request.bufferedTime;
        returnStructure.releasedTime = request.releasedTime;
        return returnStructure;
    }

    sendLastRequestFromBuffer(request) {
        this.handlerController.getMinHandler().workWithRequest(request);
    }

    getRequestFromBuffer(generatedTime) {
        return this.buffer.getRequest(generatedTime);
    }

    sendRequestToHandler(request) {
        this.handlerController.getFreeHandler(request.bufferedTime).workWithRequest(request);
        return request;
    }
}