import { Program } from "../ast/ast.ts";
import { HTL_LIST } from "../HTL/htl-list.ts";
import { Token, TokenType, tokenize } from "../lexer/lexer.ts";
import Parser from "../parser.ts";

export class ListParser {

    static parse(parser: Parser, array: Array<any>, arrayType: string) {

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

            return htlList.getIndex(content, arrayType);

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
                    const newToken = { value: token.value.replace(itemName, item), type: token.type } as Token;
                    return newToken;
                }));

            });

            parser.tokens = forEachBodies.flat();
            // add EndOfFile token
            parser.tokens.push({ value: 'EndOfFile', type: TokenType.EOF });

            // console.log(parser.tokens);

        }

        if (parser.at().value == 'lstItem') {

            // remove list's methode
            parser.eat();
            // remove openParen
            parser.eat();
            // remove closeParen
            parser.eat();

            return htlList.lstItem();

        }

        if (parser.at().value == 'fstItem') {

            // remove list's methode
            parser.eat();
            // remove openParen
            parser.eat();
            // remove closeParen
            parser.eat();

            return htlList.fstItem();

        }

        if (parser.at().value == 'removeAt') {

            // remove list's methode
            parser.eat();
            // remove openParen
            parser.eat();

            const index = parser.eat().value;

            // remove closeParen
            parser.eat();

            return htlList.removeAt(parseInt(index));

        }

        if (parser.at().value == 'add') {

            let params: Array<any> = [];

            // remove list's methode
            parser.eat();

            // remove openParen
            parser.eat();

            while (parser.at().type != TokenType.CloseParen) {
                if (parser.at().value == ',') parser.eat();
                params.push(parser.eat().value);
            }

            // remove closeParen
            parser.eat();

            return htlList.add(params);

        }

    }

}


