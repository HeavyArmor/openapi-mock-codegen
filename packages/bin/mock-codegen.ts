#!/usr/bin/env node

import { program } from "commander";
import path from "path";
import fs from "fs";
import { generate } from "../codegen/index";

program
    .name("mock-codegen")
    .option("-td, --templateDir <dir>", "template files dir", path.resolve(__dirname, "../", "templates"))
    .option("-cd, --codeDir <dir>", "the path code generate to", path.resolve(__dirname, "../", "server", "routes"))
    .action((dir, cmd) => {
        const templateDir = dir.templateDir;
        const codeDir = dir.codeDir;
        if(path.isAbsolute(templateDir)) {
            if(!fs.existsSync(templateDir)) {
                throw new Error(`The value of dir ${templateDir} is not exists`);
            }
            generate(templateDir, codeDir);
        }
    })
    .parse(process.argv);