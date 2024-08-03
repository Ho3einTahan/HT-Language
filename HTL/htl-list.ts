import { stringToBool } from "../function/string-to-bool.ts";

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
        const item = array.at(index);
        // used to support string and other type
        return JSON.stringify(item);
    }

    /**
     * get index of content
     * @param content
     * @param type
     */
    getIndex(content: string, type: string): number {
        if (type == 'listbool') {
            return this.array.indexOf(stringToBool(content));
        }
        else if (type == 'listint') {
            return this.array.indexOf(parseInt(content));
        }
        else if (type == 'liststring') {
            return this.array.indexOf(content.slice(1, -1));
        }
        else {
            return this.array.indexOf(content);
        }

    }

    /**
     * get last item from List
     */
    lstItem(): any {
        const lastItem = this.array.at(this.array.length - 1);
        // used of JSON.stringify To support string and othe type
        return JSON.stringify(lastItem);
    }

    /**
     * get first item from List
     */
    fstItem(): any {
        const firstItem = this.array.at(0);
        // used of JSON.stringify To support string and othe type
        return JSON.stringify(firstItem);
    }

    /**
     * delete item in List By Index
     * @param index
     */
    removeAt(index: number): Array<any> {
        // filter by index 
        const outArray = this.array.map((item, i) => i != index);
        return outArray;
    }

    /**
     * add new Item to List
     * @param param
     */
    add(param: Array<any>): Array<any> {
        if (param.length == 1) {
            // extract item in List
            this.array.push(param[0]);
        }
        else if (param.length > 1) {
            this.array = param;
        }
        else {
            throw Error('pleas set item for add or replce with List value');
        }
        console.log('hasanc');
        console.log(this.array);
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
