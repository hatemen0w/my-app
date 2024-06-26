import { Polynomial, Member } from "./types";
import { RealCalculator } from "./calculators";
import Calculator from "./Calculator";

class PolynomialCalculator {
    constructor(calc = new RealCalculator) {
        this.calc = calc;
    }

    polynomial(members) {
        return new Polynomial(members);
    }

    add(a, b) {
        console.log(a, b)
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.add(elemA.value, member.value), elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });

        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(elemB.value, elemB.power));
            }
        });

        return new Polynomial(members);
    }

    sub(a, b) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.sub(elemA.value, member.value), elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });

        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(elemB.value, elemB.power));
            }
        });

        return new Polynomial(members);
    }

    mult(a, b) {
        const calc = new Calculator;
        let polynomial = new Polynomial;
        a.poly.forEach(elemA => {
            const members = [];
            b.poly.forEach(elemB => {
                members.push(new Member(calc.mult(elemA.value, elemB.value), calc.add(elemA.power, elemB.power)));
            });
            polynomial = this.add(polynomial, new Polynomial(members));
        });
        return polynomial;
    }

    pow(a, n) {
        let polynomial = new Polynomial([new Member(1, 0)]);;
        for (let i = 0; i<n; i++) {
            polynomial = this.mult(polynomial, a);
        }
        return polynomial;
    }

    zero() {
        return new Polynomial;
    }
}

export default PolynomialCalculator;