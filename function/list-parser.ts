import { Program } from "../ast/ast.ts";
import { HTL_LIST } from "../class/list.ts";
import { Token, TokenType } from "../lexer/lexer.ts";
import { ListType } from "../memory/memory-list.ts";
import Parser from "../parser.ts";

export class ListParser {

    static parse(parser: Parser, array: Array<any>) {

        const htlList = new HTL_LIST(array);

        if (parser.at().value == 'at') {

            // remove at KEYWORD
            parser.eat();

            // remove openParen
            parser.eat();

            // get index param
            const index = parseInt(parser.eat().value);

            // remove closeParen
            parser.eat();

            return htlList.at(array, index);

        }


        if (parser.at().value == 'getIndex') {

            // remove indexOf KEYWORD
            parser.eat();

            // remove openParen
            parser.eat();

            // get param
            const content = parser.eat().value;

            // remove closeParen
            parser.eat();

            return htlList.getIndex(content);

        }


        if (parser.at().value == 'for') {

            // remove for KEYWORD
            parser.eat();

            // remove =  character
            parser.eat();

            // get name of item that user defined
            const itemName = parser.eat().value;

            // remove = character
            parser.eat();

            // remove > character
            parser.eat();

            // remove openBracket
            parser.eat();

            // remove EndOfFile token
            parser.tokens.pop();

            if (parser.at().type == TokenType.Log) {

                let parens: Array<any> = [];

                let logParams: Array<string> = [];

                // remove log KEYWORD
                parser.eat();

                // remove  openParen
                parser.eat();

                while (parser.at().type != TokenType.CloseParen || parens.length > 0) {

                    if (parser.at().value == '(') {
                        parens.push(parser.at().value);
                    }

                    if (parser.at().value == ')') {
                        parens.pop();
                    }

                    if (parser.at().value == ',') {
                        // remove , character
                        parser.eat();
                    }

                    logParams.push(parser.eat().value);

                }

                // remove  closeParen
                parser.eat();

                array.forEach((arr) => {
                    parser.tokens.push({ value: 'log', type: TokenType.Log } as Token);
                    parser.tokens.push({ value: '(', type: TokenType.OpenParen });
                    parser.tokens.push({ value: logParams.join('').replace(itemName, arr), type: TokenType.Identifier } as Token);
                    parser.tokens.push({ value: ')', type: TokenType.CloseParen });

                });


            }

            // add EndOfFile token
            parser.tokens.push({ value: 'EndOfFile', type: TokenType.EOF });

            // remove closeBracket
            parser.eat();

        }

    }

}


