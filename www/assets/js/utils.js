function setSelectMode(selectedModeNumber) {
    document.querySelectorAll('header .mode_type').forEach((modeTypeElement, modeTypeIndex) => {
        modeTypeElement.classList.add('no_select');
        if (modeTypeIndex === (selectedModeNumber - 1)) {
            modeTypeElement.classList.remove('no_select');
        }
    });
}

function randomExponential(rate, randomUniform) {
    rate = rate || 1;
    var U = randomUniform;
    if (typeof randomUniform === 'function') {
        U = randomUniform();
    }
    if (!U) {
        U = Math.random();
    }
    return -Math.log(U) / rate;
}

Element.prototype.hide = function(full = false) {
    this.classList.add('hidden');
    if (full === true) {
        this.classList.add('full');
    }
}

Element.prototype.show = function() {
    this.classList.remove('hidden', 'full');
}

Element.prototype.removeChildNodes = function () {
    Array.from(this.children).forEach((childNode) => {
        childNode.remove();
    });
};