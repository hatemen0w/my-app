Surfaces.prototype.kleinBottle = ({count = 30, color = '#0033ff'}) => {
    const points = [];
    const edges = [];
    const polygons = [];
    
    // about points
    const da = Math.PI * 2 / count;
    for (let u = 0; u < Math.PI; u += da) {
        for (let v = 0; v < Math.PI * 2; v += da) {
            const x = -2/15*Math.cos(u)*(3*Math.cos(v) - 30*Math.sin(u) + 90 * Math.cos(u)**4 * Math.sin(u) - 60 * Math.cos(u)**6 * Math.sin(u) + 5 * Math.cos(u) * Math.cos(v) * Math.sin(u));
            const y = -1/15*Math.sin(u)*(3*Math.cos(v) - 3*Math.cos(u)**2 * Math.cos(v) - 48*Math.cos(u)**4 * Math.cos(v) + 48*Math.cos(u)**6 * Math.cos(v) - 60*Math.sin(u) + 5*Math.cos(u) * Math.cos(v) * Math.sin(u) - 5*Math.cos(u)**3 * Math.cos(v) * Math.sin(u) - 80*Math.cos(u)**5 * Math.cos(v) * Math.sin(u) + 80*Math.cos(u)**7 * Math.cos(v) * Math.sin(u));
            const z = 2/15*(3 + 5*Math.cos(u) * Math.sin(u)) * Math.sin(v);
            points.push(new Point(x, y, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        } else {
            edges.push(new Edge(i, i % count));
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