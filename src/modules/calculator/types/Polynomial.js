import Calculator from "../Calculator";

class Polynomial {
    constructor (poly = []) {
        this.poly = poly;
        this.poly.sort((a, b) => b.power - a.power);
    }

    toString() {
        const polynomial = [];
        this.poly.forEach(member => {
            member = member.value.toString() + '*x^' + member.power.toString();
            polynomial.push(member);
        })
        let polynomialStr = polynomial.join(' + ');
        polynomialStr = ' ' + polynomialStr + ' ';
        return polynomialStr.replaceAll('+ -', '- ').replaceAll('*x^0', '').replaceAll('x^1 ', 'x ').replaceAll(' 1*x', ' x').replaceAll(' + 0 ', ' ');
    }

    getValue(x) {
        const calculator = new Calculator;
        console.log(x);
        return this.poly.reduce((S, elem) => calculator.add(calculator.mult(elem.value, calculator.pow(x, elem.power)), S), calculator.zero(null, x));
    }
}

export default Polynomial;