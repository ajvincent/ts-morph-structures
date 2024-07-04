import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runJasmine from "#utilities/source/runJasmine.js";
import runESLint from "#utilities/source/runEslint.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_1_snapshot:test");
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_one_test");
  });
}

{ // eslint
  const target = BPSet.get("eslint");

  target.addTask(async () => {
    console.log("starting stage_1_snapshot:eslint");
    await runESLint(path.join(projectDir, "stage_1_snapshot"), [
      "buildStage.ts",
      "fixtures/**/*.ts",
      "prototype-snapshot/**/*.ts",
      "spec-snapshot/**/*.ts",
    ]);
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();

export default Promise.resolve();
