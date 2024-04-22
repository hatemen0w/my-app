import React, { useRef, useState, useEffect } from "react";
import Calculator from "../../modules/calculator/Calculator";

const Calc = () => {
    const [aValue, setAValue] = useState('');
    const [bValue, setBValue] = useState('');
    const [cValue, setCValue] = useState('');
    const [pointValue, setPointValue] = useState('');
    const [resultValue, setResultValue] = useState('');

    const aRef = useRef(null);
    const bRef = useRef(null);
    const cRef = useRef(null);

    useEffect(() => {
        const addEventListeners = () => {
            const buttons = document.querySelectorAll('.operand');
            buttons.forEach(button =>
                button.addEventListener(
                    'click',
                    (event) => operandHandler(event)
                )
            );
            document.getElementById('getValueButton')
                .addEventListener(
                    'click',
                    () => getValueHandler()
                );
        };

        addEventListeners();

        return () => {
            const buttons = document.querySelectorAll('.operand');
            buttons.forEach(button =>
                button.removeEventListener(
                    'click',
                    (event) => operandHandler(event)
                )
            );
            document.getElementById('getValueButton')
                .removeEventListener(
                    'click',
                    () => getValueHandler()
                );
        };
    }, []);

    const operandHandler = (operand) => {
        const calc = new Calculator();
        const a = calc.getValue(aValue);
        const b = calc.getValue(bValue);
        const result = calc[operand](a, b);
        setCValue(result.toString());
        if (result.toString().includes('NaN')) {
            setCValue('Да я не могу блин');
        }
    };

    const getValueHandler = () => {
        const calc = new Calculator();
        const x = pointValue;
        const polynomial = cValue;
        setResultValue(calc.getValueAtPoint(polynomial, x));
    };

    return (
        <div>
            <div className="titleBlock">
                <h1 className="title" id="partOne">Calcu</h1>
                <h1 className="title" id="partTwo">lator</h1>
            </div>
            <div className="inputBlock">
                <textarea ref={aRef} placeholder="a" value={aValue} onChange={(e) => setAValue(e.target.value)} className="input"></textarea>
                <textarea ref={bRef} placeholder="b" value={bValue} onChange={(e) => setBValue(e.target.value)} className="input"></textarea>
                <textarea ref={cRef} placeholder="result" value={cValue} className="input"></textarea>
                <div className='operandBlock'>
                    <button className="operand" onClick={() => operandHandler("add")}>+</button>
                    <button className="operand" onClick={() => operandHandler("sub")}>-</button>
                    <button className="operand" onClick={() => operandHandler("mult")}>*</button>
                    <button className="operand" onClick={() => operandHandler("div")}>/</button>
                    <button className="operand" onClick={() => operandHandler("prod")}>scal</button>
                    <button className="operand" onClick={() => operandHandler("pow")}>^</button>
                </div>
                <input id="point" placeholder="Найти значение в точке" value={pointValue} onChange={(e) => setPointValue(e.target.value)} className="input"></input>
                <button id='getValueButton' className="findButton">Искать</button>
                <div></div>
                <input id="value" placeholder="Значение" value={resultValue} className="input"></input>
                <div className="operands"></div>
            </div>
        </div>
    );
};

export default Calc;
