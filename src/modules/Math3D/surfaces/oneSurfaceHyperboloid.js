Surfaces.prototype.oneSurfaceHyperboloid = ({count = 30, a = 3, b = 3, c = 4, color = '#0000ff'}) => {
    const points = [];
    const edges = [];
    const polygons = [];
    
    // about points
    const da = Math.PI * 2 / count;
    for (let u = -Math.PI; u < Math.PI; u += da) {
        for (let v = -Math.PI; v < Math.PI; v += da) {
            const x = a * Math.cosh(u) * Math.cos(v);
            const y = b * Math.cosh(u) * Math.sin(v);
            const z = c * Math.sinh(u);
            points.push(new Point(x, y, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if (((i + 1) % (count + 1) !== 0)) {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
    }

    for (let i = 0; i < points.length; i++) {
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