import { Stmt, Program, NumericLiteral, Expr, Identifire, VaribleLiteral, FunctionCaller, LogExpr } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";
import { valueComputing } from "./function/value-computing.ts";


// Varible Memory
export class Memory {

    private memory: Record<string, any> = {};

    public get(key: string) {
        return this.memory[key];
    }

    public defineVarible(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}


export default class Parser {

    private tokens: Token[] = [];

    public memory = new Memory();

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
        if (this.at().type == TokenType.Let || this.at().type == TokenType.Const || this.memory.get(this.at().value)) {
            return this.parse_varible_expr();
        }
        else if (this.at().type == TokenType.Number) {
            return this.parse_additive_expr();
        }
        else if (this.at().type == TokenType.Func) {
            return this.parse_function_expr();
        }
        else if (this.at().type == TokenType.Log) {
            return this.parse_log_expr();
        }
        else {
            return this.parse_function_expr();
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
        const memory = new Memory();
        // remove KEYWORD func
        this.eat();

        name = this.parse_primary_expr();

        if (this.at().value.startsWith('(')) {

            // remove openParen
            this.eat();

            // get first param
            params.push(this.eat().value);

            // get second param
            while (this.at().value == ',') {
                // remove ',' charecter
                this.eat();

                params.push(this.eat().value);
            }

            // remove closeParen
            this.eat();
        }
        if (this.at().value.startsWith('{')) {

            // remove openBracket
            this.eat();

            while (this.not_eof()) {

                if (this.at().type == TokenType.Number) {
                    body.push(this.parse_additive_expr());
                }
                else if (this.at().type == TokenType.Let || this.at().type == TokenType.Const) {
                    body.push(this.parse_varible_expr());
                }
                else if (this.at().type == TokenType.Log) {
                    body.push(this.parse_log_expr());
                }
                else if (this.at().type == TokenType.Func) {
                    body.push(this.parse_function_expr());
                }
                else {
                    body.push(this.parse_function_expr());
                }
            }

            // remove closeBracket
            this.eat();
        }

        //  func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) }
        // func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
        return { kind: "FunctionCaller", name, params, body } as FunctionCaller;
    }

    // log('1'+'2')  log(1+2) log((2*2)+25+(32))
    private parse_log_expr() {

        let params: Array<any> = [];

        // remove KEYWORD log
        this.eat();

        if (this.at().type == TokenType.OpenParen) {

            // remove openParen
            this.eat();
            // func asd(a,b){ let a=12+11 12+13 log((12+12)*2+5+(3+5)) log(10+15) log(2*2*(5+4)) }
            while (this.not_eof() && this.at().type != TokenType.Log && this.at().type != TokenType.Const && this.at().type != TokenType.Let && this.at().type != TokenType.CloseBracket) {

                if (this.at().type == TokenType.Func) {
                    break;
                }
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

        const varibleValue = valueComputing(value,this.memory);

        this.memory.defineVarible(name, varibleValue, 'string');

        return {} as Stmt;
    }
  
   
    private parse_conditional_expr(){
        
        let params:Array<string>=[];

        // remove IF KEYWORD
        this.eat();
        
        // remove openParen
        this.eat();

        while (this.at().type!=TokenType.CloseParen) {
            
            params.push(this.eat().value);

        }

        // remove closeParen
        this.eat();

    }

    // primaryExpr
    private parse_primary_expr(): Expr {

        const tk = this.at().type;
        
        // let c=a*b
        if (this.memory.get(this.at().value)) {
            return {
                kind: "NumericLiteral",
                value: parseFloat(this.memory.get(this.eat().value))
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
                        symbol: this.eat().value
                    } as VaribleLiteral;

                case TokenType.Const:
                    return {
                        kind: 'VaribleLiteral',
                        symbol: this.eat().value
                    } as VaribleLiteral;


                default:
                    console.error('excepting error not found token ..... : ' + this.tokens[0].value);
                    return {} as Expr;
            }
        }

    }

}
