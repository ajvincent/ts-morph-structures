import fs from "fs/promises";

import { pathToModule } from "#utilities/source/AsyncSpecModules.js";
import { stageDir } from "./constants.js";

export default async function removeExtracted(): Promise<void> {
  await fs.rm(pathToModule(stageDir, "extracted"), { recursive: true });
}
