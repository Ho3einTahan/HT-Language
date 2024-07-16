
// Varible Memory
export class MemoryVAR {

    private memory: Record<string, any> = {};

    public get(key: string) {
        return this.memory[key];
    }

    public defineVarible(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}
