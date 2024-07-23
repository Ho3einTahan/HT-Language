
// Enum Memory
export class MemoryENUM {

    private memory: Record<string, any> = {};

    public get_ENUM_VALUE(key: string) {
        return this.memory[key];
    }

    public define_ENUM(key: string, value: any, type: string): void {
        // this.memory['vName'] = value;
        this.memory[key] = value;
    }


}
