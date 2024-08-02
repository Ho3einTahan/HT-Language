export type FuncType = {
    type: String,
    params: Array<any>,
    body: Array<any>,
};

// Function Memory
export class MemoryFUNC {

    private static instance: MemoryFUNC;

    private constructor() { }

    public static getInstance(): MemoryFUNC {

        if (!MemoryFUNC.instance) MemoryFUNC.instance = new MemoryFUNC();

        return MemoryFUNC.instance;

    }

    private memory: Record<string, FuncType> = {};

    public get_VALUE_OF_FUNCTION_(key: string) {
        return this.memory[key];
    }

    public hasFunction(key: string) {
        return this.memory[key];
    }

    public define_FUNCTION(key: string, value: FuncType): void {
        // this.memory['fName'] = value;
        this.memory[key] = value;
    }


}
