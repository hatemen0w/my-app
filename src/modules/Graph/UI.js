import React from "react";

class UI extends React.Component {
    constructor(options) {
        super(options);
        const {
            addFunction,
            delFunction,
            colorFunction,
            getPerivativeOn
        } = options.callbacks;

        this.num = 1;
        this.addFunction = addFunction;
        this.delFunction = delFunction;
        this.setColor = colorFunction;
        this.getPerivativeOn = getPerivativeOn;

        this.addClickHandler();
    }

    addEventListeners() {
        document.getElementById('addFunction')
            .addEventListener('click', this.addClickHandler.bind(this));
    }


    addClickHandler() {
        this.createFunctionInput();
    }

    keyupHandler() {
        try {
            let f;
            eval(`f = function(x) {return ${this.value}}`);
            this.addFunction(f, this.dataset.num - 0);
        } catch (e) {
            console.log('Ошибка ввода');
        }
    }

    createFunctionInput() {
        const container = document.createElement('div');
        container.classList.add('funcContainer');

        const input = document.createElement('input');
        input.setAttribute('placeholder', 'Функция №' + this.num);
        input.dataset.num = this.num;
        input.classList.add('funcInputs');
        input.addEventListener('keyup', this.keyupHandler);

        const changeColor = document.createElement('input');
        changeColor.type = 'color';
        changeColor.classList.add('changeColor');
        changeColor.dataset.num = this.num;
        changeColor.addEventListener('input', this.getColor)

        const getPerivative = document.createElement('button');
        getPerivative.classList.add('optionsButton');
        getPerivative.innerHTML = ('Искать касательную');
        getPerivative.id = 'getPerivative';
        getPerivative.dataset.num = this.num;
        getPerivative.addEventListener('click', this.getPerivativeClickHandler);

        // const getIntegral = document.createElement('button');
        // getIntegral.classList.add('optionsButton');
        // getIntegral.innerHTML = ('Найти площадь');
        // getIntegral.id = 'getIntegral';
        // getIntegral.addEventListener('click', this.getIntegralClickHandler);

        const button = document.createElement('button');
        button.classList.add('deleteButton');
        button.innerHTML = 'X';
        button.addEventListener('click', () => {
            this.delFunction(input.dataset.num - 0);
            container.removeChild(input);
            container.removeChild(button);
            funcInputs.removeChild(container);
        });

        var funcInputs = document.getElementById('listOfFunctions');
        funcInputs.appendChild(container);
        container.appendChild(changeColor);
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(getPerivative)
        // container.appendChild(getIntegral)
        this.num++;
    }

    getColor() {
        this.colorFunction(this.value, this.dataset.num - 0);
    }

    getPerivativeClickHandler() {
        this.getPerivativeOn(this.dataset.num - 0);
    }

    // getIntegralClickHandler() {
    //     const parametersDialog = document.createElement('dialog');
    //     parametersDialog.classList.add('parametersDialog');
    //     document.querySelector('body').appendChild(parametersDialog);
    //     parametersDialog.showModal();

    //     const button = document.createElement('button');
    //     button.classList.add('deleteButton');
    //     button.innerHTML = 'X';
    //     button.addEventListener('click', () => {
    //         parametersDialog.close()
    //     });

    //     description = document.createElement('h1');
    //     description.innerHTML = 'Нахождение площади криволинейной трапеции';
    //     parametersDialog.appendChild(description);
    //     parametersDialog.appendChild(button);
    // }

}

export default UI;