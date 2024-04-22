import React, { useState } from "react";
import Header from "./components/Header/Header";
import Graph3D from "./components/Graph3D/Graph3D";
import Graph2D from "./components/Graph2D/Graph2D";
import Calc from "./components/Calc/Calc";

const App = () => {
  const [pageName, setPageName] = useState('Graph3D');

  return (
    <div className="app">
      <Header setPageName={setPageName} />
      {pageName === 'Graph3D' ? <Graph3D /> : null}
      {pageName === 'Graph2D' ? <Graph2D /> : null}
      {pageName === 'Calc' ? <Calc /> : null}
    </div>
  );
};

export default App;