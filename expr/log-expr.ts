import Parser from "../parser.ts";
import { TokenType } from "../lexer/lexer.ts";
import { LogExpr } from "../ast/ast.ts";
import { ListParser } from "../function/list-parser.ts";

// log('1'+'2')  log(1+2) log((2*2)+25+(32))
export function parse_log_expr(parser: Parser) {

    let params: Array<any> = [];

    // remove KEYWORD log
    parser.eat();

    let OPEN_CLOSE_Paren: Array<any> = [];

    if (parser.at().type == TokenType.OpenParen) {

        // we do not remove open AND closeParen
        // and we remove open AND closeParen at the end of log-expr.ts file

        while (parser.not_eof() && parser.at().type != TokenType.Log && parser.at().type != TokenType.Const && parser.at().type != TokenType.Let && parser.at().type != TokenType.CloseBracket) {

            if (parser.at().type == TokenType.Func || parser.at().type == TokenType.IF || parser.at().type == TokenType.ELSE || parser.at().type == TokenType.ElseIf || parser.memoryFUNC.hasFunction(parser.at().value)) break;

            if (parser.at().type == TokenType.OpenParen) {
                OPEN_CLOSE_Paren.push('(');
            }
            if (parser.at().type == TokenType.CloseParen) {
                OPEN_CLOSE_Paren.pop();
            }

            if (OPEN_CLOSE_Paren.length == 0) break;

            // get other param 
            if (parser.memoryVAR.hasVariable(parser.at().value)) {
                params.push(parseVaribleExpression(parser));
            }
            else if (parser.memoryLIST.hasList(parser.at().value)) {

                // get body of list
                const body = parser.memoryLIST.get_BODY_OF_LIST(parser.eat().value).body;

                // if it was a methode .  it will have a '.' character
                if (parser.at().value == '.') {

                    parser.eat();

                    params.push(ListParser.parse(parser, eval(body.join(''))));
                }
                else {
                    console.log(eval(body.join('')));
                    params.push(eval(body.join('')).toString());
                }

            }
            else {
                params.push(parser.eat().value);
            }

        }

    }

    // remove openParen   (
    params.shift();

    // remove closeParen  )
    parser.eat();

    //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
    return { kind: "LogExpr", params } as LogExpr;
}


function parseVaribleExpression(parser: Parser): any {
    return parser.memoryVAR.get_VALUE_OF_VARIABLE(parser.eat().value);
}