
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

    public define_VARIABLE(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = { type: type, value: value } as VarType;
    }

    public get_VALUE_OF_VARIABLE(key: string):VarType {
        return this.memory[key];
    }

    public hasVariable(key: string) {
        return this.memory[key];
    }

}
