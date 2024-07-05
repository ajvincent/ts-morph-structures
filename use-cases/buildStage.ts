import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runESLint from "#utilities/source/runEslint.js";

import buildStringStringMap from "./build/StringStringMap.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting use cases:eslint");
    await runESLint(path.join(projectDir, "use-cases"), [
      "buildStage.ts",
      "build/**/*.ts",
    ]);
  });
}

{ // use cases
  const target = BPSet.get("use cases");
  target.addTask(async () => {
    /* Do not use Promise.all() here or PromiseAllParallel, PromiseAllSequence.
    The intent of these modules is demonstration of ts-morph-structures, not efficiency or speed.
    */
    await buildStringStringMap();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("use cases");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();

export default Promise.resolve();
