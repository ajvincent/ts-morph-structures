import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runJasmine from "#utilities/source/runJasmine.js";
import runESLint from "#utilities/source/runEslint.js";

import copySnapshot from "./pre-build/copySnapshot.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_3_snapshot:copySnapshot");
    await copySnapshot();
  });
}

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_3_snapshot:jasmine");
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_three_test");
  });
}

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting stage_3_snapshot:eslint");
    await runESLint(path.join(projectDir, "stage_3_snapshot"), [
      "buildStage.ts",
      "build/**/*.ts",
      "spec-snapshot/**/*.ts",
    ]);
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("test");
  // at the end to allow for debugging before this
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
