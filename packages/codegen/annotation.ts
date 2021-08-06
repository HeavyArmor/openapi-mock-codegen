import { newLine } from "../utils/util";
import { ExternalDocument } from "../specification/base";

/**
 * Generate annotation text
 */
 export function generateAnnotation(summary?: string, descrition?: string, externalDocs?: ExternalDocument): string {
    const result: Array<string> = [`/**`]; 
    if(descrition || summary || externalDocs?.url) {
        if(summary) {
            result.push(` * @summary ` + summary);
        }
        if(descrition) {
            result.push(` * @description ` + descrition);
        }
        if(externalDocs?.url) {
            result.push(` * @see ` + externalDocs.url);
        }
    } else {
        result.push(`*`);
    }
    result.push(`*/`);
    return result.join(newLine(0));
}