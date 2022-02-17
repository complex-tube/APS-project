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

let model = null;
let requestsCounter = 0;

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

function setterStepTimingDiagram(requestStructureFromSetterController) {
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
        if (handler.request !== null && handler.request.releasedTime > requestStructureFromSetterController.generatedTime) {
            requestElement.textContent = `${handler.request.generatorId}.${handler.request.requestId}`;
        }
        handlerLines.querySelectorAll('.handler')[handlerElementIndex].appendChild(requestElement);
        requestElement.show();
    });

    bufferLines.querySelectorAll('.buffer').forEach((bufferElement, bufferElementIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        const bufferUnitById = model.buffer.getBufferById(bufferElementIndex + 1);
        if (bufferUnitById !== null && bufferUnitById.getRequest() !== null) {
            requestElement.textContent = `${bufferUnitById.getRequest().generatorId}.${bufferUnitById.getRequest().requestId}`;
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

function getterStepTimingDiagram(requestStructureFromGetterController) {
    requestStructureFromGetterController.forEach(requestStructure => {
        if (requestStructure.oldRequest.isShown === false) {
            generatorLines.querySelectorAll('.generator').forEach((generatorElement, generatorElementIndex) => {
                const requestElement = requestTemplate.cloneNode(true);
                generatorElement.appendChild(requestElement);
                requestElement.show();
            });
            requestStructure.handlersState.forEach((request, handlerIndex) => {
                const requestElement = requestTemplate.cloneNode(true);
                if (request !== null && request.releasedTime >= requestStructure.oldRequest.releasedTime &&
                    request.handlerId !== requestStructure.oldRequest.handlerId) {
                    requestElement.textContent = `${request.generatorId}.${request.requestId}`;
                }
                requestStructure.oldRequest.isShown = true;
                handlerLines.querySelectorAll('.handler')[handlerIndex].appendChild(requestElement);
                requestElement.show();
            });
            requestStructure.buffersState.forEach((request, bufferIndex) => {
                const requestElement = requestTemplate.cloneNode(true);
                if (request !== null) {
                    requestElement.textContent = `${request.generatorId}.${request.requestId}`;
                }
                bufferLines.querySelectorAll('.buffer')[bufferIndex].appendChild(requestElement);
                requestElement.show();
            });
            const timeElementForRefuse = timeTemplate.cloneNode(true);
            const timeElementForTimer = timeTemplate.cloneNode(true);
            timeElementForTimer.textContent = `${requestStructure.oldRequest.releasedTime.toFixed(6)}`;
            refuseLine.appendChild(timeElementForRefuse);
            timeLine.appendChild(timeElementForTimer);
            timeElementForRefuse.show();
            timeElementForTimer.show();
            timeLine.show();
        }
    });
}

function requestFromBuffersStepTimingDiagram(freeModelState) {
    generatorLines.querySelectorAll('.generator').forEach((generatorElement, generatorElementIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        generatorElement.appendChild(requestElement);
        requestElement.show();
    });
    freeModelState.handlersState.forEach((request, requestIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        if (request.handlerId !== freeModelState.request.handlerId) {
            requestElement.textContent = `${request.generatorId}.${request.requestId}`;
        }
        handlerLines.querySelectorAll('.handler')[requestIndex].appendChild(requestElement);
        requestElement.show();
    });
    freeModelState.buffersState.forEach((request, requestIndex) => {
        const requestElement = requestTemplate.cloneNode(true);
        if (request !== null) {
            requestElement.textContent = `${request.generatorId}.${request.requestId}`;
        }
        bufferLines.querySelectorAll('.buffer')[requestIndex].appendChild(requestElement);
        requestElement.show();
    });
    const timeElementForRefuse = timeTemplate.cloneNode(true);
    const timeElementForTimer = timeTemplate.cloneNode(true);
    timeElementForTimer.textContent = `${freeModelState.request.bufferedTime.toFixed(6)}`;
    refuseLine.appendChild(timeElementForRefuse);
    timeLine.appendChild(timeElementForTimer);
    timeElementForRefuse.show();
    timeElementForTimer.show();
    timeLine.show();
}

function lastRequestsStepTimingDiagram(minHandler) {
    for (let handlerCounter = 0; handlerCounter < model.handlerController.handlersList.length; handlerCounter++) {
        generatorLines.querySelectorAll('.generator').forEach((generatorElement, generatorElementIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            generatorElement.appendChild(requestElement);
            requestElement.show();
        });
        model.handlerController.handlersList.forEach((handler, handlerIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            if (handler.request.isShown !== true) {
                requestElement.textContent = `${handler.request.generatorId}.${handler.request.requestId}`;
            }
            handlerLines.querySelectorAll('.handler')[handlerIndex].appendChild(requestElement);
            requestElement.show();
        });
        bufferLines.querySelectorAll('.buffer').forEach((bufferElement, bufferElementIndex) => {
            const requestElement = requestTemplate.cloneNode(true);
            bufferElement.appendChild(requestElement);
            requestElement.show();
        });
        const timeElementForRefuse = timeTemplate.cloneNode(true);
        const timeElementForTimer = timeTemplate.cloneNode(true);
        timeElementForTimer.textContent = minHandler.releasedTime.toFixed(6);
        refuseLine.appendChild(timeElementForRefuse);
        timeLine.appendChild(timeElementForTimer);
        timeElementForRefuse.show();
        timeElementForTimer.show();
        timeLine.show();
        minHandler.request.isShown = true;
        minHandler.releasedTime = Number.MAX_SAFE_INTEGER;
    }
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
};

stepForwardButtonElement.onclick = () => {
    if (requestsCounter !== (model.generatorController.requestsList.length)) {
        const requestStructureFromGetterController = model.getterController.work(model.generatorController.requestsList[requestsCounter]);
        getterStepTimingDiagram(requestStructureFromGetterController);
        const requestStructureFromSetterController = model.setterController.work(model.generatorController.requestsList[requestsCounter]);
        setterStepTimingDiagram(requestStructureFromSetterController);
        requestsCounter++;
    } else if (model.buffer.isAnyBufferUnitFilled()) {
        const requestFreeBufferStructure = model.getterController.freeBuffer();
        requestFromBuffersStepTimingDiagram(requestFreeBufferStructure);
        //console.log(model.buffer.getBuffersList());
        //getterStepTimingDiagram([requestFreeBufferStructure]);
    } else {
        const minHandler = model.handlerController.getMinHandler();
        if (minHandler.request.isShown !== true) {
            lastRequestsStepTimingDiagram(minHandler);
        }
    }
}