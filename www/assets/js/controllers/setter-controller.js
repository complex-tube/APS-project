class SetterController {
    handlerController = null;
    buffer = null;
    constructor(handlerController, buffer) {
        this.handlerController = handlerController;
        this.buffer = buffer;
    }
    work(request) {
        const returnStructure = {
            requestId: 0,
            bufferId: 0,
            generatorId: 0,
            generatedTime: 0,
            isRefused: false,
            refusedRequestId: 0
        }
        if (this.buffer.isAnyBufferUnitFree() === true) {
            this.sendRequestToBuffer(request);
        } else {
            returnStructure.refusedRequestId = this.sendRequestToRefuse(request).requestId;
            returnStructure.isRefused = true;
        }
        returnStructure.requestId = request.requestId;
        returnStructure.bufferId = request.bufferId;
        returnStructure.generatorId = request.generatorId;
        returnStructure.generatedTime = request.generatedTime;
        return returnStructure;
    }

    sendRequestToHandler(request) {
        this.buffer.setRequest(request);
        this.handlerController.getFreeHandler(request.generatedTime).workWithRequest(this.buffer.getRequest(request.generatedTime));
        return request;
    }

    sendRequestToBuffer(request) {
        this.buffer.setRequest(request);
        return request;
    }

    sendRequestToRefuse(request) {
        return this.buffer.refuseRequest(request);
    }
}
