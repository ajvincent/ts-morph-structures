import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet
} from "#utilities/source/BuildPromise.js";

import runESLint from "#utilities/source/runEslint.js";

import copySnapshot from "./pre-build/copySnapshot.js";
import structureToSyntax from "./build/structureToSyntax.js";
import doBundles from "./build/rollup/bundle.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting stage_3_integration:eslint");
    await runESLint(path.join(projectDir, "stage_3_integration"), [
      "buildStage.ts",
      "build/**/*.ts",
    ]);
  });
}

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_3_integration:copySnapshot");
    await copySnapshot();
  });
}

{ // structureToSyntax
  const target = BPSet.get("structureToSyntax");
  target.addTask(async () => {
    console.log("starting stage_3_integration:structureToSyntax");
    await structureToSyntax();
  });
}

{ // bundle
  const target = BPSet.get("bundle");
  target.addTask(async () => {
    console.log("starting stage_3_integration:bundle");
    await doBundles();
  });
}


BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("structureToSyntax");
  BPSet.main.addSubtarget("bundle");
  // at the end to allow for debugging before this
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
