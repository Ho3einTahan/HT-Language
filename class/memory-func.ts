
// Function Memory
export class MemoryFUNC {

    private memory: Record<string, any> = {};

    public get_FUNC_VALUE(key: string) {
        return this.memory[key];
    }

    public define_FUNCTION(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}
