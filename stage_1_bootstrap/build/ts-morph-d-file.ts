import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import { projectDir } from "./constants.js";

const TS_MORPH_D = getTS_SourceFile(projectDir, "node_modules/ts-morph/lib/ts-morph.d.ts");
export default TS_MORPH_D;
