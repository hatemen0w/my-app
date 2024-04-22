function Graph(options) {
    const { id, width = 300, height = 300, WIN, callbacks = {} } = options;
    let canvas;
    if (id) {
        canvas = document.getElementById(id);
    } else {
        canvas = document.createElement('canvas');
        document.querySelector('body').appendChild(canvas);
    }

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    canvas.addEventListener('wheel', callbacks.wheel);
    canvas.addEventListener('mousedown', callbacks.mousedown);
    canvas.addEventListener('mousemove', callbacks.mousemove);
    canvas.addEventListener('mouseup', callbacks.mouseup);
    canvas.addEventListener('mouseleave', callbacks.mouseleave);
    canvas.addEventListener('mousemove', callbacks.getX);

    //Отображение координаты x на canvas
    const xs = (x) => ((x - WIN.LEFT) / WIN.WIDTH) * canvas.width;

    //Отображение координаты y на canvas
    const ys = (y) => (WIN.HEIGHT - (y - WIN.BOTTOM)) * canvas.width / WIN.HEIGHT;

    //xs наоборот
    this.sx = x => x * WIN.WIDTH / canvas.width + WIN.LEFT;

    //ys наоборот
    this.sy = y => -y * WIN.HEIGHT / canvas.height - WIN.BOTTOM;

    this.clear = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    this.line = (x1, y1, x2, y2, color, width) => {

        context.beginPath();
        context.strokeStyle = color || 'black';
        context.lineWidth = width || 4;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.stroke();
        context.closePath();
    }

    this.point = (x, y, color = 'black', size = 5) => {
        context.beginPath();
        context.strokeStyle = color;
        context.fillStyle = color;
        context.arc(xs(x), ys(y), size, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
        context.closePath();
    }

    this.print = (x, y, text, color, size) => {
        context.font = size / WIN.WIDTH + "px Verdana";
        context.fillStyle = color;
        context.fillText(text, xs(x), ys(y));
        context.stroke;
    }

    this.dashedLine = (x1, y1, x2, y2, color, width) => {
        context.beginPath();
        context.setLineDash([20, 5]);
        context.strokeStyle = color || 'black';
        context.lineWidth = width || 4;
        context.moveTo(xs(x1), ys(y1));
        context.lineTo(xs(x2), ys(y2));
        context.stroke();
        context.closePath();
        context.setLineDash([0, 0]);
    }
}

//для проекта двумерной графики добавить интерполяцию. ЛКМ добавляет любое количество точек на канвас, добавить кнопку удаления точек. Точки соединить любым доступным интерполяционным способом
//посчитать площадь получившейся криволинейной трапеции и вывести на экран
//*вывести формулу функции, которая интерполирует эти точки
//**точки уметь перетаскивать мышкой с пересчётом значений