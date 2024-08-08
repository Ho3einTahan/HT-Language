import Parser from "../parser/Parser.ts";
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

                const listName = parser.eat().value;

                // get body of list
                const body = parser.memoryLIST.get_BODY_OF_LIST(listName).body;
                const listType = parser.memoryLIST.get_BODY_OF_LIST(listName).type;

                // if it was a methode .  it will have a '.' character
                if (parser.at().value == '.') {

                    // removed . character
                    parser.eat();/* 

                    const listAsString = listType == 'liststring' ? body.map(token => {
                        // Add quotes to non-symbol tokens
                        if (token !== "[" && token !== "]" && token !== ",") {
                            return `'${token}'`;
                        }
                        return token;
                    }) : body;
                    console.log(listAsString);
                    console.log(body); */
                    console.log(body);
                    console.log(body.join(''));
                    params.push(ListParser.parse(parser, listName, eval(body.join(',')), listType));

                }
                else {

                    const list = body.map(token => {
                        if (listType == 'liststring') return `"${token}"`;
                        else return token;
                    });

                    // remove openParen 
                    params.shift();

                    params.push('[');

                    list.forEach((item) => {
                        params.push(item);
                        params.push(',');
                    });

                    params.pop();
                    params.push(']');
                }


            }
            else {
                // cant applide any operator to List Types
                // []+12 => Error
                // [] => correct
                if (params[params.length - 1] == ']' && parser.at().value == '+' || parser.at().value == '-' || parser.at().value == '*' || parser.at().value == '/' || parser.at().value == '%') {
                    const operator = parser.at().value;
                    const MSG = `${operator} cant be applied to types List `;
                    throw Error(MSG);
                }

                params.push(parser.eat().value);
            }

        }

    }

    // remove closeParen  )
    parser.eat();

    //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
    return { kind: "LogExpr", params } as LogExpr;
}


function parseVaribleExpression(parser: Parser): any {
    return parser.memoryVAR.get_VALUE_OF_VARIABLE(parser.eat().value);
}

function parseListExpression(parser: Parser, listName: string) {

    let params: Array<any> = [];


}