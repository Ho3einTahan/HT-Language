import { Stmt, Program, NumericLiteral, Expr, Identifire, VaribleLiteral } from "../ast/ast.ts";
import { tokenize, Token, TokenType } from "../lexer/lexer.ts";
import { MemoryFUNC } from "../memory/memory-func.ts";
import { parse_additive_expr } from "../expr/additive-expr.ts";
import { parse_function_expr } from "../expr/func-expr.ts";
import { parse_log_expr } from "../expr/log-expr.ts";
import { parse_conditional_expr } from "../expr/conditional-expr.ts";
import { parse_varible_expr } from "../expr/varible-expr.ts";
import { MemoryVAR } from "../memory/memory-var.ts";
import { parse_list_expr } from "../expr/list-expr.ts";
import { MemoryList } from "../memory/memory-list.ts";
import { parse_preIncrement_decrement_expr } from "../expr/pre-increment-decrement-expr.ts";
import { parse_postIncrement_decrement_expr } from "../expr/post-increment-decrement-expr.ts";


export default class Parser {
    public tokens: Token[] = [];

    public memoryVAR = MemoryVAR.getInstance();

    public memoryFUNC = MemoryFUNC.getInstance();

    public memoryLIST = MemoryList.getInstance();

    public not_eof(): boolean {
        return this.tokens[0]?.type !== undefined && this.tokens[0].type !== TokenType.EOF;
    }

    public at(): Token {
        if (this.tokens.length === 0) {
            throw new Error('Unexpected end of input');
        }
        return this.tokens[0];
    }

    public eat(): Token {
        if (this.tokens.length === 0) {
            throw new Error('Unexpected end of input');
        }
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


    public parse_expr(): Expr {
        console.log(this.tokens);
        if (!this.tokens.length) throw new Error('Unexpected end of input');

        // variable
        if (this.at().type == TokenType.Let || this.at().type == TokenType.Const || this.memoryVAR.hasVariable(this.at().value)) {
            return parse_varible_expr(this);
        }
        // list
        else if (this.at().type == TokenType.List || this.memoryLIST.hasList(this.at().value)) {
            return parse_list_expr(this);
        }
        // numeric
        else if (this.at().type == TokenType.Number || this.at().value == '(') {
            return parse_additive_expr(this);
        }
        // pre operator
        else if (this.at().type == TokenType.PreIncrement || this.at().type == TokenType.PreDecrement || this.at().type == TokenType.Exponentiation) {
            return parse_preIncrement_decrement_expr(this);
        }
        // post Operator
        else if (this.tokens[1].type == TokenType.postIncrement || this.tokens[1].type == TokenType.postDecrement) {
            return parse_postIncrement_decrement_expr(this);
        }
        // function
        else if (this.at().type == TokenType.Func || this.memoryFUNC.hasFunction(this.at().value)) {
            return parse_function_expr(this);
        }
        // log
        else if (this.at().type == TokenType.Log) {
            return parse_log_expr(this);
        }
        // if
        else if (this.at().type == TokenType.IF) {
            return parse_conditional_expr(this);
        }
        else {
            console.log(this.at());
            console.log(this.at().value);
            throw new Error(`Unexpected token: ${this.at().type}`);
        }
    }


    // primaryExpr
    public parse_primary_expr(): Expr {

        const tk = this.at().type;

        if (this.memoryVAR.hasVariable(this.at().value))
            return { kind: "NumericLiteral", value: parseFloat(this.memoryVAR.get_VALUE_OF_VARIABLE(this.eat().value).value) } as NumericLiteral;

        else {

            switch (tk) {
                case TokenType.Identifier:
                    return { kind: "Identifire", symbol: this.eat().value } as Identifire;

                case TokenType.Number:
                    return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;


                case TokenType.OpenParen:

                    // remove openParen
                    this.eat();

                    const expr = this.parse_expr();

                    if (this.at().type === TokenType.CloseParen) {
                        // remove closeParen
                        this.eat();
                    } else {
                        throw new Error('Expected closing parenthesis');
                    }

                    return expr;

                case TokenType.Let:
                case TokenType.Const:
                case TokenType.String:
                case TokenType.Int:
                case TokenType.Bool:
                    return { kind: 'VaribleLiteral', type: this.eat().value } as VaribleLiteral;

                default:
                    throw new Error(`Unexpected token: ${this.tokens[0].value}`);
            }

        }

    }

}
