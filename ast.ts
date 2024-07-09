
export type NodeType =
    "program" |
    "NumericLiteral" |
    "Identifire" |
    "BinaryExpr" |
    // func
    "FunctionCaller" |
    // log
    "LogExpr" |
    // let && const
    "VaribleExpr" |
    "VaribleLiteral" |
    // if
    "ConditionalExpr"

export interface Stmt {
    kind: NodeType;
}


export interface Program extends Stmt {
    kind: 'program';
    body: Stmt[];
}


export interface Expr extends Stmt { }


export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string,
}


export interface Identifire extends Expr {
    kind: "Identifire";
    symbol: string;
}


export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

// Function Caller
export interface FunctionCaller extends Expr {
    kind: "FunctionCaller";
    name: Expr,
    params: Array<string>;
    body: Expr[],
}


// log() or Console.log()
export interface LogExpr extends Expr {
    kind: "LogExpr";
    params: Array<any>;
}

export interface VaribleLiteral extends Expr {
    kind: "VaribleLiteral";
    symbol: string,
}

export interface conditionalExpr extends Expr {
    kind: "ConditionalExpr";
    condition: string,
}

