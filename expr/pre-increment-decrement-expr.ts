import { Expr, NumericLiteral } from "../ast/ast.ts";
import Parser from "../parser/Parser.ts";

export function parse_preIncrement_decrement_expr(parser: Parser, Varname: string): Expr {

    // Variable Value
    let Varvalue;
    // Variable Type
    let Vartype;

    // remove ++ OR -- OR ** character
    const operator = parser.eat().value;

    if (parser.memoryVAR.hasVariable(Varname)) {

        Varvalue = parser.memoryVAR.get_VALUE_OF_VARIABLE(Varname).value;
        Vartype = parser.memoryVAR.get_VALUE_OF_VARIABLE(Varname).type;

        switch (operator) {

            case '++':
                ++Varvalue;
                break;
            case '--':
                --Varvalue;
                break;

            case '**':
                Varvalue = Varvalue * Varvalue;
                break;

            default:
                throw Error('Undefined Operator');
        }


    }

    // Update Value OF Variable
    parser.memoryVAR.define_VARIABLE(Varname, Varvalue, Vartype);

    return {} as Expr;

}