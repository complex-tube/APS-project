class Request {
    static requestId = 0;
    requestId;
    generatorId;
    handlerId;
    bufferId;
    generatedTime = 0;
    bufferedTime = 0;
    releasedTime = 0;
    refusedTime = 0;
    constructor(generationTime, generatorId) {
        Request.requestId++;
        this.requestId = Request.requestId;
        this.generatorId = generatorId;
        this.generatedTime = generationTime;
    }
}