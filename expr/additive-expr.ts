import { BinaryExpr, Expr } from "../ast/ast.ts";
import Parser from "../parser.ts";


export function parse_additive_expr(parser: Parser): Expr {

    let left = parse_multiplicative_expr(parser);

    while (parser.not_eof() && parser.at().value === '+' || parser.at().value === '-') {

        const operator = parser.eat().value;

        const right = parse_multiplicative_expr(parser);

        left = { kind: "BinaryExpr", left, operator, right } as BinaryExpr;

    }

    return left;
}



function parse_multiplicative_expr(parser: Parser) {

    let left = parser.parse_primary_expr();

    while (parser.not_eof() && (parser.at().value === '*' || parser.at().value === '/')) {

        const operator = parser.eat().value;

        const right = parser.parse_primary_expr();

        left = { kind: "BinaryExpr", left, operator, right } as BinaryExpr;

    }

    return left;
}
