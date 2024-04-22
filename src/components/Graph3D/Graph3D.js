import React, { useState, useEffect, useRef } from "react";
import Point from "../../modules/Math3D/entities/Point";
import Light from "../../modules/Math3D/entities/Light";
import Math3D from "../../modules/Math3D/Math3D";
import Sphere from "../../modules/Math3D/surfaces/sphere";
import Graph from "../../modules/Graph/Graph";

const Graph3D = () => {
    const WIN = useRef({
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        P1: new Point(-10, 10, -30),
        P2: new Point(-10, -10, -30),
        P3: new Point(10, -10, -30),
        CENTER: new Point(0, 0, -30),
        CAMERA: new Point(0, 0, -50)
    });
    const math3D = useRef(new Math3D({ WIN: WIN.current }));
    const LIGHT = useRef(new Light(-40, 15, -10, 1500));
    const scene = useRef(SolarSystem());

    const graphRef = useRef(null);
    const intervalRef = useRef(null);

    const [canMove, setCanMove] = useState(false);
    const [drawPoints, setDrawPoints] = useState(true);
    const [drawEdges, setDrawEdges] = useState(true);
    const [drawPolygons, setDrawPolygons] = useState(true);

    useEffect(() => {
        const graph = new Graph({
            id: 'canvasGraph3D',
            width: 600,
            height: 600,
            WIN: WIN.current,
            callbacks: {
                wheel: wheel,
                mousemove: mousemove,
                mouseup: mouseup,
                mousedown: mousedown,
            }
        });
        graphRef.current = graph;

        intervalRef.current = setInterval(() => {
            scene.current.forEach(surface => surface.doAnimation(math3D.current));
        }, 50);

        let FPS = 0;
        let countFPS = 0;
        let timestamp = Date.now();
        const renderLoop = () => {
            countFPS++;
            const currentTimestamp = Date.now();
            if (currentTimestamp - timestamp >= 1000) {
                FPS = countFPS;
                countFPS = 0;
                timestamp = currentTimestamp;
            }

            calcPlaneEquation();
            calcWindowVectors();
            renderScene(FPS);
            requestAnimationFrame(renderLoop);
        };
        renderLoop();

        return () => {
            window.cancelAnimationFrame(renderLoop);
            clearInterval(intervalRef.current);
        };
    }, []);

    const mouseup = () => {
        setCanMove(false);
    };

    const mousedown = () => {
        setCanMove(true);
    };

    const wheel = (event) => {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 1.2 : 0.8;
        const matrix = math3D.current.zoom(delta);
        math3D.current.transform(matrix, WIN.current.CAMERA);
        math3D.current.transform(matrix, WIN.current.CENTER);
    };

    const mousemove = (event) => {
        if (canMove) {
            const gradus = Math.PI / 180 / 4;
            const matrixOx = math3D.current.rotateOx((this.dx - event.offsetX) * gradus);
            const matrixOy = math3D.current.rotateOy((this.dy - event.offsetY) * gradus);
            math3D.current.transform(matrixOx, WIN.current.CAMERA);
            math3D.current.transform(matrixOx, WIN.current.CENTER);
            math3D.current.transform(matrixOx, WIN.current.P1);
            math3D.current.transform(matrixOx, WIN.current.P2);
            math3D.current.transform(matrixOx, WIN.current.P3);
            math3D.current.transform(matrixOy, WIN.current.CAMERA);
            math3D.current.transform(matrixOy, WIN.current.CENTER);
            math3D.current.transform(matrixOy, WIN.current.P1);
            math3D.current.transform(matrixOy, WIN.current.P2);
            math3D.current.transform(matrixOy, WIN.current.P3);
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    };

    const selectFigure = () => {
        const figure = document.getElementById('selectFigure').value;
        scene.current = [surfaces[figure]({})];
    };

    const SolarSystem = () => {
        const Sun = new Sphere({ color: '#ffff00', radius: 10 })
        Sun.addAnimation('rotateOy', 0.01);
        Sun.addAnimation('rotateOz', 0.01);
        const Earth = new Sphere({ color: '#0022ff', radius: 5, x0: 20 });
        Earth.addAnimation('rotateOy', 0.03, Sun.center);
        Earth.addAnimation('rotateOz', 0.05);
        const Moon = new Sphere({ color: '#969ba3', radius: 2, x0: Earth.center.x, y0: Earth.center.y, z0: Earth.center.z + 8 });
        Moon.addAnimation('rotateOx', 0.1, Earth.center);
        Moon.addAnimation('rotateOy', 0.03, Sun.center);
        return [Sun, Earth, Moon];
    };

    const calcPlaneEquation = () => {
        math3D.current.calcPlaneEquation(WIN.current.CAMERA, WIN.current.CENTER)
    };

    const getProection = (point) => {
        const M = math3D.current.getProection(point);
        const P2M = math3D.current.getVector(WIN.current.P2, M);
        const cosa = math3D.current.calcCorner(this.P1P2, M);
        const cosb = math3D.current.calcCorner(this.P2P3, M);
        const module = math3D.current.moduleVector(P2M);
        return {
            x: cosa * module,
            y: cosb * module
        }
    };

    const calcWindowVectors = () => {
        this.P1P2 = math3D.current.getVector(WIN.current.P2, WIN.current.P1);
        this.P2P3 = math3D.current.getVector(WIN.current.P3, WIN.current.P2);
    };

    const renderScene = (FPS) => {
        console.log(FPS);
        graphRef.current.clear();
        if (drawPolygons) {
            const polygons = [];
            scene.current.forEach((surface, index) => {
                math3D.current.calcDistance(surface, WIN.current.CAMERA, 'distance');
                math3D.current.calcDistance(surface, LIGHT.current, 'lumen');
                math3D.current.calcCenter(surface);
                math3D.current.calcRadius(surface);
                math3D.current.calcVisibiliy(surface, WIN.current.CAMERA);
                surface.polygons.forEach(polygon => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });

            math3D.current.sortByArtistAlgorithm(polygons);
            polygons.forEach(polygon => {
                if (polygon.visibility || scene.surface) {
                    const points = polygon.points.map(index =>
                        new Point(
                            getProection(scene.current[polygon.index].points[index]).x,
                            getProection(scene.current[polygon.index].points[index]).y
                        )
                    );
                    const { isShadow, dark } = math3D.current.calcShadow(polygon, scene.current, LIGHT.current);
                    const lumen = math3D.current.calcIllumination(polygon.lumen, LIGHT.current.lumen * (isShadow ? dark : 1));
                    let { r, g, b } = polygon.color;
                    r = Math.round(r * lumen);
                    g = Math.round(g * lumen);
                    b = Math.round(b * lumen);
                    graphRef.current.polygon(points, polygon.rgbToHex(r, g, b));
                }
            });
        }
        if (drawPoints) {
            scene.current.forEach(surface =>
                surface.points.forEach(
                    point => graphRef.current.point(
                        getProection(point).x,
                        getProection(point).y
                    )
                )
            );
        }
        if (drawEdges) {
            scene.current.forEach(surface =>
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    graphRef.current.line(
                        getProection(point1).x, getProection(point1).y,
                        getProection(point2).x, getProection(point2).y
                    );
                })
            );
        }
        graphRef.current.renderFrame();
    };

    return (
        <div>
            <canvas id='canvasGraph3D' className='asg'></canvas>
            <div>
                <select id='selectFigure'>
                    <option value='ellipticCylinder'>Эллиптический цилиндр</option>
                    <option value='ellipticParaboloid'>Эллиптический параболоид</option>
                    <option value='hyperbolicParaboloid'>Принглс??????</option>
                    <option value='twoSurfaceHyperboloid'>Двуполостный гиперболоид</option>
                    <option value='oneSurfaceHyperboloid'>Однополостный гиперболоид</option>
                    <option value='hyperbolicCylinder'>Гиперболический цилиндр</option>
                    <option value='kleinBottle'>Бутылка клейна</option>
                    <option value='sphere'>Сфера</option>
                    <option value='ellipse'>Эллипс</option>
                    <option value='thor'>Тор (бублик)</option>
                    <option value='cube'>Куб</option>
                </select>
            </div>
            <div>
                <label htmlFor="points">Рисовать точки</label>
                <input className='customSurface' data-custom='drawPoints' type='checkbox' value='points' defaultChecked></input>
                <label htmlFor="edges">Рисовать рёбра</label>
                <input className='customSurface' data-custom='drawEdges' type='checkbox' value='edges' defaultChecked></input>
                <label htmlFor="polygons">Рисовать полигоны</label>
                <input className='customSurface' data-custom='drawPolygons' type='checkbox' value='polygons' defaultChecked></input>
            </div>
            <div id='paramsBlock'>
                <div id='cube params'></div>
            </div>
        </div>
    );
};

export default Graph3D;


// import React from "react";
// import Point from "../../modules/Math3D/entities/Point";
// import Light from "../../modules/Math3D/entities/Light";
// import Math3D from "../../modules/Math3D/Math3D";
// import Sphere from "../../modules/Math3D/surfaces/sphere";
// import Graph from "../../modules/Graph/Graph";

// window.requestAnimationFrame = (function () {
//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         window.oRequestAnimationFrame ||
//         window.msRequestAnimationFrame ||
//         function (callback) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();

// class Graph3D extends React.Component {
//     constructor(props) {
//         super(props);
//         this.WIN = {
//             LEFT: -10,
//             BOTTOM: -10,
//             WIDTH: 20,
//             HEIGHT: 20,
//             P1: new Point(-10, 10, -30),
//             P2: new Point(-10, -10, -30),
//             P3: new Point(10, -10, -30),
//             CENTER: new Point(0, 0, -30),
//             CAMERA: new Point(0, 0, -50)
//         }
//         this.math3D = new Math3D({ WIN: this.WIN });
//         this.LIGHT = new Light(-40, 15, -10, 1500);
//         this.scene = this.SolarSystem();
//         // this.drawPoints = true;
//         // this.drawEdges = true;
//         this.drawPolygons = true;
//     }

//     componentDidMount() {
//         this.graph = new Graph({
//             id: 'canvasGraph3D', 
//             width: 600, 
//             height: 600, 
//             WIN: this.WIN,
//             callbacks: {
//                 wheel: (event) => this.wheel(event),
//                 mousemove: (event) => this.mousemove(event),
//                 mouseup: () => this.mouseup(),
//                 mousedown: () => this.mousedown(),
//             }
//         });
//         this.interval = setInterval(() => {
//             this.scene.forEach(surface => surface.doAnimation(this.math3D));
//         }, 50)
//         let FPS = 0;
//         let countFPS = 0;
//         let timestamp = Date.now();
//         this.renderLoop = () => {
//             countFPS++;
//             const currentTimestamp = Date.now();
//             if (currentTimestamp - timestamp >= 1000) {
//                 FPS = countFPS;
//                 countFPS = 0;
//                 timestamp = currentTimestamp;
//             }

//             this.calcPlaneEquation();
//             this.calcWindowVectors();
//             this.renderScene(FPS);
//             requestAnimationFrame(this.renderLoop);
//         }

//         this.renderLoop();
//     }

//     componentWillUnmount() {
//         window.cancelAnimationFrame(this.renderLoop);
//         clearInterval(this.interval);
//         this.graph = null;
//     }

//     mouseup() {
//         this.canMove = false;
//     }

//     mousedown() {
//         this.canMove = true;
//     }

//     wheel(event) {
//         event.preventDefault();
//         const delta = (event.wheelDelta > 0) ? 1.2 : 0.8;
//         const matrix = this.math3D.zoom(delta);
//         this.math3D.transform(matrix, this.WIN.CAMERA);
//         this.math3D.transform(matrix, this.WIN.CENTER);
//     }

//     mousemove(event) {
//         if (this.canMove) {
//             const gradus = Math.PI / 180 / 4;
//             const matrixOx = this.math3D.rotateOx((this.dx - event.offsetX) * gradus);
//             const matrixOy = this.math3D.rotateOy((this.dy - event.offsetY) * gradus);
//             this.math3D.transform(matrixOx, this.WIN.CAMERA);
//             this.math3D.transform(matrixOx, this.WIN.CENTER);
//             this.math3D.transform(matrixOx, this.WIN.P1);
//             this.math3D.transform(matrixOx, this.WIN.P2);
//             this.math3D.transform(matrixOx, this.WIN.P3);
//             this.math3D.transform(matrixOy, this.WIN.CAMERA);
//             this.math3D.transform(matrixOy, this.WIN.CENTER);
//             this.math3D.transform(matrixOy, this.WIN.P1);
//             this.math3D.transform(matrixOy, this.WIN.P2);
//             this.math3D.transform(matrixOy, this.WIN.P3);
//         }
//         this.dx = event.offsetX;
//         this.dy = event.offsetY;
//     }

//     selectFigure() {
//         const figure = document.getElementById('selectFigure').value;
//         this.scene = [this.surfaces[figure]({})];
//     }

//     SolarSystem() {
//         const Sun = new Sphere({ color: '#ffff00', radius: 10 })
//         Sun.addAnimation('rotateOy', 0.01);
//         Sun.addAnimation('rotateOz', 0.01);
//         const Earth = new Sphere({ color: '#0022ff', radius: 5, x0: 20 });
//         Earth.addAnimation('rotateOy', 0.03, Sun.center);
//         Earth.addAnimation('rotateOz', 0.05);
//         const Moon = new Sphere({ color: '#969ba3', radius: 2, x0: Earth.center.x, y0: Earth.center.y, z0: Earth.center.z + 8 });
//         Moon.addAnimation('rotateOx', 0.1, Earth.center);
//         Moon.addAnimation('rotateOy', 0.03, Sun.center);
//         return [Sun, Earth, Moon];
//     }

//     calcPlaneEquation() {
//         this.math3D.calcPlaneEquation(this.WIN.CAMERA, this.WIN.CENTER)
//     }

//     getProection(point) {
//         const M = this.math3D.getProection(point);
//         const P2M = this.math3D.getVector(this.WIN.P2, M);
//         const cosa = this.math3D.calcCorner(this.P1P2, M);
//         const cosb = this.math3D.calcCorner(this.P2P3, M);
//         const module = this.math3D.moduleVector(P2M);
//         return {
//             x: cosa * module,
//             y: cosb * module
//         }
//     }

//     calcWindowVectors() {
//         this.P1P2 = this.math3D.getVector(this.WIN.P2, this.WIN.P1);
//         this.P2P3 = this.math3D.getVector(this.WIN.P3, this.WIN.P2);
//     }

//     renderScene(FPS) {
//         console.log(FPS);
//         this.graph.clear();
//         if (this.drawPolygons) {
//             const polygons = [];
//             this.scene.forEach((surface, index) => {
//                 this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
//                 this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
//                 this.math3D.calcCenter(surface);
//                 this.math3D.calcRadius(surface);
//                 this.math3D.calcVisibiliy(surface, this.WIN.CAMERA);
//                 surface.polygons.forEach(polygon => {
//                     polygon.index = index;
//                     polygons.push(polygon);
//                 });
//             });

//             this.math3D.sortByArtistAlgorithm(polygons);
//             polygons.forEach(polygon => {
//                 if (polygon.visibility || this.scene.surface) {
//                     const points = polygon.points.map(index =>
//                         new Point(
//                             this.getProection(this.scene[polygon.index].points[index]).x,
//                             this.getProection(this.scene[polygon.index].points[index]).y
//                         )
//                     );
//                     const { isShadow, dark } = this.math3D.calcShadow(polygon, this.scene, this.LIGHT);
//                     const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen * (isShadow ? dark : 1));
//                     let { r, g, b } = polygon.color;
//                     r = Math.round(r * lumen);
//                     g = Math.round(g * lumen);
//                     b = Math.round(b * lumen);
//                     this.graph.polygon(points, polygon.rgbToHex(r, g, b));
//                 }
//             });
//         }
//         if (this.drawPoints) {
//             this.scene.forEach(surface =>
//                 surface.points.forEach(
//                     point => this.graph.point(
//                         this.getProection(point).x,
//                         this.getProection(point).y
//                     )
//                 )
//             );
//         }
//         if (this.drawEdges) {
//             this.scene.forEach(surface =>
//                 surface.edges.forEach(edge => {
//                     const point1 = surface.points[edge.p1];
//                     const point2 = surface.points[edge.p2];
//                     this.graph.line(
//                         this.getProection(point1).x, this.getProection(point1).y,
//                         this.getProection(point2).x, this.getProection(point2).y
//                     );
//                 })
//             );
//         }
//         this.graph.renderFrame();
//     }

//     render() {
//         return(<div><canvas id='canvasGraph3D' className='asg'></canvas>
//         <div>
//             <select id = 'selectFigure'>
//             <option value = 'ellipticCylinder'>Эллиптический цилиндр</option>  
//                 <option value = 'ellipticParaboloid'>Эллиптический параболоид</option>    
//                 <option value = 'hyperbolicParaboloid'>Принглс??????</option>    
//                 <option value = 'twoSurfaceHyperboloid'>Двуполостный гиперболоид</option>    
//                 <option value = 'oneSurfaceHyperboloid'>Однополостный гиперболоид</option>    
//                 <option value = 'hyperbolicCylinder'>Гиперболический цилиндр</option>    
//                 <option value = 'kleinBottle'>Бутылка клейна</option>    
//                 <option value = 'sphere'>Сфера</option>    
//                 <option value = 'ellipse'>Эллипс</option>    
//                 <option value = 'thor'>Тор (бублик)</option>    
//                 <option value = 'cube'>Куб</option>
//             </select>
//         </div>
//         <div>
//             <label htmlFor="points">Рисовать точки</label>
//             <input className='customSurface' data-custom='drawPoints' type='checkbox' value ='points' defaultChecked></input>    
//             <label htmlFor="edges">Рисовать рёбра</label>
//             <input className='customSurface' data-custom='drawEdges' type='checkbox' value ='edges' defaultChecked></input>
//             <label htmlFor="polygons">Рисовать полигоны</label>
//             <input className='customSurface' data-custom='drawPolygons' type='checkbox' value ='polygons' defaultChecked></input>  
//         </div>
//         <div id = 'paramsBlock'>
//             <div id='cube params'></div>
//         </div>
//         </div>)
//     }
// }

// export default Graph3D;