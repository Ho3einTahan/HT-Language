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

    let paramResult: boolean = eval(params.join(''));

    // remove openBracket
    parser.eat();

    // set count of openBrackets
    let openBrackets = 1;

    while (openBrackets > 0) {

        if (parser.at().type == TokenType.OpenBracket) {
            openBrackets++;
        } else if (parser.at().type == TokenType.CloseBracket) {
            openBrackets--;
            if (openBrackets == 0) break;
        }

        if (paramResult == false) parser.eat();

        // If this.at().value exists in the variable, the value of the variable is updated
        else if (parser.at().type == TokenType.Let || parser.at().type == TokenType.Const || parser.memoryVAR.get(parser.at().value))
            parse_varible_expr(parser);
        else
            body.push(parser.parse_expr());


    }

    // remove closeBracket
    parser.eat();

    if (parser.at().type == TokenType.ELSE) {

        // remove ELSE KEYWWORD
        parser.eat();

        // remove openBracket
        parser.eat();


        if (paramResult == false) body = [];


        openBrackets = 1;

        while (openBrackets > 0) {

            if (parser.at().type == TokenType.OpenBracket) {
                openBrackets++;
            } else if (parser.at().type == TokenType.CloseBracket) {
                openBrackets--;
                if (openBrackets == 0) break;
            }

            if (paramResult == false) {

                if (parser.at().type == TokenType.Let || parser.at().type == TokenType.Const || parser.memoryVAR.get(parser.at().value))
                    parse_varible_expr(parser);

                else
                    body.push(parser.parse_expr());

            } else
                parser.eat();

        }

        // remove closeBracket
        parser.eat();

        if (paramResult == false) paramResult = true;
    }

    return { kind: "ConditionalExpr", params, paramResult, body } as conditionalExpr;
}
