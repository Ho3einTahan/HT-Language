import { Program } from "../ast/ast.ts";
import { HTL_LIST } from "../class/list.ts";
import { Token, TokenType, tokenize } from "../lexer/lexer.ts";
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

            // remove closeBracket
            parser.tokens.pop();

            let forEachBodies: Array<Array<Token>> = [];
            
            array.forEach((item) => {

                forEachBodies.push(parser.tokens.map((token) => {
                    const newToken={value:token.value.replace('element', item),type:token.type} as Token;
                    return newToken;
                }));

            });

            parser.tokens = forEachBodies.flat();
            // add EndOfFile token
            parser.tokens.push({ value: 'EndOfFile', type: TokenType.EOF });

            // console.log(parser.tokens);

        }

    }

}


