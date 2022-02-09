setSelectMode(3);

const generateButtonElement = document.querySelector('.content .content_container .generate');
const stepForwardButtonElement = document.querySelector('.content .content_container .step_forward');
const generatorsInput = document.querySelector('.content .content_container .model_inputs .generators_number input');
const buffersInput = document.querySelector('.content .content_container .model_inputs .buffers_number input');
const handlersInput = document.querySelector('.content .content_container .model_inputs .handlers_number input');
const requestsInput = document.querySelector('.content .content_container .inputs_block .requests_number input');
const timingDiagram = document.querySelector('.content .content_container .timing_diagram');
const titlesElement = document.querySelector('.content .content_container .timing_diagram .titles');
const generatorTitleTemplate = document.querySelector('.generator_title.hidden');
const handlerTitleTemplate = document.querySelector('.handler_title.hidden');
const bufferTitleTemplate = document.querySelector('.buffer_title.hidden');
const refuseTitleTemplate = document.querySelector('.refuse_title.hidden');
const timeTitleTemplate = document.querySelector('.time_title.hidden');
const timingDiagramValues = document.querySelector('.content .content_container .timing_diagram .values');
const generatorLines = document.querySelector('.content .content_container .generators');
const handlerLines = document.querySelector('.content .content_container .handlers');
const bufferLines = document.querySelector('.content .content_container .buffers');
const refuseLine = document.querySelector('.content .content_container .refuses');
const timeLine = document.querySelector('.content .content_container .times');
const generatorLineTemplate = document.querySelector('.generator.hidden');
const handlerLineTemplate = document.querySelector('.handler.hidden');
const bufferLineTemplate = document.querySelector('.buffer.hidden');
const requestTemplate = document.querySelector('.request.hidden');
const timeTemplate = document.querySelector('.time.hidden');
const chartElement = document.querySelector('.content .chart');

let model = null;
let requestsCounter = 0;
//const chartDrawer = new ChartDrawer(chartElement);

function initTimingDiagram(model) {
    model.generatorController.generatorsList.forEach(generator => {
        const generatorLine = generatorLineTemplate.cloneNode(true);
        const generatorTitle = generatorTitleTemplate.cloneNode(true);
        generatorTitle.textContent = `GEN-${generator.generatorId}`;
        generatorLines.appendChild(generatorLine);
        titlesElement.appendChild(generatorTitle);
        generatorTitle.show();
        generatorLine.show();
    });
    model.handlerController.handlersList.forEach(handler => {
        const handlerLine = handlerLineTemplate.cloneNode(true);
        const handlerTitle = handlerTitleTemplate.cloneNode(true);
        handlerTitle.textContent = `HAN-${handler.handlerId}`;
        handlerLines.appendChild(handlerLine);
        titlesElement.appendChild(handlerTitle);
        handlerTitle.show();
        handlerLine.show();
    });
    for (let bufferCounter = 0; bufferCounter < model.buffer.bufferLength; bufferCounter++) {
        const bufferLine = bufferLineTemplate.cloneNode(true);
        const bufferTitle = bufferTitleTemplate.cloneNode(true);
        bufferTitle.textContent = `BUF-${(bufferCounter + 1)}`;
        bufferLines.appendChild(bufferLine);
        titlesElement.appendChild(bufferTitle);
        bufferTitle.show()
        bufferLine.show();
    }
    const refuseTitle = refuseTitleTemplate.cloneNode(true);
    const timeTitle = timeTitleTemplate.cloneNode(true);
    refuseTitle.textContent = `REF`;
    timeTitle.textContent = `TIME`;
    titlesElement.appendChild(refuseTitle);
    titlesElement.appendChild(timeTitle);
    refuseTitle.show();
    timeTitle.show();
}

function stepTimingDiagram(requestStructureFromSetterController) {
    const sortedHandlers = [];
    model.handlerController.handlersList.forEach((handler, handlerIndex) => {
        if (handler.releasedTime < requestStructureFromSetterController.generatedTime && handler.releasedTime !== 0) {
            sortedHandlers.push(handler);
        }
        console.log(`${handler.releasedTime}`);
    });
    sortedHandlers.sort((firstElement, secondElement) => {
        return firstElement.releasedTime - secondElement.releasedTime;
    });
    console.log(sortedHandlers);
    sortedHandlers.forEach(sortedHandler => {
        generatorLines.querySelectorAll('.generator').forEach((generatorElement, generatorElementIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            generatorElement.appendChild(requestElement);
            requestElement.show();
        });
        model.handlerController.handlersList.forEach((handler, handlerElementIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            if ((handlerElementIndex + 1) !== sortedHandler.handlerId && handler.request !== undefined) {
                requestElement.textContent = `${handler.request.generatorId}.${handler.request.requestId}`;
            }
            handlerLines.querySelectorAll('.handler')[handlerElementIndex].appendChild(requestElement);
            requestElement.show();
            sortedHandler.request = undefined;
        });
        bufferLines.querySelectorAll('.buffer').forEach((bufferElement, bufferElementIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            if (requestStructureFromSetterController.bufferId === (bufferElementIndex + 1)) {
                requestElement.textContent = `${requestStructureFromSetterController.generatorId}.${requestStructureFromSetterController.requestId}`;
            }
            bufferElement.appendChild(requestElement);
            requestElement.show();
        });
        const timeElementForRefuse = timeTemplate.cloneNode(true);
        const timeElementForTimer = timeTemplate.cloneNode(true);
        timeElementForTimer.textContent = `${sortedHandler.releasedTime.toFixed(6)}`;
        refuseLine.appendChild(timeElementForRefuse);
        timeLine.appendChild(timeElementForTimer);
        timeElementForRefuse.show();
        timeElementForTimer.show();
        timeLine.show();
    });
    generatorLines.querySelectorAll('.generator').forEach((generatorElement, generatorElementIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        if ((generatorElementIndex + 1) === requestStructureFromSetterController.generatorId) {
            requestElement.textContent = `${requestStructureFromSetterController.generatorId}.${requestStructureFromSetterController.requestId}`;
        }
        generatorElement.appendChild(requestElement);
        requestElement.show();
    });
    model.handlerController.handlersList.forEach((handler, handlerElementIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        console.log(handler);
        if (handler.request !== undefined) {
            requestElement.textContent = `${handler.request.generatorId}.${handler.request.requestId}`;
        }
        handlerLines.querySelectorAll('.handler')[handlerElementIndex].appendChild(requestElement);
        requestElement.show();
    });
    bufferLines.querySelectorAll('.buffer').forEach((bufferElement, bufferElementIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        if (requestStructureFromSetterController.bufferId === (bufferElementIndex + 1)) {
            requestElement.textContent = `${requestStructureFromSetterController.generatorId}.${requestStructureFromSetterController.requestId}`;
        }
        bufferElement.appendChild(requestElement);
        requestElement.show();
    });
    const timeElementForRefuse = timeTemplate.cloneNode(true);
    const timeElementForTimer = timeTemplate.cloneNode(true);
    if (requestStructureFromSetterController.isRefused) {
        timeElementForRefuse.textContent = `${requestStructureFromSetterController.generatedTime.toFixed(6)}`;
    } else {
        timeElementForTimer.textContent = `${requestStructureFromSetterController.generatedTime.toFixed(6)}`;
    }
    refuseLine.appendChild(timeElementForRefuse);
    timeLine.appendChild(timeElementForTimer);
    timeElementForRefuse.show();
    timeElementForTimer.show();
    timeLine.show();
}

generateButtonElement.onclick = () => {
    document.querySelectorAll('body .inputs_block input').forEach((inputElement) => {
        inputElement.disabled = true;
        if (inputElement.value.length === 0) {
            inputElement.value = inputElement.getAttribute('placeholder');
        }
    });
    model = new Model(generatorsInput.value, buffersInput.value, handlersInput.value);
    model.generatorController.generateRequests(requestsInput.value);
    generateButtonElement.hide(true);
    stepForwardButtonElement.show();
    initTimingDiagram(model);
    timingDiagram.show();
    //chartDrawer.initChart(model);
};

stepForwardButtonElement.onclick = () => {
    if (requestsCounter !== (model.generatorController.requestsList.length)) {
        const requestStructureFromSetterController = model.setterController.work(model.generatorController.requestsList[requestsCounter]);
        stepTimingDiagram(requestStructureFromSetterController);
        const requestStructureFromGetterController = model.getterController.work(model.generatorController.requestsList[requestsCounter]);
        //console.log(requestStructureFromSetterController, requestStructureFromGetterController);
        //chartDrawer.drawRequest(requestStructureFromSetterController, requestStructureFromGetterController);
        //console.log(`Заявка-${requestStructureFromSetterController.requestId} была создана в ${requestStructureFromSetterController.generatedTime} генератором-${requestStructureFromSetterController.generatorId} и отправлена в буфер-${requestStructureFromSetterController.bufferId}`);
        if (requestStructureFromSetterController.isRefused) {
            //console.log(`Заявка-${requestStructureFromSetterController.refusedRequestId} была отказана`);
        }
        if (requestStructureFromGetterController !== []) {
            requestStructureFromGetterController.forEach(request => {
                //console.log(`Заявка-${request.requestId} была взята из буфера-${request.bufferId} в ${request.bufferedTime} и поставлена в работу на прибор-${request.handlerId}, работа окончена в ${request.releasedTime}`);
            });
        }
        requestsCounter++;
    } else if (model.buffer.isAnyBufferUnitFilled()) {
        const requestStructureFromGetterController = model.getterController.freeBuffer();
        console.log(`Заявка-${requestStructureFromGetterController.requestId} была взята из буфера-${requestStructureFromGetterController.bufferId} в ${requestStructureFromGetterController.bufferedTime} и поставлена в работу на прибор-${requestStructureFromGetterController.handlerId}, работа окончена в ${requestStructureFromGetterController.releasedTime}`);
    }
}