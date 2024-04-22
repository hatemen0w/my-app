import React from "react";

const Header = ({ setPageName }) => {
    return (
        <>
            <h1>Хедер!</h1>
            <button onClick={() => setPageName('Graph3D')}>3D графика</button>
            <button onClick={() => setPageName('Graph2D')}>2D графика</button>
            <button onClick={() => setPageName('Calc')}>Калькулятор</button>
        </>
    );
};

export default Header;
