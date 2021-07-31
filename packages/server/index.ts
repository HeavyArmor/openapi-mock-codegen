import Koa from "koa";
import koaBody from 'koa-body';
import fs from "fs";
import path from "path";
import { config } from "./util";

const FINAL_CONFIG = config();
const ROUTES_PATH: string = FINAL_CONFIG.routes;
const ALLOWED_FILE_EXT: Array<string> = FINAL_CONFIG.allowed_file_ext;
const ROUTES_FILES: Array<string> = [];

//遍历目录下的所有文件
const ergodicFile = (dir: string) => {
    let files = fs.readdirSync(path.resolve(__dirname, dir));
    if(files.length > 0) {
        files.forEach((fileName) => {
            let pathName = path.join(dir, fileName);
            let stats = fs.statSync(path.resolve(__dirname, pathName));
            if (stats.isDirectory()) {
                ergodicFile(pathName);
            } else {
                if (ALLOWED_FILE_EXT.includes(path.extname(pathName))) {
                    ROUTES_FILES.push(pathName);
                }
            }
        });
    }
}

const bootstrap = () => {
    ergodicFile(ROUTES_PATH);
    const app = new Koa();
    if(ROUTES_FILES.length) {
        ROUTES_FILES.forEach((filePath) => {
            const router = require(path.resolve(__dirname, filePath));
            app.use(router.routes());
            app.use(router.allowedMethods());
        });
    }
    app.use(koaBody({ multipart: true }));
    app.listen(FINAL_CONFIG.port);
}

bootstrap();

