/**
 * @privateRemarks
 *
 * This is throw-away code to migrate source code from es-membrane here.
 */

import fs from "fs/promises";
import path from "path";
import url from "url";
import readDirsDeep from "./readDirsDeep.js";
import { PromiseAllParallel } from "./PromiseTypes.js";

let found = false;
const generatedDir = path.normalize(
  path.join(url.fileURLToPath(import.meta.url), "../../..", "stage_1_bootstrap")
);

try {
  await fs.access(generatedDir);
  found = true;
}
catch {
  // do nothing
}
if (found)
  await fs.rm(generatedDir, { recursive: true });

await fs.cp(
  path.join(process.argv[process.argv.length - 1], "_03_ts-morph_structures"),
  generatedDir,
  {
    recursive: true
  }
);

let { files } = await readDirsDeep(generatedDir);
files = files.filter(f => f.endsWith(".mts"));

const stageDir = path.join(generatedDir);
const exportsFile = path.join(generatedDir, "exports.ts");

await PromiseAllParallel(files, async (oldName): Promise<void> => {
  const newName = oldName.replace(/\.mts$/, ".ts");
  await fs.rename(oldName, newName);

  let contents = await fs.readFile(newName, { encoding: "utf-8" });
  contents = contents.replace(/\.mjs/gm, ".js");

  const targetDirPath = path.relative(path.dirname(newName), stageDir)
  contents = contents.replace(
    /#ts-morph_structures\/source/g,
    path.join(targetDirPath, "prototype-snapshot")
  );
  contents = contents.replace(
    /#ts-morph_structures/g,
    targetDirPath
  );
  contents = contents.replace(
    /#stage_utilities\/source\/types\//g,
    "#utilities/source/_types/"
  );
  contents = contents.replace(
    /#stage_utilities\//g,
    "#utilities/"
  );

  if (newName === exportsFile) {
    contents = contents.replace(/\.\/source/g, "./prototype-snapshot");
  }

  await fs.writeFile(newName, contents, { encoding: "utf-8" });
});

await fs.rename(
  path.join(generatedDir, "source"),
  path.join(generatedDir, "prototype-snapshot")
);

await fs.cp(
  path.join(process.argv[process.argv.length - 1], "_01_stage_utilities/source/types/Utility.d.mts"),
  path.join(generatedDir, "../utilities/source/_types/Utility.d.ts")
);

await fs.cp(
  path.join(process.argv[process.argv.length - 1], "_01_stage_utilities/source/AsyncSpecModules.mts"),
  path.join(generatedDir, "../utilities/source/AsyncSpecModules.ts")
);

{
  const oldName = path.join(process.argv[process.argv.length - 1], "_01_stage_utilities/source/getTS_SourceFile.mts");
  const newName = path.join(generatedDir, "../utilities/source/getTS_SourceFile.ts");

  let contents = await fs.readFile(oldName, { encoding: "utf-8" });
  contents = contents.replace(/\.mjs/gm, ".js");

  await fs.writeFile(newName, contents, { encoding: "utf-8" });
}
