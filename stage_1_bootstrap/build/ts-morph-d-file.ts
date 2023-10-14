import { performance } from "perf_hooks";
import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import { projectDir } from "./constants.js";

const start = performance.now();
const TS_MORPH_D = getTS_SourceFile(projectDir, "node_modules/ts-morph/lib/ts-morph.d.ts");
const end = performance.now();

export default TS_MORPH_D;

console.log("time to load ts-morph.d.ts: " + (end - start) + "ms");
