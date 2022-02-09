class Generator {
    static generatorId = 0;
    static lambda = 1.25;
    generatorId;
    lastGeneratedTime;
    requestsList;
    probabilityOfRefuse = 0;
    avgTimeOfWork = 0;
    avgTimeOfHandling = 0;
    avgTimeOfBuffering = 0;

    constructor() {
        Generator.generatorId++;
        this.generatorId = Generator.generatorId;
        this.lastGeneratedTime = 0;
        this.requestsList = Array();
    }

    generateRequest() {
        this.lastGeneratedTime += (-1 / Generator.lambda * Math.log(Math.random()));
        const request = new Request(this.lastGeneratedTime, this.generatorId);
        request.generatorId = this.generatorId;
        this.requestsList.push(request);
        return request;
    }

    calculateProbabilityOfRefuse() {
        let numberOfRefuse = 0;
        this.requestsList.forEach(request => {
            if (request.releasedTime === 0) {
                numberOfRefuse++;
            }
        });
        return numberOfRefuse / this.requestsList.length;
    }

    calculateGeneratorStats() {
        this.requestsList.forEach(request => {
           if (request.releasedTime === 0) {
               this.probabilityOfRefuse += (1 / this.requestsList.length);
           } else {
               this.avgTimeOfHandling += ((request.releasedTime - request.bufferedTime) / this.requestsList.length);
           }
           this.avgTimeOfBuffering += ((request.bufferedTime - request.generatedTime) / this.requestsList.length);
           this.avgTimeOfWork = this.avgTimeOfBuffering + this.avgTimeOfHandling;
        });
    }
}

class GeneratorController {
    generatorsList = Array();
    requestsList = Array();

    constructor(generatorsNumber) {
        for (let generatorsCounter = 0; generatorsCounter < generatorsNumber; generatorsCounter++) {
            this.generatorsList.push(new Generator());
        }
    }

    generateRequest() {
        let actualGenerator = this.generatorsList[0];
        for (let j = 0; j < this.generatorsList.length; j++) {
            if (this.generatorsList[j].lastGeneratedTime < actualGenerator.lastGeneratedTime) {
                actualGenerator = this.generatorsList[j];
            }
        }
        return actualGenerator.generateRequest();
    }

    generateRequests(requestsNumber) {
        for (let requestCounter = 0; requestCounter < requestsNumber; requestCounter++) {
            this.requestsList.push(this.generateRequest());
        }
        this.requestsList.sort((firstRequest, secondRequest) => {
            return firstRequest.generatedTime - secondRequest.generatedTime;
        });
        return this.requestsList;
    }
}