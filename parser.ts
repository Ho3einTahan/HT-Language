import { Stmt, Program, BinaryExpr, NumericLiteral, Expr, Identifire } from "./ast.ts";
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
            program.body.push(this.parse_Stmt());
        }
        return program;
    }

    private parse_Stmt(): Stmt {
        return this.parse_expr();
    }


    private parse_expr(): Expr {
        return this.parse_additive_paren_expr();
    }

    //  10 + 12
    private parse_additive_paren_expr() {

        let left, right, operator;

      /*   while (this.at().value == '(' || this.at().value == ')') {
            if (this.at().value == '(') {
                this.eat();
            }
            else if (this.at().value == ')') {
                this.eat();
                break;
            } */


            left = this.parse_primary_expr();
            while (this.at().value == '+' || this.at().value == '-' || this.at().value == '*' || this.at().value == '/') {
                operator = this.eat().value;
                right = this.parse_primary_expr();
            }
        // }
        const binaryExpr = { kind: 'BinaryExpr',left,operator,right } as BinaryExpr;
        return binaryExpr;
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

            default:
                console.error('excepting error not found token ..... : ' + this.tokens[0].value);
                return {} as Stmt;
        }


    }
}