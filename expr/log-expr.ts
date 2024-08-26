import Parser from "../parser/Parser.ts";
import { TokenType } from "../lexer/lexer.ts";
import { LogExpr } from "../ast/ast.ts";
import { ListParser } from "../function/list-parser.ts";
import { parse_preIncrement_decrement_expr } from "./pre-increment-decrement-expr.ts";
import { parse_postIncrement_decrement_expr } from "./post-increment-decrement-expr.ts";

// log('1'+'2')  log(1+2) log((2*2)+25+(32))
export function parse_log_expr(parser: Parser) {

    let params: Array<any> = [];

    // remove KEYWORD log
    parser.eat();

    let OPEN_CLOSE_Paren: Array<any> = [];

    // we do not remove open AND closeParen
    // and we remove open AND closeParen at the end of log-expr.ts file

    while (parser.not_eof() && parser.at().type != TokenType.Log && parser.at().type != TokenType.Const && parser.at().type != TokenType.Let && parser.at().type != TokenType.CloseBracket) {

        if (parser.at().type == TokenType.Func || parser.at().type == TokenType.IF || parser.at().type == TokenType.ELSE || parser.at().type == TokenType.ElseIf || parser.memoryFUNC.hasFunction(parser.at().value)) break;

        if (parser.at().type == TokenType.OpenParen) OPEN_CLOSE_Paren.push('(');
        if (parser.at().type == TokenType.CloseParen) OPEN_CLOSE_Paren.pop();

        if (OPEN_CLOSE_Paren.length == 0) break;

        if (parser.memoryVAR.hasVariable(parser.at().value)) {
            // example a++
            if (parser.tokens[1].type == TokenType.Increment || parser.tokens[1].type == TokenType.Decrement) {
                params.push(parsePostIncrement_Decrement_Expression(parser));
            }
            else {
                params.push(parseVaribleExpression(parser));
            }
        }
        else if (parser.at().type == TokenType.Increment || parser.at().type == TokenType.Decrement || parser.at().type == TokenType.Exponentiation) {
            params.push(parsePreIncrement_Decrement_Expression(parser));
        }
        else if (parser.memoryLIST.hasList(parser.at().value)) {


            const listName = parser.eat().value;
            const list = parser.memoryLIST.get_BODY_OF_LIST(listName).body;
            const listType = parser.memoryLIST.get_BODY_OF_LIST(listName).type;

            switch (parser.at().value) {
                // HANDLE List Methode
                case '.':
                    params.push(parseListMethodeExpression(parser, listName, list, listType));
                    break;

                // if it has not methode
                default:

                    const emptyList = list.map(token => {
                        if (listType == 'liststring') return `"${token}"`;
                        return token;
                    });

                    // remove openParen OF Log  ==> log()
                    params.shift();

                    params.unshift('[');

                    emptyList.map((item) => {
                        params.push(item);
                        params.push(',');
                    });

                    // Remove , character At Last Element OF List
                    params.pop();
                    // Add closeBrack At The End OF Array
                    params.push(']');
                    break;
            }
        }
        else {
            parseOperatorToApplyList(params, parser);

            params.push(parser.eat().value);
        }

    } // END OF WHILE

    // remove openParen OF Log  ==> log()
    if (params[0] == '(') params.shift();

    // remove closeParen OF Log  ==> log()
    parser.eat();

    //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
    return { kind: "LogExpr", params } as LogExpr;
}


function parseVaribleExpression(parser: Parser): any {
    return parser.memoryVAR.get_VALUE_OF_VARIABLE(parser.eat().value).value;
}


function parsePreIncrement_Decrement_Expression(parser: Parser) {

    // tokens[0] => ++ -- **   tokens[1] => VarName
    const Varname = parser.tokens[1].value;
    
    // Remove Value OF Index 1 IN Array
    parser.tokens.splice(1, 1);

    parse_preIncrement_decrement_expr(parser, Varname);

    return parser.memoryVAR.get_VALUE_OF_VARIABLE(Varname).value;
}


function parsePostIncrement_Decrement_Expression(parser: Parser) {

    //   tokens[0] => VarName tokens[1] => ++ -- **
    const Varname = parser.eat().value;

    // get current value of variable
    const VarValue = parser.memoryVAR.get_VALUE_OF_VARIABLE(Varname).value;

    // HANDLE Increment AND Decrement => ++ --
    parse_postIncrement_decrement_expr(parser, Varname);

    // return previous value of variable
    return VarValue;
}

function parseListMethodeExpression(parser: Parser, listName: string, list: Array<any>, listType: string) {
    // removed . character
    parser.eat();

    return ListParser.parse(parser, listName, list, listType)
}


function parseOperatorToApplyList(params: Array<any>, parser: Parser) {

    const unValidOperators = ['+', '-', '*', '/', '%'];

    // [a,b,c,d,e,f]+12 => Error
    // [a,b,c,d,e,f] => correct
    if (params.indexOf(']') != -1 && unValidOperators.includes(parser.at().value)) {
        const operator = parser.at().value;
        const MSG = ` '${operator}' cant be applied to types List `;
        throw Error(MSG);
    }

}