    
    import Parser from "../parser.ts";
    import { Expr,Stmt } from "../ast.ts";
    import { TokenType } from "../lexer/lexer.ts";
    import { valueComputing } from "../function/value-computing.ts";

    // func unit (a,b){ let a=20 a=2+12 log(a)}
    export function parse_function_expr(parser:Parser) {
        let name;
        let body: Expr[] = [];
        let params = new Array<string>;

        if (parser.at().type == TokenType.Func) {

            // remove KEYWORD func
            parser.eat();

            name = parser.eat().value;

            if (parser.at().type == TokenType.OpenParen) {

                // remove openParen
                parser.eat();

                // get  params
                while (parser.tokens[1].value == ',' || parser.at().value == ',') {

                    if (parser.at().value == ',') {
                        // remove ',' charecter
                        parser.eat();
                    }

                    params.push(parser.eat().value);
                }

                // remove closeParen
                parser.eat();
            }

            if (parser.at().type == TokenType.OpenBracket) {

                // remove openBracket
                parser.eat();

                while (parser.at().type != TokenType.CloseBracket) {
                    body.push(parser.parse_expr());
                }

                // remove closeBracket
                parser.eat();
            }
        }
        else if (parser.memoryFUNC.get_FUNC_VALUE(parser.at().value)) {

            const body = parser.memoryFUNC.get_FUNC_VALUE(parser.eat().value);

            body.forEach(funcExpr => {
                valueComputing(funcExpr, parser.memoryVAR, parser.memoryFUNC);
            });


            // remove openParen 
            parser.eat();

            // remove closeParen
            parser.eat();

        }

        //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) }
        // func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }

        parser.memoryFUNC.define_FUNCTION(name, body, 'func');

        // return { kind: "FunctionCaller", name, params, body } as FunctionCaller;
        return {} as Stmt;
    }