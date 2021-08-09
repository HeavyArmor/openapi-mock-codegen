#!/usr/bin/env node

import { program } from "commander";
import path from "path";
import fs from "fs";
import { generate } from "../codegen/index";

program
    .name("mock-codegen")
    .option("-td, --templateDir <dir>", "template files dir", path.resolve(process.cwd(), "templates"))
    .option("-cd, --codeDir <dir>", "the path code generate to", path.resolve(process.cwd(), "server"))
    .option("--api <dir>", "the path of OpenAPI definition file")
    .action((dir, cmd) => {
        const templateDir = dir.templateDir;
        const codeDir = dir.codeDir;
        const apiDir = dir.api;
        let computedTemplateDir = apiDir ? 
            (path.isAbsolute(apiDir) ? apiDir : path.resolve(process.cwd(), apiDir)) : 
            (path.isAbsolute(templateDir) ? templateDir : path.resolve(process.cwd(), templateDir));
        let computedCodeDir = path.isAbsolute(codeDir) ? 
            path.resolve(codeDir, "routes") : 
            path.resolve(process.cwd(), codeDir, "routes");
        if(!fs.existsSync(computedTemplateDir)) {
            console.error(`The value of dir ${computedTemplateDir} is not exists`);
            process.exit(1);
        } else if(apiDir && !fs.statSync(computedTemplateDir).isFile()) {
            console.error(`The value ${computedTemplateDir} is not a file`);
            process.exit(1);
        }
        generate(computedTemplateDir, computedCodeDir);
    })
    .parse(process.argv);