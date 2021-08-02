import fs from "fs";
import path from "path";

declare type Dict = {
    [prop: string]: Array<string>;
}

export class FakerDictionary {
    dict: Dict;
    constructor() {
        const defaultDictPath: string = path.resolve(__dirname, "dictionary.json");
        this.dict = JSON.parse(fs.existsSync(defaultDictPath) ? fs.readFileSync(defaultDictPath, "utf-8") : "{}");
    }

    setDictionary(dict: Dict): void {
        this.dict = dict;
    }

    extendDictionary(dict: Dict): void {
        this.dict = Object.assign({}, this.dict, dict);
    }

    queryDict(target: string): string {
        let resultKey: string = "";
        for (let dictKey in this.dict) {
            const element = this.dict[dictKey];
            const contains = element.some(dictItem => {
                return target === dictItem;
            });
            if(contains) {
                resultKey = dictKey;
                break;
            }
        }
        return resultKey;
    }
}