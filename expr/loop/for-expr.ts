import { Stmt } from "../../ast/ast.ts";
import { TokenType } from "../../lexer/lexer.ts";
import { MemoryVAR } from "../../memory/memory-var.ts";
import Parser from "../../parser/Parser.ts";
import { parse_varible_expr } from "../varible-expr.ts";

export function parse_for_expr(parser: Parser, memoryVAR: MemoryVAR) {

    // remove for KEYWORD
    parser.eat();

    // remove CloseParen
    parser.eat();

    let conditions: Array<any> = [];

    // const start = parse_varible_expr(parser);
    parse_varible_expr(parser);

    // console.log(start);
    // remove ; character
    parser.eat();

    while (parser.at().value != ',') {
        conditions.push(parser.eat().value);
    }

    // remove ; character 
    parser.eat();


    if ((conditions[0].toString() as string).toLowerCase() != (conditions[0].toString() as string).toUpperCase()) {
        conditions[0] = memoryVAR.get_VARIABLE_VALUE(conditions[0]).value;
    }
    // console.log(conditions);
    let condition = eval(conditions.join(''));
    let Varname;
    let action;
    // const step = parser.parse_expr();

    if (parser.at().type == TokenType.Increment || parser.at().type == TokenType.Decrement) {
        action = parser.at().value;
        console.log(action);
        Varname = parser.tokens[1].value;
    }
    else if (parser.tokens[1].type == TokenType.Increment || parser.tokens[1].type == TokenType.Decrement) {
        action = parser.tokens[1].value;
        console.log(action);
        Varname = parser.at().value;
    }

    parser.parse_expr();
    // console.log(start);
    // console.log('mamam');
    // console.log(step);

    // console.log(conditions[0]);

    // remove close Paren
    parser.eat();

    let varValue = memoryVAR.get_VARIABLE_VALUE(Varname).value;

    console.log(conditions[0], condition, varValue--);
    for (conditions[0]; condition; Varname) {

        console.log(conditions[0], condition, varValue--);


        if (action == '++') {
            let varValue = memoryVAR.get_VARIABLE_VALUE(Varname).value;
            conditions[0] = varValue++;
            condition = eval(conditions.join(''));
            memoryVAR.def_VARIABLE(Varname, varValue++, 'number');
        }
        else if (action == '--') {
            let varValue = memoryVAR.get_VARIABLE_VALUE(Varname).value;
            conditions[0]=varValue--;
            condition = eval(conditions.join(''));
            console.log(varValue);
            memoryVAR.def_VARIABLE(Varname, varValue--, 'number');
        }
       /*  console.log(action);
        console.log(1); */
        // console.log(parser.tokens);


    }

    return {} as Stmt;
}
