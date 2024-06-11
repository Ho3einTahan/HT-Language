import { number } from "yup";
import { Stmt, Program, NumericLiteral, Expr, Identifire, VaribleExpr, EqualExpr, VaribleLiteral, FunctionCaller, BinaryExpr, LogExpr } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";



export default class Parser {

    private tokens: Token[] = [];

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
        }

        // parse until End Of File
        while (this.not_eof()) {
            const expr = this.parse_Stmt();

            if (JSON.stringify(expr) != '{}') {
                program.body.push(expr);
            }
        }
        // (((((((((((((((((((((((((912+21+31+32+33+45+12+672+762+65+7653))))))))))))))
        return program;
    }

    private parse_Stmt(): Stmt {
        return this.parse_expr();
    }


    private parse_expr(): Expr {
        if (this.at().type == TokenType.Let || this.at().type == TokenType.Const) {
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

    private parse_function_expr() {
        let name;
        let body: Expr[] = [];
        let params = new Array<string>;

        // remove KEYWORD func
        this.eat();

        name = this.parse_primary_expr();

        if (this.at().value.startsWith('(')) {

            // remove openParen
            this.eat();

            // get first param
            params.push(this.eat().value);

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

            while (this.at().value != '}') {

                if (this.at().type == TokenType.Number) {
                    body.push(this.parse_additive_expr());
                }
                else if (this.at().type == TokenType.Let || this.at().type == TokenType.Const) {
                    body.push(this.parse_varible_expr());
                }
                else if (this.at().type == TokenType.Log) {
                    body.push(this.parse_log_expr());
                }
            }

            // remove closeBracket
            this.eat();
        }

        // func asd(a,b,c,d,e)
        // func asd(a,b,c,d,e){ let a =12  (12+12+32) }
        // func asd(a,b,c,d,e){ let a =12  12+12+3 }
        return { kind: "FunctionCaller", name, params, body } as FunctionCaller;
    }

    // log('1','2')  log('1'+'2')  log(1,2)  log(1+2)
    private parse_log_expr() {

        let params: Array<any> = [];

        // remove KEYWORD log
        this.eat();

        if (this.at().type == TokenType.OpenParen) {
            // remove openParen
            this.eat();

            const left = this.parse_primary_expr();
            // check string and number type
            params.push(left.kind == "Identifire" ? (left['symbol']) : left['value']);

            while (this.at().value == ',' || this.at().value == '+' || this.at().value == '-' || this.at().value == '*' || this.at().value == '/') {
                const operator = this.eat().value;
                params.push(operator);
                const right = this.parse_primary_expr();
                // check string and number type
                params.push(right.kind == "Identifire" ? (right['symbol']) : right['value']);
            }

            //  log('1'+'2',2+'1'+'3','1'+'2'+'3',1+2+3)
        }

        // remove closeParen
        this.eat();

        // log('1','2')
        return { kind: "LogExpr", params } as LogExpr;
    }

    private parse_varible_expr() {

        let type, name, operator, value;
        type = this.parse_primary_expr();
        name = this.eat().value;
        while (this.at().value == '=') {
            operator = this.eat().value;
            value = this.parse_additive_expr();
        }
        return { kind: 'VaribleExpr', type, name, operator, value } as VaribleExpr;
    }

    // Orders of precedence
    // AdditiveExpr
    // MultiplicitaveExpr
    // primaryExpr

    private parse_primary_expr(): Expr {

        const tk = this.at().type;

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

            // Equal
            case TokenType.Equals:
                return {
                    kind: "EqualLiteral",
                    symbol: this.eat().value
                } as EqualExpr;

            default:
                console.error('excepting error not found token ..... : ' + this.tokens[0].value);
                return {} as Stmt;
        }


    }
}