/// HoseinTahan Language List
export class HTL_LIST {

    array: Array<any>;

    constructor(array: Array<any>) {
        this.array = array;
    };

    /**
     * get length of List
     */
    length(): number {
        return this.array.length;
    }

    /**
     * get item By Index from List
     * @param array
     * @param index
     */
    at(array: Array<any>, index: number): any {
        return array.at(index);
    }

    /**
     * get index of content
     * @param content 
     */
    getIndex(content: String): number {
        return this.array.indexOf(content);
    }

    /**
     * get last item from List
     */
    lstItem(): any {
        return this.array.at(this.array.length - 1);
    }

    /**
     * get first item from List
     */
    fstItem(): any {
        return this.array.at(0);
    }

    /**
     * delete item in List By Index
     * @param index
     */
    delete_Index(index: number): Array<any> {
        delete this.array[index];
        return this.array;
        // fix it
    }

    /**
     * add new Item to List
     * @param item
     */
    add(item: any): Array<any> {
        this.array.push(item)
        return this.array;
    }

    /**
     * addAll new Items to List
     * or reblace with previews items
     * @param items
     */
    addAll(items: Array<any>): Array<any> {
        this.array.push(items);
        return this.array;
    }

    /**
     *  replace item by index
     * @param index
     * @param content
     */
    replce_Index(index: number, content: any) {
        this.array[index] = content;

        // fix it

    }

}
