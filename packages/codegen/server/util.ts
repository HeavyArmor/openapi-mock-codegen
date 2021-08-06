import { isString, isNumber, isInteger, isBoolean, isArray, isEmpty } from "lodash";
import { ResponsesDefinitions, Response, Definitions } from "../../specification/v2";
import { ComponentMediaTypes } from "../../specification/v3";
import fs from "fs";
import path from "path";
import { JSONSchema4 } from "json-schema";
import { FakerDictionary } from "./dict";

export function config() {
    let SERVER_CONFIG: object = {};
    if(fs.existsSync(path.resolve(__dirname, "config.json"))) {
        SERVER_CONFIG = require("./config.json");
    }
    const DEFAULT_CONFIG_MAPPING = {
        routes: "routes",
        port: 3020,
        allowed_file_ext: [".js"],
        randomResp: true,
        useDict: true,
        locale: "en_US"
    }
    return Object.assign({}, DEFAULT_CONFIG_MAPPING, SERVER_CONFIG);
}

export function checkParameter(consumes: Array<string>, paramName: string, paramValue: any, type: string, parameterIn: string, required: boolean) {
    if(required && isEmpty(paramValue)) {
        console.warn(`Parameter ${paramName} is required!`);
        process.exit(1);
    }
    let valid = true
    let validMsg
    if (type === "file") {
        const isFileContentType = consumes.some(item => {
            return item === "multipart/form-data" || item === "application/x-www-form-urlencoded";
        });
        if (parameterIn !== "formData" || !isFileContentType) {
            valid = false;
        }
    }
    else if (type === "string") {
        valid = isString(paramValue);
        validMsg = `Parameter ${paramName} type check faild, the type shoud be string`;
    }
    else if (type === "integer") {
        valid = isInteger(paramValue);
        validMsg = `Parameter ${paramName} type check faild, the type shoud be integer`;
    }
    else if (type === "number") {
        valid = isNumber(paramValue);
        validMsg = `Parameter ${paramName} type check faild, the type shoud be number`;
    }
    else if (type === "boolean") {
        valid = isBoolean(paramValue);
        validMsg = `Parameter ${paramName} type check faild, the type shoud be boolean`;
    }
    else if (type === "array") {
        valid = isArray(paramValue);
        validMsg = `Parameter ${paramName} type check faild, the type shoud be array`;
    }
    if (!valid) {
        console.warn(validMsg);
        process.exit(1);
    }
}
export function randomResponse(responses: ResponsesDefinitions, random?: boolean) {
    if(!random) {
        const response: Response =  responses["default"] || responses["200"] || { description: "OK" };
        return { status: 200, value: response};
    } else { 
        const keys: Array<string> = Object.keys(responses);
        const keyLength: number = keys.length;
        const randomResKey: string = keys[Math.floor(Math.random() * keyLength)];
        return {status: randomResKey === 'default'? 200 : parseInt(randomResKey), value: responses[randomResKey]};
    }
}

export function randomMedia(mediaType: ComponentMediaTypes) {
    const keys: Array<string> = Object.keys(mediaType);
    const keyLength: number = keys.length;
    const randomResKey: string = keys[Math.floor(Math.random() * keyLength)];
    return { produces: [randomResKey], value: mediaType[randomResKey]};
}

export function arrangeDefinitions(definitions: Definitions) {
    const defVals: Array<JSONSchema4> = Object.values(definitions);
    const dictInstance = new FakerDictionary();
    if(defVals.length) {
        defVals.forEach(item => {
            const properties = item.properties;
            if(properties && !isEmpty(properties)) {
                for(let propKey in properties) {
                    properties[propKey].faker = dictInstance.queryDict(propKey);
                }
            }
        });
    }
}