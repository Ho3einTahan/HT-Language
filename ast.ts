
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
    // =
    "EqualLiteral";


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


// Varible Deceleration
export interface VaribleExpr extends Expr {
    kind: "VaribleExpr";
    type: Expr,
    name: string,
    operator: string;
    value: Expr,
}


export interface VaribleLiteral extends Expr {
    kind: "VaribleLiteral";
    symbol: string,
}

export interface EqualExpr extends Expr {
    kind: "EqualLiteral";
    symbol: string,
}

