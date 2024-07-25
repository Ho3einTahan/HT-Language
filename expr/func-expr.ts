
import Parser from "../parser.ts";
import { Expr, Stmt } from "../ast/ast.ts";
import { TokenType } from "../lexer/lexer.ts";
import { valueComputing } from "../function/value-computing.ts";
import { FuncType, MemoryFUNC } from "../memory/memory-func.ts";
import { MemoryVAR } from "../memory/memory-var.ts";
import process from "node:process";

// func unit (a,b){ let a=20 a=2+12 log(a)}
export function parse_function_expr(parser: Parser) {
    let type: string = '';
    let name: string = '';
    let params: Array<any> = [];
    let body: Expr[] = [];

    if (parser.at().type == TokenType.Func) {

        // remove KEYWORD func
        parser.eat();

        name = parser.eat().value;

        if (parser.at().type == TokenType.OpenParen) {

            // remove openParen
            parser.eat();

            // get  params
            while (parser.tokens[1].value == ',' || parser.at().value == ',') {

                if (parser.at().value == ',')
                    // remove ',' charecter
                    parser.eat();

                const param = parser.eat().value;

                // define varible with empty value
                parser.memoryVAR.define_VARIABLE(param, ' ', 'let');

                params.push(param);

            }

            // remove closeParen
            parser.eat();

            if (parser.at().value == ':') {

                // remove : charecter
                parser.eat();

                // get func type
                type = parser.eat().value;

            }

        }

        if (parser.at().type == TokenType.OpenBracket) {

            // remove openBracket
            parser.eat();

            while (parser.at().type != TokenType.CloseBracket) {
                // moshkel tavajjoh kon 
                body.push(parser.parse_expr());
            }

            // remove closeBracket
            parser.eat();
        }

    }
    else if (parser.memoryFUNC.isExist(parser.at().value)) {

        name = parser.eat().value;

        const func = parser.memoryFUNC.get_FUNCTION_VALUE(name);

        // remove openParen 
        parser.eat();

        if (func.params.length > 0) {

            if (parser.memoryVAR.isExist(parser.at().value)) {

                // get  params
                while (parser.memoryVAR.isExist(parser.at().value) || parser.at().value == ',') {

                    if (parser.at().value == ',') {
                        // remove ',' charecter
                        parser.eat();
                    }

                    const paramExpr = parser.parse_expr();

                    const paramValue = valueComputing(paramExpr, parser.memoryVAR, parser.memoryFUNC,parser.memoryLIST);
            
                    parser.memoryVAR.define_VARIABLE('paramName', paramValue, 'let');

                    params.push(paramValue);

                }

            }
            else {
                console.error('pleas pass params to the function');
                process.exit(0);
            }

        }
        // remove closeParen
        parser.eat();

    }

    if (type) {
        parser.memoryFUNC.define_FUNCTION(name, { type, body, params } as FuncType);
    }
    else {

        // get FUNCVALUE By name
        const func = parser.memoryFUNC.get_FUNCTION_VALUE(name);

        // update params value
        parser.memoryFUNC.define_FUNCTION(name, { type: func.type, body: func.body, params } as FuncType);

        func.body.forEach(funcExpr => {
            valueComputing(funcExpr, parser.memoryVAR, parser.memoryFUNC,parser.memoryLIST);
        });

    }
    
    //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) }
    // func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }

    return {} as Stmt;
}