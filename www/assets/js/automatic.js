setSelectMode(1);

const radioElementsList = document.querySelectorAll('.content .content_container .device_picker .radio');
const inputElementsList = document.querySelectorAll('.content .content_container .inputs_block .model_inputs input');
const generatorInputElement = document.querySelector('.content .content_container .inputs_block .model_inputs .generators_number input');
const bufferInputElement = document.querySelector('.content .content_container .inputs_block .model_inputs .buffers_number input');
const handlerInputElement = document.querySelector('.content .content_container .inputs_block .model_inputs .handlers_number input');
const requestInputElement = document.querySelector('.content .content_container .inputs_block .requests_number input');
const submitButtonElement = document.querySelector('.content .content_container .button');
const chartElement = document.querySelector('.content .chart');

const probabilityOfRefuseList = Array();
const avgTimeOfWorkList = Array();
const rateOfUsabilityList = Array();
const chartXCaptionList = Array();

let chart = null;
let model = null;

function modeling(checkedRadio) {
    probabilityOfRefuseList.length = 0;
    avgTimeOfWorkList.length = 0;
    rateOfUsabilityList.length = 0;
    chartXCaptionList.length = 0;
    for (let i = 1; i < 101; i++) {
        if (checkedRadio.querySelector('input').value === 'generator') {
            model = new Model(i, bufferInputElement.value, handlerInputElement.value);
        } else if (checkedRadio.querySelector('input').value === 'buffer') {
            model = new Model(generatorInputElement.value, i, handlerInputElement.value);
        } else if (checkedRadio.querySelector('input').value === 'handler') {
            model = new Model(generatorInputElement.value, bufferInputElement.value, i);
        }
        model.doModel(requestInputElement.value);
        let probabilityOfRefuse = 0;
        let avgTimeOfWork = 0;
        let rateOfUsability = 0;
        model.generatorController.generatorsList.forEach(generator => {
            probabilityOfRefuse += generator.probabilityOfRefuse;
            avgTimeOfWork += generator.avgTimeOfWork;
        });
        model.handlerController.handlersList.forEach(handler => {
            rateOfUsability += handler.rateOfUsability;
        });
        probabilityOfRefuse /= model.generatorController.generatorsList.length;
        avgTimeOfWork /= model.generatorController.generatorsList.length;
        rateOfUsability /= model.handlerController.handlersList.length;
        probabilityOfRefuseList.push(probabilityOfRefuse);
        avgTimeOfWorkList.push(avgTimeOfWork);
        rateOfUsabilityList.push(rateOfUsability);
        chartXCaptionList.push(i);
    }
}

function createChart() {
    if (chart !== null) {
        chart.destroy();
    }
    chart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: chartXCaptionList,
            datasets: [{
                label: 'Вероятность отказа',
                data: probabilityOfRefuseList,
                borderColor: 'rgb(255, 51, 0)'
            }, {
                label: 'Среднее время нахождения в системе',
                data: avgTimeOfWorkList,
                borderColor: 'rgb(51, 102, 255)'
            }, {
                label: 'Загруженность приборов',
                data: rateOfUsabilityList,
                borderColor: 'rgb(51, 204, 51)'
            }]
        }
    });
    chartElement.show();
}

radioElementsList.forEach((radio, radioIndex) => {
    radio.querySelector('input').onclick = () => {
        if (radio.querySelector('input').value === 'generator') {
            inputElementsList.forEach((input, inputIndex) => {
                input.disabled = inputIndex === radioIndex;
                if (inputIndex === radioIndex) {
                    input.value = '';
                }
            });
        } else if (radio.querySelector('input').value === 'buffer') {
            inputElementsList.forEach((input, inputIndex) => {
                input.disabled = inputIndex === radioIndex;
                if (inputIndex === radioIndex) {
                    input.value = '';
                }
            });
        } else if (radio.querySelector('input').value === 'handler') {
            inputElementsList.forEach((input, inputIndex) => {
                input.disabled = inputIndex === radioIndex;
                if (inputIndex === radioIndex) {
                    input.value = '';
                }
            });
        }
    }
});

submitButtonElement.onclick = () => {
    let checkedRadio = null;
    radioElementsList.forEach((radio) => {
       if (radio.querySelector('input:checked') !== null) {
           checkedRadio = radio;
       }
    });
    if (checkedRadio !== null) {
        modeling(checkedRadio);
        createChart();
    }
}

