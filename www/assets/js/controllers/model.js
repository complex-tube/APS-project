class Model {
    generatorController;
    handlerController;
    buffer;
    setterController;
    getterController;

    constructor(generatorsNumber, buffersNumber, handlersNumber) {
        this.createModel(generatorsNumber, buffersNumber, handlersNumber);
    }

    createModel(generatorsNumber, buffersNumber, handlersNumber) {
        Generator.generatorId = 0;
        BufferUnit.bufferId = 0;
        Handler.handlerId = 0;
        this.generatorController = new GeneratorController(generatorsNumber);
        this.handlerController = new HandlerController(handlersNumber);
        this.buffer = new Buffer(buffersNumber);
        this.setterController = new SetterController(this.handlerController, this.buffer);
        this.getterController = new GetterController(this.handlerController, this.buffer);
    }

    doModel(requestsNumber) {
        Request.requestId = 0;
        this.generatorController.generateRequests(requestsNumber);
        this.generatorController.requestsList.forEach((request) => {
            this.getterController.work(request);
            this.setterController.work(request);
        });
        while (this.buffer.isAnyBufferUnitFilled()) {
            this.getterController.freeBuffer();
        }
        let allReleasedTime = 0;
        let maxReleasedTime = Math.max(...this.handlerController.handlersList.map(handler => {return handler.releasedTime}));
        allReleasedTime = maxReleasedTime - this.generatorController.requestsList[0].generatedTime;
        this.handlerController.handlersList.forEach(handler => {
            handler.calculateRateOfUsability(this.generatorController.requestsList, allReleasedTime);
        });
        this.generatorController.generatorsList.forEach(generator => {
            generator.calculateGeneratorStats();
        });
    }
}