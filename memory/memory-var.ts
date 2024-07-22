
// Varible Memory
export class MemoryVAR {

    private memory: Record<string, any> = {};

    public get_VARIABLE_VALUE(key: string) {
        return this.memory[key];
    }

    public define_VARIABLE(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}
