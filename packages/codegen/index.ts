import path from "path";
import fs from "fs";
import { isPlainObject, isEmpty } from "lodash";
import yaml from "js-yaml";
import { ENCODING_UTF_8, isV2, OasDefinitions, OasPaths, OasVersion } from "../utils/util";
import { Swagger, Definitions } from "../specification/v2";
import { OpenAPI, ComponentChemas } from "../specification/v3";
import { parsePaths } from "../parser";
import { generateRoutesString } from "./routes";
import write2file from "../utils/write2file";

const JS_FILE_SUFIX: string = ".js";
const JSON_FILE_SUFIX: string = ".json";
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
            const version: OasVersion = isV2(openApi) ? OasVersion.V2 : OasVersion.V3;
            if(version === OasVersion.V2) {
                generateDefinitions(version, codePath, (openApi as Swagger).definitions);
            } else if(version === OasVersion.V3) {
                generateDefinitions(version, codePath, (openApi as OpenAPI).components?.schemas);
            }
            let oasPaths: Map<string, OasPaths> =  parsePaths(openApi);
            for(let pathKey of oasPaths.keys()) {
                const result = generateRoutesString(version, oasPaths.get(pathKey) as OasPaths);
                write2file(path.resolve(codePath, pathKey + JS_FILE_SUFIX), result);
            }
        }
    }
}

function generateDefinitions(version: OasVersion, codePath: string, definitions?: Definitions | ComponentChemas): void {
    if(definitions) {
        let targetDefinitions: any = {};
        if(version === OasVersion.V2) {
            targetDefinitions.definitions = definitions;
        } else if (version === OasVersion.V3) {
            targetDefinitions.components = {};
            targetDefinitions.components.schemas = definitions;
        }
        write2file(path.resolve(codePath, "../", DEFI_FILE + JSON_FILE_SUFIX), JSON.stringify(targetDefinitions));
    }
}

function copyServerFiles(absolutePath: string) {
    const serverFilesAbsolutePath = path.resolve(__dirname, "server");
    const dirStat = fs.statSync(serverFilesAbsolutePath);
    if(dirStat.isDirectory()) {
        fs.readdirSync(serverFilesAbsolutePath).forEach(file => {
            const filePath = path.resolve(serverFilesAbsolutePath, file);
            const stat = fs.statSync(filePath);
            if(stat.isFile()) {
                fs.copyFileSync(filePath, path.resolve(absolutePath, "../", file), fs.constants.COPYFILE_FICLONE);
            }
        });
    }
}

function generateDirs(dirname: string) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (generateDirs(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
}

export function generate(absolutePath: string, codePath: string): void {
    const filePaths: Array<string> = 
        fs.statSync(absolutePath).isFile() ? 
            [absolutePath] : fs.readdirSync(absolutePath, ENCODING_UTF_8);
    if(!generateDirs(codePath)) return;
    copyServerFiles(codePath);
    filePaths.forEach(fileName => {           
        generateDefinitionsFile(absolutePath, fileName, codePath);
    });
}

