import Parser from "./parser.ts";
import { Program, BinaryExpr, Identifire, NumericLiteral, Expr, VaribleExpr, FunctionCaller, LogExpr } from "./ast.ts"; import { string } from "yup";
"./ast.ts";


repl();


async function repl() {

    console.log('repl v0.1');
    const parser = new Parser();

    while (true) {

        const input = prompt("");
        // check for no user input o    r exit keyword
        if (!input || input.includes("exit")) {
            console.log('byby');
        }

        const program = parser.produceAST(input!);

        function valueComputing(ast: Expr) {
            if (ast.kind == 'NumericLiteral') {
                const NumericAST = ast as NumericLiteral;
                return NumericAST.value;
            } else if (ast.kind === 'BinaryExpr') {
                const BinaryAST = ast as BinaryExpr;

                const left = valueComputing(BinaryAST.left);
                const right = valueComputing(BinaryAST.right);

                switch (BinaryAST.operator) {
                    case '+':
                        return left + right;
                    case '-':
                        return left - right;
                    case '*':
                        return left * right;
                    case '/':
                        return left / right;
                    default:
                        break;
                }

            }
            else if (ast.kind == 'VaribleExpr') {
                const varibleExpr = ast as VaribleExpr;
                return valueComputing(varibleExpr.value);
            }
            else if (ast.kind == "LogExpr") {

                const logExpr = ast as LogExpr;
                let params = logExpr.params;

                // console.log(1+2,'1'+2,'1'+'2',1,2,'1','2');
                // console.log(result);
                //  log('1'+'2',2+'1'+'3','1'+'2'+'3',1+2+3)
                // console.log(params);
                console.log(eval('(2+2)*2'));
                // console.log((1+2)*(25)+'3'+'4'+'5'+4+5+9+12+'3'+'2'+'d');
                // console.log(1+2+'1'+'2'+'3'+'4'+'5'+2+2+2+(3-3));
                return eval(params.join(''));
            }
            else if (ast.kind == 'FunctionCaller') {
                let result: Array<any> = [];
                const FunctionCallerAst = ast as FunctionCaller;
                FunctionCallerAst.body.forEach(expr => {
                    result.push(valueComputing(expr));
                });
                //  func asd(a,b){ let a=12+11 12+13 log('1'+'2',12+13,'1'+15,12+14+15)}
                return result.join(' ');
            }
        }

        const programAST = program.body[0];
        const result = valueComputing(programAST);
        console.log(result);
    }

}

// {
//     kind: "program",
//     body: [
//       {
//         kind: "BinaryExpr",
//         left: {
//           kind: "BinaryExpr",
//           left: {
//             kind: "BinaryExpr",
//             left: [Object],
//             operator: "+",
//             right: [Object]
//           },
//           operator: "+",
//           right: { kind: "NumericLiteral", value: 15 }
//         },
//         operator: "+",
//         right: { kind: "NumericLiteral", value: 16 }
//       }
//     ]
//   }
