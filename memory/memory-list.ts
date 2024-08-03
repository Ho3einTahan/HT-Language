export type ListType = {
    type: string,
    body: Array<any>,
};

// List Memory
export class MemoryList {

    private static instance: MemoryList;

    private constructor() { }

    public static getInstance(): MemoryList {

        if (!MemoryList.instance) MemoryList.instance = new MemoryList();

        return MemoryList.instance;

    }

    private memory: Record<string, ListType> = {};

    public get_BODY_OF_LIST(key: string):ListType{
        return this.memory[key];
    }

    public hasList(key: string) {
        return this.memory[key];
    }

    public define_LIST(key: string, value: ListType): void {
        // this.MemoryList['vLIST'] = value;
        this.memory[key] = value;
    }

}