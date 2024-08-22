
import Parser from "../parser/Parser.ts";
import { TokenType } from "../lexer/lexer.ts";
import { Stmt } from "../ast/ast.ts";
import { parse_additive_expr } from "./additive-expr.ts";
import { valueComputing } from "../function/value-computing.ts";

// const a=10

// let b=20
export function parse_varible_expr(parser: Parser) {

    let type, name, operator, value;

    // if varibleName exists a=10
    if (parser.at().type == TokenType.Let || parser.at().type == TokenType.Const || parser.at().type == TokenType.String || parser.at().type == TokenType.Int || parser.at().type == TokenType.Bool) {
        type = parser.parse_primary_expr();
    }

    name = parser.eat().value;

    operator = parser.eat().value;

    if (parser.memoryVAR.hasVariable(parser.at().value)) {
        value = parser.memoryVAR.get_VALUE_OF_VARIABLE(parser.eat().value);
    }
    else if (parser.memoryLIST.hasList(parser.at().value)) {

        const unValidOperators = ['+', '-', '*', '/', '%'];
        value = parser.memoryLIST.get_BODY_OF_LIST(parser.eat().value).body;
        value = ['[', ...value.map((item, index) => index < value.length - 1 ? item + ',' : item), ']'].join('');

        const operator = parser.at().value;
        const MSG = ` '${operator}' cant be applied to types List `;
        if (unValidOperators.includes(parser.at().value)) throw Error(MSG);

    }
    else {
        value = parser.parse_expr();
        const varibleValue = valueComputing(value, parser.memoryVAR, parser.memoryFUNC, parser.memoryLIST);
        parser.memoryVAR.define_VARIABLE(name, varibleValue, type);
        return {} as Stmt;
    }

    parser.memoryVAR.define_VARIABLE(name, value, type);

    return {} as Stmt;
}