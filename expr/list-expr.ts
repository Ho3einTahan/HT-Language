import { Expr } from "../ast/ast.ts";
import { TokenType } from "../lexer/lexer.ts";
import Parser from "../parser.ts";
import { ListType } from "../memory/memory-list.ts";


export function parse_list_expr(parser: Parser): Expr {

    let name, type: String = '';

    let body_String: Array<String> = [];
    let body_Bool: Array<boolean> = [];
    let body_Int: Array<number> = [];
    //
    let bodyList_OF_ListString: Array<Array<String>> = [];
    let bodyList_OF_ListBool: Array<Array<Boolean>> = [];
    let bodyList_OF_ListInt: Array<Array<number>> = [];


    // if we had a type
    while (parser.at().value == ':' || parser.at().type == TokenType.List) {
        if (parser.at().value == ':') {
            // remove : charecter
            parser.eat();
        }

        // get type
        type += parser.eat().value;

    }


    // remove name of List
    name= parser.eat().value;

    // remove = charecter
    parser.eat();

    // [ => openBrack
    // remove openBrack
    parser.eat();

    // ] => closeBrack
    while (parser.at().type != TokenType.closeBrack) {

        switch (type) {
            case 'listint':
                if (parser.at().type == TokenType.Number)
                    body_Int.push(parseInt(parser.eat().value));
                else
                    throw Error('Pleas Enter Int type to the ====> LIST ');
                break;

            case 'liststring':
                if (parser.at().type == TokenType.Identifier)
                    body_String.push(parser.eat().value);
                else
                    throw Error('Pleas Enter String type to the ====> LIST ');
                break;

            case 'listbool':
                if (parser.at().type == TokenType.True || parser.at().type == TokenType.False)
                    body_Bool.push(stringToBool(parser.eat().value));
                else
                    throw Error('Pleas Enter Bool type to the ====> LIST ');
                break;

            case 'listlistint':
                if (parser.at().type == TokenType.List) {

                    // remove openBrack
                    parser.eat();

                    let body: Array<number> = [];

                    while (true) {

                        while (parser.at().type != TokenType.closeBrack) {
                            body.push(parseInt(parser.eat().value));
                        }

                        // remove closeBrack
                        // ] => closeBrack
                        parser.eat();

                        bodyList_OF_ListInt.push(body);
                        body = [];

                        if (parser.at().type == TokenType.closeBrack) break;

                    }


                }
                else
                    throw Error('Pleas Enter List OF List:Int ');
                break;

            case 'listliststring':

                if (parser.at().type == TokenType.List) {

                    // remove openBrack
                    parser.eat();

                    let body: Array<String> = [];

                    while (true) {

                        while (parser.at().type != TokenType.closeBrack) {
                            body.push(parser.eat().value);
                        }

                        // remove closeBrack
                        // ] => closeBrack
                        parser.eat();

                        bodyList_OF_ListString.push(body);
                        body = [];

                        if (parser.at().type == TokenType.closeBrack) break;

                    }


                }
                else
                    throw Error('Pleas Enter List OF List:String ');
                break;

            case 'listlistbool':

                if (parser.at().type == TokenType.List) {

                    // remove openBrack
                    parser.eat();

                    let body: Array<boolean> = [];

                    while (true) {

                        while (parser.at().type != TokenType.closeBrack) {
                            body.push(stringToBool(parser.eat().value));
                        }

                        // remove closeBrack
                        // ] => closeBrack
                        parser.eat();

                        bodyList_OF_ListBool.push(body);
                        body = [];

                        if (parser.at().type == TokenType.closeBrack) break;

                    }


                }
                else
                    throw Error('Pleas Enter List OF List:bool ');
                break;

            default:
                console.log('default ====>>>>>>>>>>>>>>. erererererere ');
                break;
        }

    }


    // remove closeBrack
    parser.eat();

    if (body_Int.length > 0) {

        parser.memoryLIST.define_LIST(name, { type, body: body_Int } as ListType);
        console.log(name, { type, body: body_Int } as ListType);
    }
    else if (body_String.length > 0) {
        parser.memoryLIST.define_LIST(name, { type, body: body_String } as ListType);
        console.log(name, { type, body: body_String } as ListType);
    }
    else if (body_Bool.length > 0) {
        parser.memoryLIST.define_LIST(name, { type, body: body_Bool } as ListType);
        console.log(name, { type, body: body_Bool } as ListType);
    }
    else if (bodyList_OF_ListInt.length > 0) {
        parser.memoryLIST.define_LIST(name, { type, body: bodyList_OF_ListInt } as ListType);
        console.log(name, { type, body: bodyList_OF_ListInt } as ListType);
    }
    else if (bodyList_OF_ListString.length > 0) {
        parser.memoryLIST.define_LIST(name, { type, body: bodyList_OF_ListString } as ListType);
        console.log(name, { type, body: bodyList_OF_ListString } as ListType);

    }
    else if (bodyList_OF_ListBool.length > 0) {
        parser.memoryLIST.define_LIST(name, { type, body: bodyList_OF_ListBool } as ListType);
        console.log(name, { type, body: bodyList_OF_ListBool } as ListType);
    }
    return {} as Expr;

}


function stringToBool(str: string): boolean {
    return str.toLowerCase() == "true";
}