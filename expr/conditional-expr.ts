import Parser from "../parser.ts";
import { TokenType } from "../lexer/lexer.ts";
import { Expr, conditionalExpr } from "../ast/ast.ts";
import { parse_varible_expr } from "./varible-expr.ts";



export function parse_conditional_expr(parser: Parser) {

    let params: Array<string> = [];
    let body: Array<Expr> = [];

    // remove IF KEYWORD
    parser.eat();

    // remove openParen
    parser.eat();

    while (parser.at().type != TokenType.CloseParen) {
        if (parser.memoryVAR.get(parser.at().value))
            params.push(parser.memoryVAR.get(parser.eat().value));
        else
            params.push(parser.eat().value);
    }

    // remove closeParen
    parser.eat();

    // remove openBracket
    parser.eat();

    while (parser.at().type != TokenType.CloseBracket) {

        // if this.at().value exist in memory update varible value
        if (parser.at().type == TokenType.Let || parser.at().type == TokenType.Const || parser.memoryVAR.get(parser.at().value))
            // update varible value
            parse_varible_expr(parser);

        else
            body.push(parser.parse_expr());

    }

    // remove closeBracket
    parser.eat();

    let paramResult: boolean = eval(params.join(''));

    if (parser.at().type == TokenType.ELSE) {

        // remove ELSE KEYWORD
        parser.eat();

        // remove openBracket
        parser.eat();

        // clear body for new tokens in else
        if (paramResult == false) {
            body = [];
        }

        while (parser.at().type != TokenType.CloseBracket) {

            // if top condition is false
            if (paramResult == false) {
                if (parser.at().type == TokenType.Let || parser.at().type == TokenType.Const || parser.memoryVAR.get(parser.at().value))
                    // update varible value or define varible
                    parse_varible_expr(parser);

                else
                    body.push(parser.parse_expr());

            } else {
                // remove extra tokens
                parser.eat();
            }

        }

        // remove closeBracket
        parser.eat();

        if (paramResult == false)
            paramResult = true;

    }

    if (paramResult == false)
        body = [];

    return { kind: "ConditionalExpr", params, paramResult, body } as conditionalExpr;
}