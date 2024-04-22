Surfaces.prototype.ellipticParaboloid = ({count = 20, a = 2, b = 2, color = '#ff3333'}) => {
    const points = [];
    const edges = [];
    const polygons = [];
    
    // about points
    const da = Math.PI * 2 / count;
    for (let u = -Math.PI; u < Math.PI; u += da) {
        for (let v = -Math.PI; v < Math.PI; v += da) {
            const x = u
            const y = v
            const z = (x**2 / a**2) + (y**2 / b**2) / 2
            points.push(new Point(x, y, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if (((i + 1) % (count) !== 0)) {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        }
    }

    for (let i = 0; i < points.length; i++) {
        if (points[i + count + 1]) {
            if ((i + 1) % count !== 0){
                polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + count + 1,
                    i + count
                ], color))
            }
        }

    }

    return new Surface(points, edges, polygons);
}
