import { program } from "commander";

program
    .name("mock-server")
    .option("-s, --start", "start the server")
    .option("-c, --close", "close the server")
    .option("-r, --restart", "restart the server")
    .parse(process.argv);