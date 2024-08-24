import Parser from "../parser/Parser";

export class Loop {

    static For(parser: Parser) {

        // remove for KEYWORD
        parser.eat();

        // remove CloseParen
        parser.eat();

        let conditions: Array<any> = [];

        const start = parseFloat(parser.eat().value);

        // remove ; character
        parser.eat();

        while (parser.at().value != ';') {
            conditions.push(parser.eat().value);
        }

        // remove ; character 
        parser.eat();

        const condition = eval(conditions.join(''));

        const step = parser.eat().value;

        /*  for (start; condition; start++) {
             
         } */


    }

    static While() {

    }

}