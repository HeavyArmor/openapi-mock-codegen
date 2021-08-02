import path from "path";
import mkdirp from "mkdirp";

const MODE_0755 = parseInt('0755', 8);

export default function mkdir(base: string, dir: string, mode?: string) {
    let loc = path.join(base, dir);
    mkdirp.sync(loc, {mode: mode || MODE_0755} );
}