import { Expr } from "../ast/ast.ts";
import { TokenType } from "../lexer/lexer.ts";
import Parser from "../parser.ts";
import { ListType } from "../memory/memory-list.ts";


export function parse_list_expr(parser: Parser): Expr {

    let name, type: String = '';

    let bodyList: Array<any> = [];

    while (parser.at().value == ':' || parser.at().type == TokenType.List) {

        // remove : character
        if (parser.at().value == ':') parser.eat();

        // get type
        type += parser.eat().value;

    }


    // get name of List
    name = parser.eat().value;

    // remove = character
    parser.eat();

    // ] => closeBrack
    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.Log && parser.at().type != TokenType.Func) {

        switch (type) {

            case 'listint':

                // [ => openBrack
                // add openBrack to List
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);

                // add , character
                if (parser.at().value == ',') bodyList.push(parser.eat().value);

                if (parser.at().type == TokenType.Number) bodyList.push(parseInt(parser.eat().value));

                else {
                    throw Error('Pleas Enter Int type to the ====> LIST ');
                }

                break;

            case 'liststring':

                // [ => openBrack
                // add openBrack to List
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);


                // add , character
                if (parser.at().value == ',') bodyList.push(parser.eat().value);

                // remove '' character At Start AND End OF Token
                if (parser.at().type == TokenType.Identifier) bodyList.push(parser.eat().value.slice(1, -1));

                else {
                    throw Error('Pleas Enter String type to the ====> LIST ');
                }

                break;

            case 'listbool':

                // [ => openBrack
                // add openBrack to List
                if (parser.at().type == TokenType.openBrack) bodyList.push(parser.eat().value);


                // add , character
                if (parser.at().value == ',') bodyList.push(parser.eat().value);


                if (parser.at().type == TokenType.True || parser.at().type == TokenType.False) bodyList.push(stringToBool(parser.eat().value));

                else {
                    throw Error('Pleas Enter Bool type to the ====> LIST ');
                }

                break;

            case 'listlistint':

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                else {
                    throw Error('Pleas Enter List OF List:Int ');
                }

                if (parser.at().type == TokenType.Number) {

                    let body: Array<any> = [];

                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {

                        if (parser.at().value == ',') parser.eat();

                        // remove '' character At Start AND End OF Token
                        if (parser.at().type == TokenType.Number) body.push(parseInt(parser.eat().value));
                        else {
                            throw Error('Pleas Enter List OF List:Int ');
                        }

                    }

                    bodyList.push(body);

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                }
                else {
                    throw Error('Pleas Enter List OF List:Int ');
                }

                break;

            case 'listliststring':

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                else {
                    throw Error('Pleas Enter List OF List:String ');
                }

                if (parser.at().type == TokenType.Identifier) {

                    let body: Array<any> = [];

                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {

                        if (parser.at().value == ',') parser.eat();

                        // remove '' character At Start AND End OF Token
                        body.push(parser.eat().value.slice(1, -1));

                    }

                    bodyList.push(body);

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                }

                else {
                    throw Error('Pleas Enter List OF List:String ');
                }

                break;

            case 'listlistbool':

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                // remove openBrack
                if (parser.at().type == TokenType.openBrack || parser.at().value == ',') parser.eat();

                else {
                    throw Error('Pleas Enter List OF List:Bool ');
                }


                if (parser.at().type == TokenType.True || parser.at().type == TokenType.False) {

                    let body: Array<any> = [];

                    while (parser.at().type != TokenType.closeBrack && parser.at().type != TokenType.openBrack) {

                        if (parser.at().value == ',') parser.eat();

                        // remove '' character At Start AND End OF Token
                        body.push(stringToBool(parser.eat().value));

                    }

                    bodyList.push(body);

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                    if (parser.at().type == TokenType.closeBrack) parser.eat();

                }

                else {
                    throw Error('Pleas Enter List OF List:bool ');
                }

                break;

            default:
                console.log('default ====>>>>>>>>>>>>>>. erererererere ');
                break;
        }


    }


    if (bodyList.length > 0) {

        // add closeBrack to List
        if (parser.at().type == TokenType.closeBrack) bodyList.push(parser.eat().value)

        parser.memoryLIST.define_LIST(name, { type, body: bodyList } as ListType);

    }


    return {} as Expr;

}


function stringToBool(str: string): boolean {
    return str.toLowerCase() == "true";
}