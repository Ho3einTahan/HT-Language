
export function stringToBool(str: string): boolean | null {
    if (str.toLowerCase() == "true") {
        return true;
    }
    else if (str.toLowerCase() == "false") {
        return false;
    }
    else {
        return null;
    }
}