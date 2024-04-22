import RealCalculator from "./RealCalculator";
import { Complex } from "../types";

class ComplexCalculator {
    constructor(calc = new RealCalculator) {
        this.calc = calc;
    }

    add(a, b) {
        return new Complex (a.re + b.re, a.im + b.im);
    }

    sub(a, b) {
        return new Complex (a.re - b.re, a.im - b.im);
    }

    mult(a, b) {
        return new Complex (a.re * b.re - b.im * a.im, a.re * b.im + a.im * b.re);
    }

    inv(a) {
        return new Complex (a.re / (a.re**2 + a.im**2), -a.im / (a.re**2 + a.im**2))
    }

    div(a, b) {
        return this.mult(a, this.inv(b));
    }

    pow(a, n) {
        let S = new Complex(a.re, a.im);
        for (let i = 1; i<n; i++) {
            S = this.mult(S, a);
        }
        return S;
    }

    prod(a, p) {
        return new Complex(a.re * p, a.im * p);
    }

    one() {
        return new Complex(this.calc.one());
    }

    zero() {
        return new Complex;
    }
}

export default ComplexCalculator;