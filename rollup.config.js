import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
const pkg = require('./package.json');

const extensions = ['.js', '.ts'];

export default {
    input: "./packages/codegen/index.ts",
    output: {
        file: 'codegen.bundle.js',
        format: 'cjs',
        soucemap: true
    },
    plugins: [ 
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: "esnext",
                    target: "esnext"
                }
            },
        }), 
        resolve({
            extensions,
            modulesOnly: true,
            preferredBuiltins :false
        }), 
        commonjs(),
        terser()
    ],
    external: Object.keys(pkg.dependencies)
}