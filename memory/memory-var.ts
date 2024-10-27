
export interface VarType {
    type: string,
    value: any,
}

// Varible Memory
export class MemoryVAR {

    private static instance: MemoryVAR;

    private constructor() { }

    public static getInstance(): MemoryVAR {
        if (!MemoryVAR.instance) MemoryVAR.instance = new MemoryVAR();
        return MemoryVAR.instance;
    }

    private memory: Record<string, any> = {};
    
    /**
     * def_VARIABLE to define new variable
     */
    public def_VARIABLE(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = { type: type, value: value } as VarType;
    }
    
    /**
     * get_VARIABLE_VALUE to get value of variable
     */
    public get_VARIABLE_VALUE(key: string): VarType {
        return this.memory[key];
    }
    
    /**
     * hasVariabl if varible name is exist
     */
    public hasVariable(key: string) {
        return this.memory[key];
    }

}
