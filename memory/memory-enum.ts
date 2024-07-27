
// Enum Memory
export class MemoryENUM {

    private static instance: MemoryENUM;

    private constructor() { }

    public static getInstance(): MemoryENUM {

        if (!MemoryENUM.instance) MemoryENUM.instance = new MemoryENUM();

        return MemoryENUM.instance;
        
    }

    private memory: Record<string, any> = {};

    public get_VALUE_OF_ENUM(key: string) {
        return this.memory[key];
    }

    public define_ENUM(key: string, value: any, type: string): void {
        // this.memory['eName'] = value;
        this.memory[key] = value;
    }


}
