import fs from "fs";

const MODE_0666 = parseInt('0666', 8);

export default function write2file(file: string, content: string, mode?: string): void {
    fs.writeFileSync(file, content, { mode: mode || MODE_0666 });
}