
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

    while (parser.at().value == '=') {
        operator = parser.eat().value;
        value = parse_additive_expr(parser);
    }
    
    const varibleValue = valueComputing(value, parser.memoryVAR, parser.memoryFUNC, parser.memoryLIST);

    parser.memoryVAR.define_VARIABLE(name, varibleValue, type);

    return {} as Stmt;
}