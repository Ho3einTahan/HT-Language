import { MemoryVAR } from "../memory/memory-var.ts";
import { BinaryExpr, NumericLiteral, Expr, LogExpr, Identifire, conditionalExpr } from "../ast/ast.ts";
import { MemoryFUNC } from "../memory/memory-func.ts";
import { MemoryList } from "../memory/memory-list.ts";

export function valueComputing(ast: Expr, memoryVAR: MemoryVAR, memoryFUNC: MemoryFUNC, memoryLIST: MemoryList) {

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

        const left = valueComputing(BinaryAST.left, memoryVAR, memoryFUNC, memoryLIST);
        const right = valueComputing(BinaryAST.right, memoryVAR, memoryFUNC, memoryLIST);

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
        const conditionalAst = ast as conditionalExpr;

        conditionalAst.body.forEach(conditionalExpr => {

            const valueCompute = valueComputing(conditionalExpr, memoryVAR, memoryFUNC, memoryLIST);

            if (JSON.stringify(valueCompute) != '{}' && valueCompute != undefined)
                console.log(valueCompute);

        });

        // let a=12 let b=16  if(a>b || b==15){log(a)} log(b)
        // let a=12 let b=16  if(a>b || b==15){a=15} else { a=20 log(2*2) let a=12 let b=16  if(a>b || b==15){a=15} else { a=20 log(2*2)} log(a) } log(a)

        return {};
    }
}