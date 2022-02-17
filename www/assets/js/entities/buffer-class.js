class BufferUnit {
    static bufferId = 0;
    bufferId;
    request = null;
    nextUnitBuffer = null;

    constructor() {
        BufferUnit.bufferId++;
        this.bufferId = BufferUnit.bufferId;
    }

    getRequest() {
        return this.request;
    }

    setRequest(request) {
        this.request = request;
    }

    setNextBufferUnit(bufferUnit) {
        this.nextUnitBuffer = bufferUnit;
    }

    getNextBufferUnit() {
        return this.nextUnitBuffer;
    }
}

class Buffer {
    currentSetterBuffer = null;
    currentGetterBuffer = null;
    currentBufferPointer = null;
    bufferLength;
    refusedList = Array();

    constructor(bufferLength) {
        this.bufferLength = Number(bufferLength);
        const initBufferUnit = new BufferUnit();
        this.currentSetterBuffer = this.currentGetterBuffer = this.currentBufferPointer = initBufferUnit;
        for (let bufferUnitCounter = 1; bufferUnitCounter < bufferLength; bufferUnitCounter++) {
            const newBufferUnit = new BufferUnit();
            this.currentBufferPointer.setNextBufferUnit(newBufferUnit);
            this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
        }
        this.currentBufferPointer.setNextBufferUnit(initBufferUnit);
        this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
    }

    setRequest(request) {
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            if (this.currentSetterBuffer.getRequest() === null) {
                request.bufferId = this.currentSetterBuffer.bufferId;
                this.currentSetterBuffer.setRequest(request);
                this.currentSetterBuffer = this.currentSetterBuffer.getNextBufferUnit();
                break;
            }
            this.currentSetterBuffer = this.currentSetterBuffer.getNextBufferUnit();
        }
    }

    getRequest(gettingTime) {
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            if (this.currentGetterBuffer.getRequest() !== null) {
                const request = this.currentGetterBuffer.getRequest();
                request.bufferedTime = gettingTime;
                this.currentGetterBuffer.setRequest(null);
                this.currentGetterBuffer = this.currentGetterBuffer.getNextBufferUnit();
                return request;
            }
            this.currentGetterBuffer = this.currentGetterBuffer.getNextBufferUnit();
        }
        return null;
    }

    getBufferById(bufferId) {
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            if (this.currentBufferPointer.bufferId === bufferId) {
                const bufferUnitById = this.currentBufferPointer;
                this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
                return bufferUnitById;
            }
            this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
        }
        return null;
    }

    getBuffersList() {
        const buffersList = [];
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            buffersList.push(this.getBufferById(bufferCounter + 1));
        }
        return buffersList;
    }

    refuseRequest(request) {
        let minBufferUnit = this.currentBufferPointer;
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
            if (minBufferUnit.getRequest().generatedTime > this.currentBufferPointer.getRequest().generatedTime) {
                minBufferUnit = this.currentBufferPointer;
            }
        }
        const refuseRequest = minBufferUnit.getRequest();
        this.refusedList.push(refuseRequest);
        refuseRequest.bufferedTime = request.generatedTime;
        minBufferUnit.setRequest(request);
        request.bufferId = minBufferUnit.bufferId;
        return refuseRequest;
    }

    isAnyBufferUnitFree() {
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            if (this.currentBufferPointer.getRequest() === null) {
                return true;
            }
            this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
        }
        return false;
    }

    isAnyBufferUnitFilled() {
        for (let bufferCounter = 0; bufferCounter < this.bufferLength; bufferCounter++) {
            if (this.currentBufferPointer.getRequest() !== null) {
                return true;
            }
            this.currentBufferPointer = this.currentBufferPointer.getNextBufferUnit();
        }
        return false;
    }
}