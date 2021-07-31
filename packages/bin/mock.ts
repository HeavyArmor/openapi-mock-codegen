import { program } from "commander";

program
    .version(require("../../package.json").version)
    .command("codegen", "codegen files")
    .command("server", "mock server operation")
    .parse(process.argv);