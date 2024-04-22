import { Complex, Vector, Matrix, Member, Polynomial } from "./types";
import {
    ComplexCalculator,
    VectorCalculator,
    MatrixCalculator,
    RealCalculator
} from './calculators';
import PolynomialCalculator from './PolynomialCalculator';

class Calculator {
    getPolynomial(str) {
        const poly = [];
        if (str && typeof str === 'string') {
            str = str.replaceAll('-', '+-');
            if (str[0] === '+') {
                str = str.replace('+', '')
            }
            str = str.replaceAll(' ', '');
            const members = str.split('+');
            members.forEach((member, index) => {
                if (!(member[member.indexOf('x') - 1] === '*')) {
                    member = member.replace('x', '1*x');
                    members[index] = member;
                }
                if (!(member[member.indexOf('x') + 1] === '^')) {
                    member = member.replace('x', 'x^1');
                    members[index] = member;
                }
                if (!(member.includes('x'))) {
                    member = member + '*x^0';
                    members[index] = member;
                }
                poly.push(new Member(member.split('*x^')[0] - 0, member.split('*x^')[1] - 0))
            })
        }
        return new Polynomial(poly);
    }

    getValueAtPoint(polynomial, x) {
        polynomial = polynomial.replaceAll('^', '**').replaceAll('x', x)
        return eval(polynomial);
    }


    getMatrix(str) {
        if (str instanceof Array) return new Matrix(str);
        if (str && typeof str === 'string') {
            str = str.replaceAll(' ', '');
            str = str.replaceAll(',', ' ');
            str = str.replaceAll(' \n', '\n');
            const arr = str.split('\n');
            const values = [];
            for (let i = 0; i < arr.length; i++) {
                values.push(arr[i].split(' ').map(el => this.getValue(el)));
            }
            if (values[0] instanceof Array) {
                return new Matrix(values);
            }
        }
        return null;
    }

    getVector(str) {
        if (str instanceof Array) return new Vector(str);
        if (str && typeof str === 'string') {
            const arr = str.replace('(', '').replace(')', '').split(' ').map(el => this.getValue(el));
            return new Vector(arr);
        }
        return null;
    }

    getComplex(str) {
        if (typeof str === 'number') return new Complex(str);
        if (str && typeof str === 'string') {

            if (str[str.indexOf('i') + 1] !== '*') {
                str = str.replace('i', 'i*1');
            }

            const arrStr = str.split('i*');
            if (arrStr.length === 2) {
                if (arrStr[0].includes('+')) {
                    arrStr[0] = arrStr[0].replace('+', '');
                    return new Complex(arrStr[0] - 0, arrStr[1] - 0);
                }
                if (arrStr[0].includes('-')) {
                    arrStr[0] = arrStr[0].replace('-', '');
                    return new Complex(arrStr[0] - 0, -arrStr[1] - 0);
                }
            }
            if (arrStr.length === 1) {
                if (isNaN(arrStr[0] - 0)) return null;
                return new Complex(arrStr[0] - 0);
            }
            return new Complex(arrStr[0] - 0, arrStr[1] - 0);
        }
        return null;
    }

    getValue(str) {
        if (str.includes('\n')) return this.getMatrix(str);
        if (str.includes('(')) return this.getVector(str);
        if (str.includes('x')) return this.getPolynomial(str);
        if (str.includes('i')) return this.getComplex(str);
        return str - 0;
    }

    complex(re, im) {
        return new Complex(re, im);
    }

    vector(values) {
        return new Vector(values);
    }

    matrix(values) {
        return new Matrix(values);
    }

    get(elem) {
        if (elem instanceof Polynomial) {
            return new PolynomialCalculator((elem));
        }
        if (elem instanceof Matrix) {
            return new MatrixCalculator(this.get(elem.values[0][0]));
        }
        if (elem instanceof Vector) {
            return new VectorCalculator(this.get(elem.values[1]));
        }
        if (elem instanceof Complex) {
            return new ComplexCalculator;
        }
        return new RealCalculator;
    }

    add(a, b) {
        return this.get(a).add(a, b);
    }

    sub(a, b) {
        return this.get(a).sub(a, b);
    }

    mult(a, b) {
        return this.get(a).mult(a, b);
    }

    div(a, b) {
        return this.get(a).div(a, b);
    }

    prod(a, b) {
        return this.get(a).prod(a, b);
    }

    pow(a, b) {
        return this.get(a).pow(a, b);
    }

    one(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).one();
            case 'Vector': return this.get(this.vector()).one(elem.values.length);
            case 'Matrix': return this.get(this.matrix()).one(elem.values.length);
            default: return this.get().one();
        }
    }

    zero(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).zero();
            case 'Vector': return this.get(this.vector()).zero(elem.values.length);
            case 'Matrix': return this.get(this.matrix()).zero(elem.values.length);
            default: return this.get().zero();
        }
    }
}

export default Calculator;
