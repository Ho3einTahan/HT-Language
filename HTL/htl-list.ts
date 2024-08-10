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
    at(list: Array<any>, listType: string, index: number): any {
        const item = list.at(index);
        // used to support string and other type
        if (listType == 'liststring') return JSON.stringify(item);
        if (listType == 'listint') return parseInt(item);
        if (listType == 'listbool') return stringToBool(item.toString());
        else {
            throw Error('Pleas Enter Valid Value With Correct Type');
        }
    }

    /**
     * get index of content
     * @param content
     * @param type
     */
    getIndex(content: string, type: string): number {

        if (type == 'liststring') return this.array.indexOf(content.slice(1, -1));
        if (type == 'listint') return this.array.indexOf(parseInt(content));
        if (type == 'listbool') return this.array.indexOf(stringToBool(content));
        else {
            throw Error('Pleas Add correct Type OF Your List .');
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
        /* const outArray = this.array.map((item, i) => i != index); */
        delete this.array[index];
        return this.array;
    }

    /**
     * add new Item to List
     * @param param
     * @param listType
     */
    add(param: any, listType: string): Array<any> {

        // check listType
        if (listType == 'liststring' && typeof param != 'string' || listType == 'listint' && !parseInt(param) || listType == 'listbool' && stringToBool(param) == null) {
            throw Error('Pleas Add correct Type OF Your List .');
        }

        if (param) {
            if (listType == 'liststring') this.array.push(param);
            if (listType == 'listint') this.array.push(parseInt(param));
            if (listType == 'listbool') this.array.push(stringToBool(param));
        }
        else {
            throw Error('Pleas Enter Item To Add List');
        }

        return this.array;
    }

    /**
     * addAll new Items to List
     * or reblace with previews items
     * @param items
     */
    addAll(items: Array<any>, listType: string): Array<any> {

        items.map((item) => {
            // check listType
            if (listType == 'liststring' && typeof item != 'string' || listType == 'listint' && !parseInt(item) || listType == 'listbool' && stringToBool(item) == null) {
                throw Error('Pleas Add correct Type OF Your List .');
            }
        });


        this.array = items;
        return this.array;
    }

    /**
     *  replace item by index
     * @param index
     * @param content
     * @param listType
     */
    replIndex(index: number, content: any, listType: string) {

        // check listType
        if (listType == 'liststring' && typeof content != 'string' || listType == 'listint' && !parseInt(content) || listType == 'listbool' && stringToBool(content) == null) {
            throw Error('Pleas Add correct Type OF Your List .');
        }

        this.array[index] = content;
        return this.array;
    }


    /**
 *  replace item by index
 * @param content
 * @param replaceContent
 * @param listType
 */
    replContent(content: any, replaceContent: any, listType: string) {

        // check listType
        if (listType == 'liststring' && typeof content != 'string' || listType == 'listint' && !parseInt(content) || listType == 'listbool' && stringToBool(content) == null) {
            throw Error('Pleas Add correct Type OF Your List .');
        }
        
        if (listType == 'liststring' && typeof replaceContent != 'string' || listType == 'listint' && !parseInt(replaceContent) || listType == 'listbool' && stringToBool(replaceContent) == null) {
            throw Error('Pleas Add correct Type OF Your List .');
        }

        const list = this.array.map((item) => {
            if (item == content) return replaceContent;
           else 
           return item;
        });

        return list;
    }



}

