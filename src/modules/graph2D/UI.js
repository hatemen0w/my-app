function UI({ addFunction, delFunction, colorFunction, getPerivativeOn }) {
    let num = 1;
    document.getElementById('addFunction').addEventListener('click', addClickHandler);

    addClickHandler();

    function addClickHandler() {
        createFunctionInput();
    }

    function keyupHandler() {
        try {
            let f;
            eval(`f = function(x) {return ${this.value}}`);
            addFunction(f, this.dataset.num - 0);
        } catch (e) {
            console.log('Ошибка ввода');
        }
    }

    function createFunctionInput() {
        const container = document.createElement('div');
        container.classList.add('funcContainer');

        const input = document.createElement('input');
        input.setAttribute('placeholder', 'Функция №' + num);
        input.dataset.num = num;
        input.classList.add('funcInputs');
        input.addEventListener('keyup', keyupHandler);

        const changeColor = document.createElement('input');
        changeColor.type = 'color';
        changeColor.classList.add('changeColor');
        changeColor.dataset.num = num;
        changeColor.addEventListener('input', getColor)

        const getPerivative = document.createElement('button');
        getPerivative.classList.add('optionsButton');
        getPerivative.innerHTML = ('Искать касательную');
        getPerivative.id = 'getPerivative';
        getPerivative.dataset.num = num;
        getPerivative.addEventListener('click', getPerivativeClickHandler);

        const getIntegral = document.createElement('button');
        getIntegral.classList.add('optionsButton');
        getIntegral.innerHTML = ('Найти площадь');
        getIntegral.id = 'getIntegral';
        getIntegral.addEventListener('click', getIntegralClickHandler);

        const button = document.createElement('button');
        button.classList.add('deleteButton');
        button.innerHTML = 'X';
        button.addEventListener('click', () => {
            delFunction(input.dataset.num - 0);
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
        container.appendChild(getIntegral)
        num++;
    }

    function getColor() {
        colorFunction(this.value, this.dataset.num - 0);
    }

    function getPerivativeClickHandler() {
        getPerivativeOn(this.dataset.num - 0);
    }

    function getIntegralClickHandler() {
        const parametersDialog = document.createElement('dialog');
        parametersDialog.classList.add('parametersDialog');
        document.querySelector('body').appendChild(parametersDialog);
        parametersDialog.showModal();

        const button = document.createElement('button');
        button.classList.add('deleteButton');
        button.innerHTML = 'X';
        button.addEventListener('click', () => {
            parametersDialog.close()
        });

        description = document.createElement('h1');
        description.innerHTML = 'Нахождение площади криволинейной трапеции';
        parametersDialog.appendChild(description);
        parametersDialog.appendChild(button);
    }

}
