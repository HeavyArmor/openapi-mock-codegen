import { Schema } from "js-yaml";
import { Parameter as V3Parameter, Operation as V3Operation, RequestBody, Responses } from "../specification/v3";
import { Reference } from "../specification/base";
import { Parameter as V2Parameter, Operation as V2Operation, ResponsesDefinitions, PathItem } from "../specification/v2";
import { HTTP_METHOD, isParameter, isRequestBody, newLine, OasOperation, OasPaths, OasVersion, repeatWhitespace } from "../utils/util";
import { generateAnnotation } from "./annotation";
const Mime = require('mime-type/with-db');
function generateConsumes(consumes: Array<string> | undefined, repeatCount = 0): string {
    let computedConsumes:Array<string> = [];
    if(consumes && Array.isArray(consumes) && consumes.length) {
        computedConsumes = consumes.filter(item => {
            return Mime.exist(item);
        }); 
    };
    return `${repeatWhitespace(repeatCount)}let validConsumes = ${JSON.stringify(computedConsumes.length ? computedConsumes : [])};`;
}

function generateProduces(produces: Array<string> | undefined, repeatCount = 0): string {
    let computedProduces: Array<string> = [];
    if(produces && Array.isArray(produces) && produces.length) {
        computedProduces = produces.filter(item => {
            return Mime.exist(item);
        }); 
    };
    return `${repeatWhitespace(repeatCount)}let validProduces = ${JSON.stringify(computedProduces.length ? computedProduces: [])};`;
}

function generateV2Parameters(params: Array<V2Parameter | Reference> | undefined, repeatCount = 0): string {
    if(params && Array.isArray(params) && params.length) {
        const result: Array<string> = []; 
        for(let param of params) {
            if(isParameter(param)) {
                if(param.in === "path") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.params.${param.name};`);
                } else if(param.in === "query") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.query.${param.name};`);
                } else if(param.in === "header") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.headers.${param.name};`);
                } else if(param.in === "body") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.request.body.${param.name};`);
                } else if(param.in === "formData") {
                    if(param.type === "file") {
                        result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.request.files.${param.name};`);
                    } else {
                        result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.request.body.${param.name};`);
                    }
                }
                result.push(`${repeatWhitespace(repeatCount)}checkParameter(validConsumes, "${param.name}", ${param.name}, "${param.type}", "${param.in}", ${param.required});`);
            }
        }
        return result.join(newLine(0));
    }
    return "";
}

function generateV3Parameters(params: Array<V3Parameter | Reference> | undefined, repeatCount = 0): string {
    if(params && Array.isArray(params) && params.length) {
        const result: Array<string> = []; 
        for(let param of params) {
            if(isParameter(param)) {
                if(param.in === "path") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.params.${param.name};`);
                } else if(param.in === "query") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.query.${param.name};`);
                } else if(param.in === "header") {
                    result.push(`${repeatWhitespace(repeatCount)}const ${param.name} = ctx.headers.${param.name};`);
                }
                result.push(`${repeatWhitespace(repeatCount)}checkParameter(null, "${param.name}", ${param.name}, "${param.schema?.type}", "${param.in}", ${param.required});`);
            }
        }
        return result.join(newLine(0));
    }
    return "";
}

function generateV3RequestBody(reqBody: RequestBody | Reference | undefined, repeatCount = 0): string {
    if(reqBody) {
        const result: Array<string> = [];    
        if(isRequestBody(reqBody)) {
            
        }
        return result.join(newLine(0));
    }
    return "";
}

function generateV2Response(responses: ResponsesDefinitions | undefined, repeatCount = 0): string {
    const result: Array<string> = []; 
    const whiteSpaceRepeat0 = repeatWhitespace(repeatCount);
    const whiteSpaceRepeat1 = repeatWhitespace(repeatCount + 1);
    result.push(`${whiteSpaceRepeat0}if(validProduces.length) {`);
    result.push(`${whiteSpaceRepeat1}ctx.response.header['Content-Type'] = validProduces.join(',');`);
    result.push(`${whiteSpaceRepeat0}}`);
    if(responses) {
        result.push(`${whiteSpaceRepeat0}const res = randomResponse(${JSON.stringify(responses)}, FINAL_CONFIG.randomResp);`);
        result.push(`${whiteSpaceRepeat0}const schema = Object.assign({}, {schema: res.value.schema}, definitions);`);
        result.push(`${whiteSpaceRepeat0}ctx.response.status = res.status;`);
        result.push(`${whiteSpaceRepeat0}ctx.response.headers = res.value.headers;`);
        result.push(`${whiteSpaceRepeat0}ctx.response.body = res.value.schema ? jsf.generate(schema).schema : res.value.description;`);
    }
    return result.join(newLine(0));
}

function generateV3Response(responses: Responses | undefined, repeatCount = 0): string {
    const result: Array<string> = []; 
    const whiteSpaceRepeat0 = repeatWhitespace(repeatCount);
    if(responses) {
        result.push(`${whiteSpaceRepeat0}const res = randomResponse(${JSON.stringify(responses)}, FINAL_CONFIG.randomResp);`);
        result.push(`${whiteSpaceRepeat0}const media = randomMedia(res.value.content);`);
        result.push(`${whiteSpaceRepeat0}const schema = Object.assign({}, {schema: media.value.schema}, definitions);`);
        result.push(`${whiteSpaceRepeat0}ctx.response.header['Content-Type'] = media.produces;`);
        result.push(`${whiteSpaceRepeat0}ctx.response.status = res.status;`);
        result.push(`${whiteSpaceRepeat0}ctx.response.headers = res.value.headers;`);
    }
    return result.join(newLine(0));
}

export function computeRoutes(version: OasVersion, op: OasOperation) {
    const result: Array<string> = [];
    if(version === OasVersion.V2) {
        const operation = op as V2Operation;
        result.push(generateConsumes(operation.consumes, 1));
        result.push(generateProduces(operation.produces, 1));
        result.push(generateV2Parameters(operation.parameters, 1));
        result.push(generateV2Response(operation.responses, 1));
    } else if(version === OasVersion.V3) {
        const operation = op as V3Operation;
        result.push(generateV3Parameters(operation.parameters, 1));
        result.push(generateV3RequestBody(operation.requestBody, 1));
        result.push(generateV3Response(operation.responses, 1));
    }
    return result.join(newLine(0));
}

export function generateRoutesString(version: OasVersion, paths: OasPaths): string {
    const targetStr: Array<string> = [];
    targetStr.push(`const Router = require('koa-router');`);
    targetStr.push(`const { config, checkParameter, randomResponse, ${ version === OasVersion.V2 ? "" : "randomMedia,"} arrangeDefinitions } = require('../util');`);
    targetStr.push(`const router = new Router();`);
    targetStr.push(`const jsf = require('json-schema-faker');`);
    targetStr.push(`const definitions = require("../definitions.json");`);
    targetStr.push(`const FINAL_CONFIG = config();` + newLine(0));
    targetStr.push(`const faker = require('faker');`);
    targetStr.push(`faker.locale = FINAL_CONFIG.locale;` + newLine(0));
    targetStr.push(`jsf.extend('faker', () => faker);`);
    targetStr.push(`jsf.option({optionalsProbability: 1});` + newLine(0));
    targetStr.push(`if(FINAL_CONFIG.useDict) {`);
    targetStr.push(`${repeatWhitespace(1)}arrangeDefinitions(definitions.definitions);`)
    targetStr.push(`}` + newLine(0));
    for (let key in paths) {
        const path: PathItem = paths[key];
        for(let itemKey in path) {
            if(HTTP_METHOD.indexOf(itemKey.toUpperCase()) > -1) {
                const reqMethod: OasOperation = path[itemKey];
                targetStr.push(generateAnnotation(reqMethod.summary, reqMethod.description, reqMethod.externalDocs));
                targetStr.push(`router.${itemKey}("${key}", (ctx) =>{`);
                targetStr.push(computeRoutes(version, reqMethod));
                targetStr.push(`});`);
            }
        }
    }
    targetStr.push(`module.exports = router;`);
    return targetStr.join(newLine(0));
}