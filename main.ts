import { Memory } from "./parser.ts";
import Parser from "./parser.ts";
import { BinaryExpr, NumericLiteral, Expr, VaribleExpr, FunctionCaller, LogExpr, Identifire } from "./ast.ts";
import { filterVname } from "./function/filter-vName.ts";


repl();



async function repl() {

    console.log('repl v0.1');

    const parser = new Parser();

    const memory = parser.memory;

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
            }
            else if (ast.kind == "Identifire") {
                const IdentifierAST = ast as Identifire;
                return IdentifierAST.symbol;
            }
            else if (ast.kind === 'BinaryExpr') {
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
                const varibleResult = valueComputing(varibleExpr.value);

                // memory.updateValue(varibleExpr.name, varibleResult, 'string');

                return varibleResult;
            }
            else if (ast.kind == "LogExpr") {

                const logExpr = ast as LogExpr;
                let params = logExpr.params;
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



        function removeDuplicateDeclarations(arr: Expr[]) {
            return arr.filter(item => {
                if (item.kind == "VaribleExpr") {
                    const varibleAST = item as VaribleExpr;
                    if (memory.get(varibleAST.name) && varibleAST.type != undefined) {
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            });
        }





        const filteredVname = filterVname(program.body);

        filteredVname.forEach(programAST => {
            const result = valueComputing(programAST);
            console.log(result);
        });

    }

}