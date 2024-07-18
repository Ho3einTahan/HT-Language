import { Expr } from "../ast/ast.ts";
import { MemoryVAR } from "./memory-var.ts";


export type FuncType = {
    type: String,
    params: Array<any>,
    body: Array<any>,
};

// Function Memory
export class MemoryFUNC {

    private memory: Record<string, FuncType> = {};

    public get_FUNC_VALUE(key: string) {
        return this.memory[key];
    }

    public define_FUNCTION(key: string,value: FuncType): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}
