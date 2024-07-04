import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runJasmine from "#utilities/source/runJasmine.js";
import runESLint from "#utilities/source/runEslint.js";

import copySnapshot from "./build/copySnapshot.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_2_snapshot:copySnapshot");
    await copySnapshot();
  });
}

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_2_snapshot:jasmine");
    console.log("cwd: " + process.cwd());
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_two_test");
  });
}

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting stage_2_snapshot:eslint");
    await runESLint(path.join(projectDir, "stage_2_snapshot"), [
      "buildStage.ts",
      "build/**/*.ts",
      // "fixtures/**/*.ts"
      "snapshot/**/*.ts",
      "spec-snapshot/**/*.ts",
    ]);
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_bootstrap:build");
    const support = (await import("./build/support.js")).default;
    await support();
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
