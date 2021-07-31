import path from "path";
import fs from "fs";
import { isPlainObject, isEmpty } from "lodash";
import yaml from "js-yaml";
import { ENCODING_UTF_8, isV2, newLine, OasDefinitions, OasPaths, repeatWhitespace } from "../utils/util";
import { Swagger, Definitions } from "../specification/v2";
import { parsePaths } from "../parser";
import { generateRoutesString } from "./oas2/routes";
import write2file from "../filesys/write2file";

const JS_FILE_SUFIX: string = ".js";
const JSON_FILE_SUFIX: string = ".json";
const UTIL_FILE_NAME: string = "util";
const DEFI_FILE: string = "definitions";

function generateDefinitionsFile(absolutePath: string, fileName: string, codePath: string): void {
    const filePath: string = path.resolve(absolutePath, fileName);
    const fileContent: string = 
        path.extname(filePath).trim().slice(1).toUpperCase() === 'YAML' ? 
        JSON.stringify(yaml.load(fs.readFileSync(filePath, ENCODING_UTF_8), {json: true})).trim() : 
        fs.readFileSync(filePath, ENCODING_UTF_8).toString().trim();
    if(!isEmpty(fileContent)) {
        const openApi: OasDefinitions =  JSON.parse(fileContent);
        if(isPlainObject(openApi)) {
            if(isV2(openApi)) {
                const swagger: Swagger = openApi;
                generateDefinitions(codePath, swagger.definitions);
                let swaggerPaths: Map<string, OasPaths> =  parsePaths(swagger);
                for(let pathKey of swaggerPaths.keys()) {
                    const result = generateRoutesString(swaggerPaths.get(pathKey) as OasPaths);
                    write2file(path.resolve(codePath, pathKey + JS_FILE_SUFIX), result);
                }
            }
        }
    }
}

function generateDefinitions(codePath: string, definitions?: Definitions): void {
    if(definitions) {
        write2file(path.resolve(codePath, "../", DEFI_FILE + JSON_FILE_SUFIX), JSON.stringify({definitions}));
    }
}

export function generate(absolutePath: string, codePath: string): void {
    const filePaths: Array<string> = 
        fs.statSync(absolutePath).isFile() ? 
            [absolutePath] : fs.readdirSync(absolutePath, ENCODING_UTF_8);
    if(!fs.existsSync(codePath)) {
        fs.mkdirSync(codePath);
    }   
    filePaths.forEach(fileName => {           
        generateDefinitionsFile(absolutePath, fileName, codePath);
    });
}

