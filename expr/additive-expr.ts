import Parser from "../parser.ts";

//  10 + 12
   export function parse_additive_expr(parser:Parser) {

        let left, right, operator;

        left = parser.parse_primary_expr();

        while (parser.at().value == '+' || parser.at().value == '-' || parser.at().value == '*' || parser.at().value == '/') {
            operator = parser.eat().value;

            right = parser.parse_primary_expr();

            left = {
                kind: "BinaryExpr",
                left, operator, right
            };

        }
        return left;
    }