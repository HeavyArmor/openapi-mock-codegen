import { 
    ExternalDocument, 
    Info, 
    SecurityRequirement,
    Tag, 
    Reference, 
    Example, 
    Description
} from "./base";

import { JSONSchema4 } from "json-schema";
export declare interface Parameter extends Description{
    name?: string;
    in?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: JSONSchema4;
    example?: any;
    examples?: ComponentExamples;
}
export declare interface Paths {
    [pathName: string]: PathItem;
}
export declare interface Response {
    description: string;
    headers?: ComponentHeaders;
    content?: ComponentMediaTypes;
    links?: ComponentLinks
}
export declare interface Responses {
    [key: string]: Response;
}
export declare interface ServerVariable {
    enum?: Array<string>;
    default: string;
    description?: string;
}
export declare interface ServerVariables {
    [key: string]: ServerVariable;
}
export declare interface Server {
    url: string;
    description?: string;
    variables?: ServerVariables;
}
export declare interface LinkParameters {
    [propName: string]: any;
}

export declare interface Properties {
    [propName: string]: JSONSchema4;
}
export declare interface Link {
    operationRef?: string;
    operationId?: string;
    parameters?: LinkParameters;
    requestBody?: any;
    description?: string;
    server?: Server;
}
export declare interface Encoding {
    contentType?: string;
    headers?: ComponentHeaders;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
}
export declare interface MediaType {
    schema?: JSONSchema4 | Reference;
    example?: any;
    examples?: ComponentExamples;
    encoding?: Encoding;
}

export declare interface Operation extends Description{
    tags?: Array<string>;
    summary?: string;
    externalDocs?: ExternalDocument;
    operationId?: string;
    parameters?: Array<Parameter | Reference>;
    requestBody?: RequestBody | Reference;
    responses: Responses;
    callbacks?: ComponentCallback;
    schemes?: Array<string>;
    deprecated?: boolean;
    security?: Array<SecurityRequirement>;
    servers?: Array<Server>;
    [propName: string]: any;
}
export declare interface PathItem {
    $ref?: string;
    summary?: string;
    description?: string;
    get?: Operation;
    put?: Operation;
    post?: Operation;
    delete?: Operation;
    options?: Operation;
    head?: Operation;
    patch?: Operation;
    trace?: Operation;
    servers?: Array<Server>;
    parameters?: Array<Parameter | Reference>;
}
export declare interface RequestBody extends Description{
    content: {[key: string]: MediaType};
    required?: boolean;
}
export declare interface Callback {
    [express: string]: PathItem;
}
export declare interface ComponentChemas {
    [propName: string]: JSONSchema4 | Reference;
}
export declare interface ComponentResponses {
    [key: string]: Response | Reference;
}
export declare interface ComponentParameters {
    [key: string]: Parameter | Reference;
}
export declare interface ComponentExamples {
    [key: string]: Example | Reference;
}
export declare interface ComponentRequestBodies {
    [key: string]: RequestBody | Reference;
}
export declare interface ComponentHeaders {
    [key: string]: Parameter | Reference;
}
export declare interface ComponentMediaTypes {
    [key: string]: MediaType | Reference;
}
export declare interface OAuthFlow {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes?: {[key: string]: string}
}
export declare interface OAuthFlows {
    implicit?: OAuthFlow;
    password?: OAuthFlow;
    clientCredentials?: OAuthFlow;
    authorizationCode?: OAuthFlow;
}
export declare interface SecurityScheme extends Description{
    type?: string;
    name?: string;
    in?: string;
    scheme?: string;
    bearerFormat?: string;
    flows?: OAuthFlows;
    openIdConnectUrl?: string; 
}
export declare interface ComponentSecuritySchemes {
    [key: string]: SecurityScheme | Reference;
}
export declare interface ComponentLinks {
    [key: string]: Link | Reference;
}
export declare interface ComponentCallback {
    [key: string]: Callback | Reference
}
export declare interface Components {
    schemas?: ComponentChemas;
    responses?: ComponentResponses;
    parameters?: ComponentParameters;
    examples?: ComponentExamples;
    requestBodies?: ComponentRequestBodies;
    headers?: ComponentHeaders;
    securitySchemes?: ComponentSecuritySchemes;
    links?: ComponentLinks;
    callbacks?: ComponentCallback;
}
export declare interface OpenAPI {
    readonly openapi: string;
    info: Info;
    servers?: Array<Server>;
    paths?: Paths;
    components?: Components;
    security?: Array<SecurityRequirement>;
    tags?: Array<Tag>;
    externalDocs?: ExternalDocument
}