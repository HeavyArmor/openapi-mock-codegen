#!/usr/bin/env node

import { program } from "commander";

program
    .version(require("../../package.json").version)
    .command("codegen", "codegen files")
    .parse(process.argv);