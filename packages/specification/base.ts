export declare type Description = {
    description?: string;
}
export declare interface Contact extends License{
    email?: string;
}
export declare interface License {
    name?: string;
    url?: string;
}
export declare interface Info extends Description{
    title: string;
    termsOfService?: string;
    contact?: Contact;
    license?: License;
    version: string
}
export declare interface SecurityRequirement {
    [propName: string]: Array<string>;
}
export declare interface Example {
    [mimeType: string]: any;
}
export declare interface Reference {
    $ref: string;
}
export declare interface Tag extends Description{
    name: string;
    externalDocs?: ExternalDocument;
}
export declare interface ExternalDocument extends Description{
    url: string;
}