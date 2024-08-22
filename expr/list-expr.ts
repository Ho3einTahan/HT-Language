import { Expr } from "../ast/ast.ts";
import { TokenType } from "../lexer/lexer.ts";
import Parser from "../parser/Parser.ts";
import { ListType } from "../memory/memory-list.ts";
import { ListParser } from "../function/list-parser.ts";
import { stringToBool } from "../function/string-to-bool.ts";

export function parse_list_expr(parser: Parser): Expr {
    let listType: string = '';
    let listName: string = '';
    let bodyList: Array<any> = [];

    while (parser.at().value == ':' || parser.at().type == TokenType.List) {
        // remove : character
        if (parser.at().value == ':') parser.eat();

        // get type
        listType += parser.eat().value;
    }

    // get name of List
    listName = parser.eat().value;

    // remove = character
    parser.eat();

    // ] => closeBrack
    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.Log && parser.at().type != TokenType.Func && !parser.memoryLIST.hasList(listName)) {
        switch (listType) {
            case 'listint':
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);
                if (parser.at().value == ',') bodyList.push(parser.eat().value);
                if (parser.at().type == TokenType.Number) bodyList.push(parseInt(parser.eat().value));
                else throw Error('Please Enter Int type to the ====> LIST ');
                break;

            case 'liststring':
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);
                if (parser.at().value == ',') bodyList.push(parser.eat().value);
                if (parser.at().type == TokenType.Identifier) bodyList.push(`"${parser.eat().value.slice(1, -1)}"`);
                else throw Error('Please Enter String type to the ====> LIST ');
                break;

            case 'listbool':
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);
                if (parser.at().value == ',') bodyList.push(parser.eat().value);
                if (parser.at().type == TokenType.True || parser.at().type == TokenType.False) bodyList.push(stringToBool(parser.eat().value));
                else throw Error('Please Enter Bool type to the ====> LIST ');
                break;

            case 'listlistint':
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                else throw Error('Please Enter List OF List:Int ');

                if (parser.at().type == TokenType.Number) {
                    let body: Array<any> = [];
                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {
                        if (parser.at().value == ',') parser.eat();
                        if (parser.at().type == TokenType.Number) body.push(parseInt(parser.eat().value));
                        else throw Error('Please Enter List OF List:Int ');
                    }
                    bodyList.push(body);
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                } else throw Error('Please Enter List OF List:Int ');
                break;

            case 'listliststring':
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                else throw Error('Please Enter List OF List:String ');

                if (parser.at().type == TokenType.Identifier) {
                    let body: Array<any> = [];
                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {
                        if (parser.at().value == ',') parser.eat();
                        body.push(`"${parser.eat().value.slice(1, -1)}"`);
                    }
                    bodyList.push(body);
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                } else throw Error('Please Enter List OF List:String ');
                break;

            case 'listlistbool':
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();
                else throw Error('Please Enter List OF List:Bool ');

                if (parser.at().type == TokenType.True || parser.at().type == TokenType.False) {
                    let body: Array<any> = [];
                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {
                        if (parser.at().value == ',') parser.eat();
                        body.push(stringToBool(parser.eat().value));
                    }
                    bodyList.push(body);
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                    if (parser.at().type == TokenType.closeBrack) parser.eat();
                } else throw Error('Please Enter List OF List:Bool ');
                break;

            default:
                console.log('default ====>>>>>>>>>>>>>>. erererererere ');
                break;
        }
    }


        if (parser.at().type == TokenType.closeBrack) bodyList.push(parser.eat().value);

        const jsonString = bodyList.join('');

        let body: Array<any>=eval(jsonString);

        parser.memoryLIST.define_LIST(listName, { type: listType, body } as ListType);

    return {} as Expr;
}
