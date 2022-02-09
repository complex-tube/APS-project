setSelectMode(2);

const requestElementTemplate = document.querySelector('.request.hidden');
const requestListElement = document.querySelector('body .requests_list');
const submitButtonElement = document.querySelector('body .button');
const generatorsInput = document.querySelector('body .model_inputs .generators_number input');
const buffersInput = document.querySelector('body .model_inputs .buffers_number input');
const handlersInput = document.querySelector('body .model_inputs .handlers_number input');
const requestsInput = document.querySelector('body .inputs_block .requests_number input');
const generatorsStatisticElement = document.querySelector('body .generators_statistic');
const generatorsStatisticListElement = document.querySelector('body .generators_statistic_list');
const generatorStatisticLineTemplate = document.querySelector('body .generator_statistic_line.hidden');
const handlersStatisticElement = document.querySelector('body .handlers_statistic');
const handlersStatisticListElement = document.querySelector('body .handlers_statistic_list');
const handlersStatisticLineTemplate = document.querySelector('body .handlers_statistic_line.hidden');

let model = null;

function isInputsValid() {
    let isValid = true;
    document.querySelectorAll('body .inputs_block input').forEach((inputElement) => {
        if (inputElement.value < 1 && inputElement.value.length !== 0) {
            isValid = false;
        }
    });
    return isValid;
}

function writeRequestsStat() {
    requestListElement.removeChildNodes();
    model.generatorController.requestsList.forEach((request, requestNumber) => {
        const requestElement = requestElementTemplate.cloneNode(true);
        if (request.releasedTime !== 0) {
        requestElement.textContent = `${requestNumber + 1}) Номер заявки: ${request.requestId}, Время генерации: ${request.generatedTime.toFixed(5)},
                                    Время выхода из буффера: ${request.bufferedTime.toFixed(5)}, Окончание отработки: ${request.releasedTime.toFixed(5)}`;
    } else {
        requestElement.textContent = `${requestNumber + 1}) Номер заявки: ${request.requestId}, Время генерации: ${request.generatedTime.toFixed(5)}, Окончание отработки: Заявка отказана`;
    }
    requestElement.classList.remove('hidden', 'full');
    requestListElement.appendChild(requestElement);
    });
    requestListElement.show();
}

function modeling() {
    document.querySelectorAll('body .inputs_block input').forEach((inputElement) => {
        if (inputElement.value.length === 0) {
            inputElement.value = inputElement.getAttribute('placeholder');
        }
    });
    model = new Model(generatorsInput.value, buffersInput.value, handlersInput.value);
    model.doModel(requestsInput.value);
}

function writeGeneratorsStats() {
    generatorsStatisticListElement.removeChildNodes();
    model.generatorController.generatorsList.forEach(generator => {
        const generatorStatLine = generatorStatisticLineTemplate.cloneNode(true);
        generatorStatLine.querySelector('.number').textContent = `№ ${generator.generatorId}`;
        generatorStatLine.querySelector('.number_of_requests').textContent = `${generator.requestsList.length}`;
        generatorStatLine.querySelector('.probability_of_refuse').textContent = `${generator.probabilityOfRefuse.toFixed(11)}`;
        generatorStatLine.querySelector('.avg_time_of_work').textContent = `${generator.avgTimeOfWork.toFixed(11)}`;
        generatorStatLine.querySelector('.avg_time_of_buffering').textContent = `${generator.avgTimeOfBuffering.toFixed(11)}`;
        generatorStatLine.querySelector('.avg_time_of_handling').textContent = `${generator.avgTimeOfHandling.toFixed(11)}`;
        generatorsStatisticListElement.appendChild(generatorStatLine);
        generatorStatLine.show();
    });
    generatorsStatisticElement.show();
}

function writeHandlersStats() {
    handlersStatisticListElement.removeChildNodes();
    model.handlerController.handlersList.forEach(handler => {
        const handlerStatisticLine = handlersStatisticLineTemplate.cloneNode(true);
        handlerStatisticLine.querySelector('.number').textContent = `№ ${handler.handlerId}`;
        handlerStatisticLine.querySelector('.rate_of_usability').textContent = `${handler.rateOfUsability.toFixed(11)}`;
        handlersStatisticListElement.appendChild(handlerStatisticLine);
        handlerStatisticLine.show();
    });
    handlersStatisticElement.show();
}

function searchOptimalModel() {
    let currentProbabilityOfRefuse = 0;
    let newProbabilityOfRefuse = Number.MAX_SAFE_INTEGER;
    while (newProbabilityOfRefuse !== 0 && Math.abs((currentProbabilityOfRefuse - newProbabilityOfRefuse)) >= (currentProbabilityOfRefuse * 0.1)) {
        currentProbabilityOfRefuse = newProbabilityOfRefuse;
        modeling();
        newProbabilityOfRefuse = model.generatorController.generatorsList.map(generator => {
            return generator.probabilityOfRefuse;
        }).reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        }) / model.generatorController.generatorsList.length;
        const nextNumberOfRequests = Math.round((Math.pow(1.643, 2) * (1 - newProbabilityOfRefuse) / (newProbabilityOfRefuse * Math.pow(0.1, 2))));
        if (Number.isFinite(nextNumberOfRequests)) {
            requestsInput.value = nextNumberOfRequests;
        }
    }
}

submitButtonElement.onclick = () => {
    if (isInputsValid()) {
        searchOptimalModel();
        document.querySelectorAll('.content .title').forEach(titleElement => {
            titleElement.show();
        });
        writeHandlersStats();
        writeGeneratorsStats();
        writeRequestsStat();
    }
}