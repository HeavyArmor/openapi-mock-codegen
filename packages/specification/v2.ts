import { 
    Info, 
    SecurityRequirement, 
    Tag, 
    Reference,
    ExternalDocument, 
    Description,
    Example
} from "./base";

import { JSONSchema4 } from "json-schema";

export declare interface Parameter extends Items, Description{
    name: string;
    in: string;
    required?: boolean;
    allowEmptyValue?: boolean;
    schema?: JSONSchema4;
}
export declare interface Properties {
    [propName: string]: JSONSchema4;
}

export declare interface Header extends Items, Description {}

export declare interface Items {
    type: string;
    format?: string;
    items?: Items;
    collectionFormat?: string;
    default?: any;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    enum?: Array<any>;
    multipleOf?: number;
}
export declare interface Headers {
    [propName: string]: Header;
}
export declare interface Response {
    description: string;
    schema?: JSONSchema4;
    headers?: Headers;
    example?: Example;
}

export declare interface Operation extends Description{
    tags?: Array<string>;
    summary?: string;
    externalDocs?: ExternalDocument;
    operationId?: string;
    consumes?: Array<string>;
    produces?: Array<string>;
    parameters?: Array<Parameter | Reference>;
    responses: ResponsesDefinitions;
    schemes?: Array<string>;
    deprecated?: boolean;
    security?: SecurityRequirement;
}
export declare interface PathItem {
    $ref?: string;
    parameters?: Parameter | Reference;
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
    [key: string]: any;
}
export declare interface Paths {
    [pathName: string]: PathItem | any;
}
export declare interface Definitions {
    [propName: string]: JSONSchema4;
}
export declare interface ParametersDefinitions {
    [propName: string]: Parameter;
}
export declare interface ResponsesDefinitions {
    [propName: string]: Response;
}
export declare interface Scopes {
    [propName: string]: string;
}
export declare interface SecurityScheme extends Description {
    type?: string;
    name?: string;
    in?: string;
    flow?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    scopes?: Scopes;
}
export declare interface SecurityDefinitions {
    [propName: string]: SecurityScheme;
}
export declare interface Swagger {
    readonly swagger: string;
    info: Info;
    host?: string;
    basePath?: string;
    schemes?: Array<string>;
    consumes?: Array<string>;
    produces?: Array<string>;
    paths: Paths;
    definitions?: Definitions;
    parameters?: ParametersDefinitions;
    responses?: ResponsesDefinitions;
    securityDefinitions?: SecurityDefinitions;
    security?: SecurityRequirement;
    tags?: Array<Tag>;
    externalDocs?: ExternalDocument;
}