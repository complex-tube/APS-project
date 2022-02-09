deviceEnum = {
    GENERATOR: 0,
    BUFFER: 1,
    HANDLER: 2,
    REFUSE: 3
}

class RequestChart {
    id;
    data = [];

    constructor(id) {
        this.id = id;
    }
}

class Line {
    id;
    deviseType;
    positionPair = Array();

    constructor(id, deviseType, positionPair) {
        this.id = id;
        this.deviseType = deviseType;
        this.positionPair = positionPair;
    }
}

class ChartDrawer {

    chart = null;
    chartElement = null;
    lineList = Array();
    requestChartsList = Array();
    skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

    constructor(chartElement, model) {
        this.chartElement = chartElement;
        this.chart = new Chart(this.chartElement, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                // scales: {
                //     yAxis: {
                //         display: false
                //     }
                // }
            }
        });
    }

    initChart(model) {
        let upsidePosition = 100;
        let downsidePosition = upsidePosition - 1;
        model.generatorController.generatorsList.forEach((generator) => {
            const line = new Line(generator.generatorId, deviceEnum.GENERATOR, [upsidePosition, downsidePosition]);
            this.lineList.push(line);
            upsidePosition--;
            downsidePosition--;
        });
        for (let bufferCounter = 1; bufferCounter < model.buffer.bufferLength + 1; bufferCounter++) {
            const line = new Line(bufferCounter, deviceEnum.BUFFER, [upsidePosition, downsidePosition]);
            this.lineList.push(line);
            upsidePosition--;
            downsidePosition--;
        }
        model.handlerController.handlersList.forEach((handler) => {
           const line = new Line(handler.handlerId, deviceEnum.HANDLER, [upsidePosition, downsidePosition]);
           this.lineList.push(line);
            upsidePosition--;
            downsidePosition--;
        });
        const line = new Line(0, deviceEnum.REFUSE, [upsidePosition, downsidePosition]);
        this.lineList.push(line);
        model.generatorController.requestsList.forEach((request) => {
            const requestChart = new RequestChart(request.requestId);
            this.requestChartsList.push(requestChart);
            this.chart.data.datasets.push({
                label: `Заявка-${requestChart.id}`,
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                segment: {
                    borderColor: ctx => this.skipped(ctx, 'rgb(0,0,0,0.2)'),
                    borderDash: ctx => this.skipped(ctx, [6, 6])
                },
                spanGaps: true
            });
        });
    }

    drawRequest(requestStructureFromSetterController, requestStructureFromGetterController) {
        //const chart = document.querySelector('.chart');
        // const requestChart = this.findRequestChart(requestStructureFromSetterController.requestId);
        // let refusedRequestChart = null;
        // let generatorDownSidePosition = 0;
        // this.lineList.forEach((line) => {
        //     if (line.deviseType === deviceEnum.GENERATOR && requestStructureFromSetterController.generatorId === line.id) {
        //         const dataset = this.findDataset(requestStructureFromSetterController.requestId);
        //         dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: line.positionPair[0]});
        //         dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: line.positionPair[1]});
        //         generatorDownSidePosition = line.positionPair[1];
        //     }
        //     if (line.deviseType === deviceEnum.BUFFER && requestStructureFromSetterController.bufferId === line.id) {
        //         const dataset = this.findDataset(requestStructureFromSetterController.requestId);
        //         dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), NaN});
        //         dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: line.positionPair[0]});
        //     }
        // });
        // if (requestStructureFromSetterController.isRefused) {
        //     this.lineList.forEach((line) => {
        //         if (line.deviseType === deviceEnum.BUFFER && requestStructureFromSetterController.bufferId === line.id) {
        //             refusedRequestChart = this.findRequestChart(requestStructureFromSetterController.refusedRequestId);
        //             console.log(refusedRequestChart);
        //             const dataset = this.findDataset(requestStructureFromSetterController.refusedRequestId);
        //             dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: line.positionPair[0]});
        //             dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: NaN});
        //             dataset.data.push({x: requestStructureFromSetterController.requestId.toFixed(5), y: this.lineList[this.lineList.length - 1].positionPair[1]});
        //             console.log(dataset);
        //         }
        //     });
        // }
        // if (requestStructureFromGetterController !== null) {
        //
        // }
        // this.chart.update();
    }

    findDataset(requestId) {
        for (let datasetCounter = 0; datasetCounter < this.chart.data.datasets.length; datasetCounter++) {
            if (Number(this.chart.data.datasets[datasetCounter].label.split('-')[1]) === requestId) {
                return this.chart.data.datasets[datasetCounter];
            }
        }
        return null;
    }

    findRequestChart(requestId) {
        for (let requestChartCounter = 0; requestChartCounter < this.requestChartsList.length; requestChartCounter++) {
            if (this.requestChartsList[requestChartCounter].id === requestId) {
                return this.requestChartsList[requestChartCounter];
            }
        }
        return null;
    }

    drawRequestGeneration(chartLine) {

    }
}