class Handler {
    static handlerId = 0;
    rateOfWork = 1; // 5 per hour
    releasedTime = 0;
    sumOfWorkTime = 0;
    rateOfUsability = 0;
    handlerId;
    request = null;

    constructor() {
        Handler.handlerId++;
        this.handlerId = Handler.handlerId;
        this.sumOfWorkTime = 0;
    }

    workWithRequest(request) {
        const randomNumber = randomExponential(this.rateOfWork);
        this.rateOfUsability += randomNumber;
        this.request = request;
        request.releasedTime = this.releasedTime = (request.bufferedTime + randomNumber);
        request.handlerId = this.handlerId;
        request.isShown = false;
    }

    calculateRateOfUsability(requestsList, sumTimeOfWork) {
        this.rateOfUsability /= sumTimeOfWork;
    }
}

class HandlerController {
    handlersList = Array();
    constructor(handlersNumber) {
        for (let handlerCounter = 0; handlerCounter < handlersNumber; handlerCounter++) {
            this.handlersList.push(new Handler());
        }
    }

    getFreeHandler(releasedTime) {
        for (let handlerCounter = 0; handlerCounter < this.handlersList.length; handlerCounter++) {
            if (this.handlersList[handlerCounter].releasedTime <= releasedTime) {
                return this.handlersList[handlerCounter];
            }
        }
        return null;
    }

    getFreeHandlers(timePoint) {
        const freeHandlers = [];
        for (let handlerCounter = 0; handlerCounter < this.handlersList.length; handlerCounter++) {
            if (this.handlersList[handlerCounter].releasedTime <= timePoint) {
                freeHandlers.push(this.handlersList[handlerCounter]);
            }
        }
        return freeHandlers;
    }

    getMinHandler() {
        let minHandler = this.handlersList[0];
        for (let handlerCounter = 1; handlerCounter < this.handlersList.length; handlerCounter++) {
            if (this.handlersList[handlerCounter].releasedTime < minHandler.releasedTime) {
                minHandler = this.handlersList[handlerCounter];
            }
        }
        return minHandler;
    }

    getMaxHandler() {
        let maxHandler = this.handlersList[0];
        for (let handlerCounter = 1; handlerCounter < this.handlersList.length; handlerCounter++) {
            if (this.handlersList[handlerCounter].releasedTime > maxHandler.releasedTime) {
                maxHandler = this.handlersList[handlerCounter];
            }
        }
        return maxHandler;
    }

    isAnyHandlerWorking(timePoint) {
        for (let handlerCounter = 0; handlerCounter < this.handlersList.length; handlerCounter++) {
            if (this.handlersList[handlerCounter].releasedTime > timePoint) {
                return true;
            }
        }
        return false;
    }
}

