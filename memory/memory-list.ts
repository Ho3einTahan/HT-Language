export type ListType = {
    type: String,
    body: Array<any>,
};

// List Memory
export class MemoryList {

    private static instance: MemoryList;
    
    private constructor() { }

    public static getInstance(): MemoryList {
        if (!MemoryList.instance) {
            MemoryList.instance = new MemoryList();
        }
        return MemoryList.instance;
    }

    private memory: Record<string, ListType> = {};

    public get_LIST_VALUE(key: string) {
        return this.memory[key];
    }

    public isExist(key: string) {
        return this.memory[key];
    }

    public define_LIST(key: string,value: ListType): void {
        // this.MemoryList['vLIST'] = value;
        this.memory[key] = value;
    }


}
