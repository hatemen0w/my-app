import React from "react";
import Graph from "../../modules/Graph/Graph";
import UI from "../../modules/Graph/UI";

class Graph2D extends React.Component {
    constructor() {
        super();
        this.start();
    }

    start() {
        const WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20
        };
        const drawn = [];


        let useInterpolation = false;


        // document.getElementById('setInterpolation').addEventListener('click', (event) => {
        //     useInterpolation = event.target.checked;
        // })

        let coordX = 0;

        const graph = new Graph({
            id: 'canvas',
            width: window.innerWidth,
            height: window.innerWidth,
            WIN,
            callbacks: {
                wheel: wheel,
                mousedown: mousedown,
                mousemove: mousemove,
                mouseup: mouseup,
                mouseleave: mouseleave,
                getX: getX
            }
        });

        new UI({ addFunction, delFunction, colorFunction, getPerivativeOn });

        let isDragging = false;
        let xDrag = 0;
        let yDrag = 0;

        function wheel(event) {
            const delta = 1 + (0.25 * (Math.abs(event.deltaY) / event.deltaY));
            WIN.HEIGHT = WIN.HEIGHT * delta;
            WIN.WIDTH = WIN.WIDTH * delta;
            WIN.BOTTOM = WIN.BOTTOM * delta;
            WIN.LEFT = WIN.LEFT * delta;
            render()
        }

        const points = [];

        function mousedown(event) {
            xDrag = event.offsetX;
            yDrag = event.offsetY;
            if (event.button === 1) {
                let xRight = graph.sx(event.offsetX + 5);
                let xLeft = graph.sx(event.offsetX - 5);
                let yDown = graph.sy(event.offsetY + 5) + (WIN.HEIGHT + 2 * WIN.BOTTOM);
                let yUp = graph.sy(event.offsetY - 5) + (WIN.HEIGHT + 2 * WIN.BOTTOM);
                points.forEach((point, index) => {
                    if (point.x >= xLeft && point.x <= xRight) {
                        if (point.y >= yDown && point.y <= yUp) {
                            points.splice(index, 1);
                            render();
                        }
                    }
                })
                return;
            }
            if (useInterpolation) {
                points.push({ x: graph.sx(event.offsetX), y: graph.sy(event.offsetY) + (WIN.HEIGHT + 2 * WIN.BOTTOM) });
                points.sort((a, b) => b.x - a.x);
                render();
                return;
            }
            isDragging = true;
        }

        function mousemove(event) {

            if (isDragging) {
                WIN.LEFT = graph.sx(xDrag - event.offsetX);
                WIN.BOTTOM = -graph.sy(-yDrag + event.offsetY);
                render();
                xDrag = event.offsetX;
                yDrag = event.offsetY;
            }
        }

        function mouseup(event) {
            xDrag = event.offsetX;
            yDrag = event.offsetY;
            isDragging = false;
        }

        function mouseleave() {
            isDragging = false;
        }

        function getX(event) {
            coordX = graph.sx(event.offsetX);
            drawn.forEach((item, index) => {
                if (item && item.func && item.getPerivative) {
                    getPerivative(item.func, coordX, 0.001, index);
                }
            })
        }

        function addFunction(func, num) {
            if (drawn[num]) {
                drawn[num].func = func;
            } else {
                drawn[num] = {
                    func,
                    getPerivative: false,
                    perivative: function (x) { return drawn[num].func }
                }
            }
            render();

        }

        function delFunction(num) {

            drawn[num] = null;
            render();
        }

        function colorFunction(color, num) {
            drawn[num].color = color;
            render();
        }

        function getPerivativeOn(num) {
            if (drawn[num].getPerivative) {
                drawn[num].getPerivative = false;
                drawn[num].perivative = function (x) { return drawn[num].func };
            } else {
                drawn[num].getPerivative = true;
            }
            render();
        }

        //Рисует систему координат
        const grid = () => {

            for (let i = -1; i >= WIN.LEFT; i = i - 1) {
                graph.line(i, WIN.HEIGHT + WIN.BOTTOM, i, WIN.BOTTOM, 'rgb(70, 70, 70)', 1);
            }

            for (let i = 0; i <= WIN.WIDTH + WIN.LEFT; i = i + 1) {
                graph.line(i, WIN.HEIGHT + WIN.BOTTOM, i, WIN.BOTTOM, 'rgb(70, 70, 70)', 1);
            }

            for (let i = -1; i >= WIN.BOTTOM; i = i - 1) {
                graph.line(WIN.LEFT, i, WIN.WIDTH + WIN.LEFT, i, 'rgb(70, 70, 70)', 1);
            }

            for (let i = 1; i <= WIN.HEIGHT + WIN.BOTTOM; i = i + 1) {
                graph.line(WIN.LEFT, i, WIN.WIDTH + WIN.LEFT, i, 'rgb(70, 70, 70)', 1);
            }

            //Оси координат
            graph.line(WIN.LEFT, 0, WIN.WIDTH + WIN.LEFT, 0, 'black', 4);
            graph.line(0, WIN.BOTTOM + WIN.HEIGHT, 0, WIN.BOTTOM, 'black', 4);

            //Рисочки
            for (let i = -1; i > WIN.LEFT; i--) {
                graph.line(i, 0.1, i, -0.1, '#000', 4);
                graph.print(i - 0.3, -0.3, i, 'black', 350)
            }

            for (let i = 0; i < WIN.WIDTH + WIN.LEFT; i++) {
                graph.line(i, 0.1, i, -0.1, '#000', 4);
                graph.print(i - 0.2, -0.3, i, 'black', 350)
            }

            for (let i = -1; i > WIN.BOTTOM; i--) {
                graph.line(0.1, i, -0.1, i, '#000', 4);
                graph.print(-0.4, i - 0.2, i, 'black', 350)
            }

            for (let i = 1; i < WIN.HEIGHT + WIN.BOTTOM; i++) {
                graph.line(0.1, i, -0.1, i, '#000', 4);
                graph.print(-0.3, i - 0.2, i, 'black', 350)
            }
        }

        function printFunction(f, color = '#000', width = 2, n = 1200) {
            let x = WIN.LEFT;
            const dx = WIN.WIDTH / n;
            while (x <= WIN.WIDTH + WIN.LEFT) {
                graph.line(x, f(x), x + dx, f(x + dx), color, this.canvas.height * 0.004);
                x += dx;
                if (f(x) * f(x + dx) <= 0) {
                    graph.point(getZero(f, x, x + dx, 0.001), 0, color, 6);
                }
            }
        }


        const printFunctions = () => {
            drawn.forEach(item => item && printFunction(item.func, item.color, item.width))
        }

        const getZero = (f, a, b, eps = 0.01) => {
            if (Math.abs(f(a)) + Math.abs(f(b)) >= 10) return null;
            if (f(a) * f(b) > 0) return null;
            if (Math.abs(f(a) - f(b)) <= eps) {
                return (a + b) / 2;
            };
            const half = (a + b) / 2;
            if (f(a) * f(half) <= 0) {
                return getZero(f, a, half, eps);
            };
            if (f(half) * f(b) <= 0) {
                return getZero(f, half, b, eps);
            }
        }

        function getPerivative(f, x, dx, num) {
            let k = (f(x + dx) - f(x)) / dx;
            let b = f(x) - k * x;
            drawn[num].perivative = function (x) {
                return k * x + b;
            }
            render();
        }

        function printPerivative() {
            drawn.forEach((item, index) => {
                if (item && item.perivative) {
                    let f = item.perivative;
                    let n = 1;
                    let x = WIN.LEFT;
                    let dx = WIN.WIDTH / n;
                    while (x <= WIN.WIDTH + WIN.LEFT) {
                        graph.dashedLine(x, f(x), x + dx, f(x + dx), item.color, this.canvas.height * 0.004);
                        x += dx;
                    }
                }
            })
        }

        function interpolation() {
            if (points.length > 1) {
                for (let i = 0; i < points.length - 1; i++) {
                    graph.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, 'black', 3);
                }
            }
        }

        function render() {
            graph.clear();
            grid();
            printFunctions();
            printPerivative();
            points.forEach(point => point && graph.point(point.x, point.y, 'black', 5))
            interpolation();
        }

        render();
    };

    render() {
        return (<div>
            <div id="funcInput">
                <input type="checkbox" id="setInterpolation"></input>
                <label for="setInterpolation">Интеполяция</label>
                <div id="listOfFunctions"></div>
                <button id="addFunction">+</button>
            </div>
            <canvas id="canvas"></canvas>
        </div>)
    }
}

export default Graph2D;