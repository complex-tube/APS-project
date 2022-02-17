class GetterController {
    handlerController = null;
    buffer = null;
    constructor(handlerController, buffer) {
        this.handlerController = handlerController;
        this.buffer = buffer;
    }

    work(request) {
        const freeHandlers = this.handlerController.getFreeHandlers(request.generatedTime);
        const returnStates = [];
        const buffersList = [];
        for (let bufferCounter = 0; bufferCounter < this.buffer.bufferLength; bufferCounter++) {
            buffersList.push(this.buffer.getBufferById(bufferCounter + 1).getRequest());
        }
        freeHandlers.sort((firstHandler, secondHandler) => firstHandler.releasedTime - secondHandler.releasedTime);
        freeHandlers.forEach((handler, handlerIndex) => {
            const handlersList = [];
            for (let handlerCounter = 0; handlerCounter < this.handlerController.handlersList.length; handlerCounter++) {
                handlersList.push(this.handlerController.handlersList[handlerCounter].request);
            }
            if (handler.request !== null) {
                returnStates.push({
                    freeHandler: handler,
                    oldRequest: handler.request,
                    handlersState: handlersList,
                    buffersState: buffersList
                });
            }
        })
        while (this.handlerController.getFreeHandler(request.generatedTime, !this.buffer.isAnyBufferUnitFilled(), true) !== null) {
            const requestFromBuffer = this.getRequestFromBuffer(request.generatedTime);
            if (requestFromBuffer !== null) {
                this.sendRequestToHandler(requestFromBuffer);
            } else {
                break;
            }
        }
        console.log(returnStates);
        return returnStates;
    }

    freeBuffer() {
        const returnStructure = {
            oldRequest: null,
            handlersState: [],
            buffersState: [],
        }
        const minHandler = this.handlerController.getMinHandler();
        returnStructure.oldRequest = minHandler.request;
        for (let handlerCounter = 0; handlerCounter < this.handlerController.handlersList.length; handlerCounter++) {
            returnStructure.handlersState.push(this.handlerController.handlersList[handlerCounter].request);
        }
        for (let bufferCounter = 0; bufferCounter < this.buffer.bufferLength; bufferCounter++) {
            returnStructure.buffersState.push(this.buffer.getBufferById(bufferCounter + 1).getRequest());
        }
        const request = this.buffer.getRequest(minHandler.releasedTime);
        this.sendLastRequestFromBuffer(request);
        console.log(returnStructure);
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