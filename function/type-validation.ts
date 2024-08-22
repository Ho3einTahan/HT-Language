import { stringToBool } from "./string-to-bool.ts";

export function typeValidator(item: any, listType: string) {

    if (listType == 'liststring' && typeof item != 'string' || listType == 'listint' && !parseInt(item) || listType == 'listbool' && stringToBool(item) == null) {
        throw Error('Pleas Add correct Type OF Your List .');
    }

}