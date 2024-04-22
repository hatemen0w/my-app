import Point from "./Point";

class Polygon {
    constructor(points = [], color = '#ff0022') {
        this.points = points;
        this.color = this.hexToRgb(color);
        this.distance = 0;
        this.lumen = 1;
        this.center = new Point;
        this.R = 1;
        this.visibility = true;
    }

    hexToRgb(hex) {
        const result = /^#?([a - f\d]{2})([a - f\d]{2})([a - f\d]{2})$/i.exec(hex);
        return result?{
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {
                r: 159,
                g: 131,
                b: 3
            }
    }

    rgbToHex(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`
    }
}

export default Polygon;