import { Reference } from "../specification/base";
import { Swagger, Paths as V2Paths, Operation as V2Operation, Parameter as V2Parameter } from "../specification/v2";
import { OpenAPI, Paths as V3Paths, Operation as V3Operation, Parameter as V3Parameter } from "../specification/v3";

export const HTTP_METHOD = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];

export declare type OasDefinitions = Swagger | OpenAPI;
export declare type OasPaths = V2Paths | V3Paths;
export declare type OasOperation = V2Operation | V3Operation;
export declare type OasParameter = V2Parameter | V3Parameter;
export const ENCODING_UTF_8 = "utf-8";

export enum OasVersion {
    V2 = "swagger",
    V3 = "openapi"
}

export function repeatWhitespace(count: number) {
    return '  '.repeat(count);
}

export function newLine(count: number): string {
    return '\n' + repeatWhitespace(count);
}

export function isV2(target: OasDefinitions): target is Swagger {
    return target.hasOwnProperty("swagger");
}

export function isV3(target: OasDefinitions): target is OpenAPI {
    return target.hasOwnProperty("openapi");
}

export function isParameter(target: any): target is OasParameter {
    return typeof target['in'] !== 'undefined' && typeof target['$ref'] === 'undefined'
}

export function isReference(target: any): target is Reference { 
    return typeof target['in'] === 'undefined' && typeof target['$ref'] !== 'undefined'
}