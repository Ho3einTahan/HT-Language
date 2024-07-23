export type FuncType = {
    type: String,
    params: Array<any>,
    body: Array<any>,
};

// Function Memory
export class MemoryFUNC {

    private memory: Record<string, FuncType> = {};

    public get_FUNCTION_VALUE(key: string) {
        return this.memory[key];
    }
    
    public isExist(key: string) {
        return this.memory[key];
    }

    public define_FUNCTION(key: string,value: FuncType): void {
        // this.memory['fName'] = value;
        this.memory[key] = value;
    }


}
