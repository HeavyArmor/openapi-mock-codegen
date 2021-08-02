#!/usr/bin/env node

import { program } from "commander";
import path from "path";
import fs from "fs";
import { generate } from "../codegen/index";

program
    .name("mock-codegen")
    .option("-td, --templateDir <dir>", "template files dir", path.resolve(process.cwd(), "templates"))
    .option("-cd, --codeDir <dir>", "the path code generate to", path.resolve(process.cwd(), "server", "routes"))
    .action((dir, cmd) => {
        const templateDir = dir.templateDir;
        const codeDir = dir.codeDir;
        if(path.isAbsolute(templateDir)) {
            if(!fs.existsSync(templateDir)) {
                console.error(`The value of dir ${templateDir} is not exists`);
                process.exit(1);
            }
            generate(templateDir, path.resolve(codeDir, "routes"));
        }
    })
    .parse(process.argv);