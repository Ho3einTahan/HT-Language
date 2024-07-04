import { Expr, VaribleExpr } from "../ast.ts";


export function filterVname(data: Expr[]): Expr[] {
    // Varible Map
    const vMap = new Map<string, Expr>();

    data.forEach(expr => {
        if (expr.kind === "VaribleExpr") {
            const varibleExpr = expr as VaribleExpr;
            vMap.set(varibleExpr.name, expr);
        }
    });

    for (let i = 0; i < data.length; i++) {
        if (data[i].kind == "VaribleExpr") {
            const varibleExpr = data[i] as VaribleExpr;
            if (data[i] != vMap.get(varibleExpr.name)) {
                delete data[i];
            }

        }
    }
    return data;
}