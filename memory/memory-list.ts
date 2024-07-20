
export type ListType = {
    type: String,
    body: Array<any>,
};

// List Memory
export class MemoryList {

    private memory: Record<string, ListType> = {};

    public get_LIST_VALUES(key: string) {
        return this.memory[key];
    }

    public define_LIST(key: string,value: ListType): void {
        // this.MemoryList['vLIST'] = value;
        this.memory[key] = value;
    }


}
