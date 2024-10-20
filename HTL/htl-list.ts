import { typeValidator } from "../function/type-validation.ts";
import { stringToBool } from "../function/string-to-bool.ts";

/// HoseinTahan Language List
export class HTL_LIST {

    public static array: Array<any>;

    private static instance: HTL_LIST;

    public static getInstance(array: Array<any>) {
    if(!this.instance) this.instance=new HTL_LIST(array);
    return this.instance;
    }

    constructor(array: Array<any>) {
        HTL_LIST.array = array;
    };

    /**
     * get length of List
     */
    length(): number {
        return HTL_LIST.array.length;
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

        if (type == 'liststring') return HTL_LIST.array.indexOf(content.slice(1, -1));
        if (type == 'listint') return HTL_LIST.array.indexOf(parseInt(content));
        if (type == 'listbool') return HTL_LIST.array.indexOf(stringToBool(content));
        else {
            throw Error('Pleas Add correct Type OF Your List .');
        }

    }

    /**
     * get last item from List
     */
    lstItem(): any {
        const lastItem = HTL_LIST.array.at(HTL_LIST.array.length - 1);
        // used of JSON.stringify To support string and othe type
        return JSON.stringify(lastItem);
    }

    /**
     * get first item from List
     */
    fstItem(): any {
        const firstItem = HTL_LIST.array.at(0);
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
        delete HTL_LIST.array[index];
        return HTL_LIST.array;
    }

    /**
     * add new Item to List
     * @param param
     * @param listType
     */
    add(param: any, listType: string): Array<any> {

        // validate param listType
        typeValidator(param, listType);

        if (param) {
            if (listType == 'liststring') HTL_LIST.array.push(param);
            if (listType == 'listint') HTL_LIST.array.push(parseInt(param));
            if (listType == 'listbool') HTL_LIST.array.push(stringToBool(param));
        }
        else {
            throw Error('Pleas Enter Item To Add List');
        }

        return HTL_LIST.array;
    }

    /**
     * addAll new Items to List
     * or reblace with previews items
     * @param items
     */
    addAll(items: Array<any>, listType: string): Array<any> {

        items.map((item) => {
            // validate item listType
            typeValidator(item, listType);
        });


        HTL_LIST.array = items;
        return HTL_LIST.array;
    }

    /**
     *  replace item by index
     * @param index
     * @param content
     * @param listType
     */
    replIndex(index: number, content: any, listType: string) {
        // validate content listType
        typeValidator(content, listType);
        console.log(HTL_LIST.array);
        console.log(index);
        console.log(content);
        console.log(listType);
        HTL_LIST.array[index] = content;
        return HTL_LIST.array;
    }


    /**
 *  replace item by index
 * @param content
 * @param replaceContent
 * @param listType
 */
    replContent(content: any, replaceContent: any, listType: string) {

        // validate content listType
        typeValidator(content, listType);

        // validate replaceContent listType
        typeValidator(replaceContent, listType);

        const list = HTL_LIST.array.map((item) => {
            if (item == content) return replaceContent;
            else
                return item;
        });

        return list;
    }





}

