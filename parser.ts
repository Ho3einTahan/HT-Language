import { Stmt, Program, NumericLiteral, Expr, Identifire, VaribleLiteral, FunctionCaller, LogExpr, conditionalExpr } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";
import { valueComputing } from "./function/value-computing.ts";
import { MemoryVAR } from "./class/memory-var.ts";
import { MemoryFUNC } from "./class/memory-func.ts";

export default class Parser {

    private tokens: Token[] = [];

    public memoryVAR = new MemoryVAR();

    public memoryFUNC = new MemoryFUNC();

    private not_eof(): boolean {
        return this.tokens[0]?.type !== undefined && this.tokens[0].type !== TokenType.EOF;
    }

    private at() {
        return this.tokens[0];
    }


    private eat() {
        return this.tokens.shift() as Token;
    }


    public produceAST(sourceCode: string): Program {

        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "program",
            body: [],
        };

        // parse until End Of File
        while (this.not_eof()) {
            const expr = this.parse_Stmt();

            if (JSON.stringify(expr) != '{}') {
                program.body.push(expr);
            }
        }
        return program;
    }

    private parse_Stmt(): Stmt {
        return this.parse_expr();
    }


    private parse_expr(): Expr {
        // if varibleName  exists in memory
        // let a=10
        // a=10
        if (this.at().type == TokenType.Let || this.at().type == TokenType.Const || this.memoryVAR.get(this.at().value)) {
            return this.parse_varible_expr();
        }
        else if (this.at().type == TokenType.Number) {
            return this.parse_additive_expr();
        }
        else if (this.at().type == TokenType.Func || this.memoryFUNC.get_FUNC_VALUE(this.at().value)) {
            return this.parse_function_expr();
        }
        else if (this.at().type == TokenType.Log) {
            return this.parse_log_expr();
        }
        else if (this.at().type == TokenType.IF) {
            return this.parse_conditional_expr();
        }
        else {
            console.log('abbas');
            console.log(this.at());
            return this.parse_conditional_expr();
        }
    }

    //  10 + 12
    private parse_additive_expr() {

        let left, right, operator;

        left = this.parse_primary_expr();

        while (this.at().value == '+' || this.at().value == '-' || this.at().value == '*' || this.at().value == '/') {
            operator = this.eat().value;

            right = this.parse_primary_expr();

            left = {
                kind: "BinaryExpr",
                left, operator, right
            };

        }
        return left;
    }
    // func unit (a,b){ let a=20 a=2+12 log(a)}
    private parse_function_expr() {
        let name;
        let body: Expr[] = [];
        let params = new Array<string>;

        if (this.at().type == TokenType.Func) {

            // remove KEYWORD func
            this.eat();

            name = this.eat().value;

            if (this.at().type == TokenType.OpenParen) {

                // remove openParen
                this.eat();

                // get  params
                while (this.tokens[1].value == ',' || this.at().value == ',') {

                    if (this.at().value == ',') {
                        // remove ',' charecter
                        this.eat();
                    }

                    params.push(this.eat().value);
                }

                // remove closeParen
                this.eat();
            }

            if (this.at().type == TokenType.OpenBracket) {

                // remove openBracket
                this.eat();

                while (this.at().type != TokenType.CloseBracket) {
                    body.push(this.parse_expr());
                }

                // remove closeBracket
                this.eat();
            }
        }
        else if (this.memoryFUNC.get_FUNC_VALUE(this.at().value)) {

            const body = this.memoryFUNC.get_FUNC_VALUE(this.eat().value);

            body.forEach(funcExpr => {
                valueComputing(funcExpr, this.memoryVAR, this.memoryFUNC);
            });


            // remove openParen 
            this.eat();

            // remove closeParen
            this.eat();

        }

        //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) }
        // func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }

        this.memoryFUNC.define_FUNCTION(name, body, 'func');

        // return { kind: "FunctionCaller", name, params, body } as FunctionCaller;
        return {} as Stmt;
    }

    // log('1'+'2')  log(1+2) log((2*2)+25+(32))
    private parse_log_expr() {

        let params: Array<any> = [];

        // remove KEYWORD log
        this.eat();

        if (this.at().type == TokenType.OpenParen) {

            // remove openParen
            this.eat();

            while (this.not_eof() && this.at().type != TokenType.Log && this.at().type != TokenType.Const && this.at().type != TokenType.Let && this.at().type != TokenType.CloseBracket) {

                if (this.at().type == TokenType.Func || this.at().type == TokenType.IF || this.at().type == TokenType.ELSE || this.at().type == TokenType.ElseIf) {
                    break;
                }

                if (this.memoryVAR.get(this.at().value))
                    // set varible value
                    params.push(this.memoryVAR.get(this.eat().value));
                else
                    // get second param 
                    params.push(this.eat().value);

            }

        }

        // remove closeParen  )
        params.pop();

        //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
        return { kind: "LogExpr", params } as LogExpr;
    }

    // const a=10
    // let b=20
    private parse_varible_expr() {

        let type, name, operator, value;

        // if varibleName exists a=10
        if (this.at().type == TokenType.Let || this.at().type == TokenType.Const) {
            type = this.parse_primary_expr();
        }

        name = this.eat().value;

        while (this.at().value == '=') {
            operator = this.eat().value;
            value = this.parse_additive_expr();
        }

        const varibleValue = valueComputing(value, this.memoryVAR, this.memoryFUNC);

        this.memoryVAR.defineVarible(name, varibleValue, 'string');

        return {} as Stmt;
    }


    private parse_conditional_expr() {

        let params: Array<string> = [];
        let body: Array<Expr> = [];

        // remove IF KEYWORD
        this.eat();

        // remove openParen
        this.eat();

        while (this.at().type != TokenType.CloseParen) {
            if (this.memoryVAR.get(this.at().value))
                params.push(this.memoryVAR.get(this.eat().value));
            else
                params.push(this.eat().value);
        }

        // remove closeParen
        this.eat();

        // remove openBracket
        this.eat();

        while (this.at().type != TokenType.CloseBracket) {

            // if this.at().value exist in memory update varible value
            if (this.at().type == TokenType.Let || this.at().type == TokenType.Const || this.memoryVAR.get(this.at().value))
                // update varible value
                this.parse_varible_expr();
            else
                body.push(this.parse_expr());

        }

        // remove closeBracket
        this.eat();

        let paramResult: boolean = eval(params.join(''));

        if (this.at().type == TokenType.ELSE) {

            // remove ELSE KEYWORD
            this.eat();

            // remove openBracket
            this.eat();

            // clear body for new tokens in else
            if (paramResult == false) {
                body = [];
            }

            while (this.at().type != TokenType.CloseBracket) {

                // if top condition is false
                if (paramResult == false) {
                    if (this.at().type == TokenType.Let || this.at().type == TokenType.Const || this.memoryVAR.get(this.at().value))
                        // update varible value or define varible
                        this.parse_varible_expr();

                    else
                        body.push(this.parse_expr());

                } else {
                    // remove extra tokens
                    this.eat();
                }

            }

            // remove closeBracket
            this.eat();

            if (paramResult == false)
                paramResult = true;

        }

        if (paramResult == false)
            body = [];

        return { kind: "ConditionalExpr", params, paramResult, body } as conditionalExpr;
    }

    // primaryExpr
    private parse_primary_expr(): Expr {

        const tk = this.at().type;

        // let c=a*b
        if (this.memoryVAR.get(this.at().value)) {
            return {
                kind: "NumericLiteral",
                value: parseFloat(this.memoryVAR.get(this.eat().value))
            } as NumericLiteral;
        }
        else {
            switch (tk) {
                case TokenType.Identifier:
                    return {
                        kind: "Identifire",
                        symbol: this.eat().value
                    } as Identifire;

                case TokenType.Number:
                    return {
                        kind: "NumericLiteral",
                        value: parseFloat(this.eat().value)
                    } as NumericLiteral;

                case TokenType.OpenParen:
                    this.eat();
                    return this.parse_primary_expr();

                case TokenType.CloseParen:
                    this.eat();
                    return this.parse_primary_expr();
                // KEYWORDS
                case TokenType.Let:
                    return {
                        kind: 'VaribleLiteral',
                        type: this.eat().value
                    } as VaribleLiteral;

                case TokenType.Const:
                    return {
                        kind: 'VaribleLiteral',
                        type: this.eat().value
                    } as VaribleLiteral;


                default:
                    console.error('excepting error not found token ..... : ' + this.tokens[0].value);
                    return {} as Expr;
            }
        }

    }

}
