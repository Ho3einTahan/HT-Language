import { MemoryVAR } from "../class/memory-var.ts";
import { BinaryExpr, NumericLiteral, Expr, FunctionCaller, LogExpr, Identifire, conditionalExpr } from "../ast.ts";

export function valueComputing(ast: Expr, memory: MemoryVAR) {

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

        const left = valueComputing(BinaryAST.left, memory);
        const right = valueComputing(BinaryAST.right, memory);

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

        console.log(eval(params.join('')));

        return {};
    }
    else if (ast.kind == "ConditionalExpr") {
        let result: Array<Expr> = [];

        const conditionalAst = ast as conditionalExpr;

        conditionalAst.body.forEach(conditional => {

            const valueCompute = valueComputing(conditional, memory);

            if (JSON.stringify(valueCompute) != '{}')
                result.push(valueCompute);

        });

        // let a=12 let b=16  if(a>b || b==15){log(a)} log(b)
        // let a=12 let b=16  if(a>b || b==15){a=15} else { a=20 log(2*2) let a=12 let b=16  if(a>b || b==15){a=15} else { a=20 log(2*2)} log(a) } log(a)

        return {};
    }
    else if (ast.kind == 'FunctionCaller') {
        let result: Array<any> = [];

        const FunctionCallerAst = ast as FunctionCaller;

        FunctionCallerAst.body.forEach(expr => {
            result.push(valueComputing(expr, memory));
        });

        //  func asd(a,b){ let a=12+11 12+13 log('1'+'2',12+13,'1'+15,12+14+15)}
        return result.join(' ');
    }
}