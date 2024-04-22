Surfaces.prototype.hyperbolicCylinder = ({count = 20, a = 1, b = 1, color = '#00ffff'}) => {
    const points = [];
    const edges = [];
    const polygons = [];
    const opened = true;
    
    // about points
    const da = Math.PI * 2 / count;
    for (let u = -Math.PI; u < Math.PI; u += da) {
        for (let v = -Math.PI; v < Math.PI; v += da) {
            const x = a * Math.cosh(u);
            const y = b * Math.sinh(u);
            const z = v;
            points.push(new Point(x, y, z));
        }
    }
    for (let u = -Math.PI; u < Math.PI; u += da) {
        for (let v = -Math.PI; v < Math.PI; v += da) {
            const x = -a * Math.cosh(u);
            const y = b * Math.sinh(u);
            const z = v;
            points.push(new Point(x, y, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length / 2; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (i + count < points.length / 2) {
            edges.push(new Edge(i, i + count));
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
    }

    for (let i = 0; i < points.length / 2; i++) {
        if (i + count + 1 < points.length / 2) {
            polygons.push(new Polygon([
                i,
                i + 1,
                i + count + 1,
                i + count
            ], color))
        }

    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (points[i + count + 1]) {
            polygons.push(new Polygon([
                i,
                i + 1,
                i + count + 1,
                i + count
            ], color))
        }

    }

    return new Surface(points, edges, polygons);
}