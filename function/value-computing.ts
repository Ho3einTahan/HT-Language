import { Memory } from "../parser.ts";
import { BinaryExpr, NumericLiteral, Expr, FunctionCaller, LogExpr, Identifire } from "../ast.ts";



export function valueComputing(ast: Expr,memory:Memory) {

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

        const left = valueComputing(BinaryAST.left,memory);
        const right = valueComputing(BinaryAST.right,memory);

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
    else if (ast.kind == "LogExpr") {

        const logExpr = ast as LogExpr;
        let params = logExpr.params;
   
        for (let i = 0; i < params.length; i++) {
            const str = params[i] as string;

            if (memory.get(str)) {
                // set value
                params[i] = memory.get(str);
            }
        }
        return eval(params.join(''));
    }
    else if (ast.kind == 'FunctionCaller') {

        let result: Array<any> = [];
        const FunctionCallerAst = ast as FunctionCaller;

        FunctionCallerAst.body.forEach(expr => {
            result.push(valueComputing(expr,memory));
        });

        //  func asd(a,b){ let a=12+11 12+13 log('1'+'2',12+13,'1'+15,12+14+15)}
        return result.join(' ');
    }
}