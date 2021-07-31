import { Tag } from "../specification/base"
import { Definitions, Swagger } from "../specification/v2";
import { OasDefinitions, OasPaths} from "../utils/util";
import { isArray, isEmpty, isObject, isUndefined } from "lodash";
import { JSONSchema4 } from "json-schema";

export function parsePaths(targetDocument: OasDefinitions): Map<string, OasPaths> {
    const docModules = new Set<string>();
    const docModulesList = new Map<string, OasPaths>();

    if(!isUndefined(targetDocument)) {
        const docTags: Array<Tag> = targetDocument.tags || [];
        const docPaths: OasPaths = targetDocument.paths || {};
        if(docTags && isArray(docTags) && docTags.length) {
            docTags.forEach(element => {
                docModules.add(element.name);
            });
            if(docModules.size > 0) {
                docModules.forEach(item => {
                    const docModulesObj: OasPaths = {};
                    Object.keys(docPaths).forEach((key) => {
                    if(key.startsWith("/" + item)) {
                        docModulesObj[key.replace(/\/{\s?/g, "/:").replace(/\s?}/g,"")] = docPaths[key];
                    }
                    });
                    docModulesList.set(item, docModulesObj);
                });
            }
        }
    }
    return docModulesList;
}

export function parseDefinitions(targetDocument: Swagger): Map<string, JSONSchema4> {
    const docDefinitions: Map<string, JSONSchema4> = new Map<string, JSONSchema4>();
    if(!isUndefined(targetDocument)) {
        const definitions: Definitions = targetDocument.definitions || {};
        if(definitions && isObject(definitions) && !isEmpty(definitions)) {
            Object.keys(definitions).forEach(item => {
                docDefinitions.set(item, definitions[item]);
            });
        }
    }
    return docDefinitions;
}