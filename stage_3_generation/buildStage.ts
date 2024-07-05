import path from "node:path";

import {
  performance,
} from "perf_hooks";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runJasmine from "#utilities/source/runJasmine.js";
import runESLint from "#utilities/source/runEslint.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting stage_3_generation:eslint");
    await runESLint(path.join(projectDir, "stage_3_generation"), [
      "buildStage.ts",
      "build/**/*.ts",
      "moduleClasses/**/*.ts",
      "pseudoStatements/**/*.ts",
      "vanilla/**/*.ts",
    ]);
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_3_generation:build:test");
    await runJasmine("./build/spec/support/jasmine.json", "stage_three_generation_test");
  });

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_3_generation:build");

    const start = performance.now();
    const support = (await import("./build/support.js")).default;
    await support();
    const end = performance.now();
    console.log(`actual build time: ${end - start}ms`);
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("build");
  // at the end to allow for debugging before this
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();

export default Promise.resolve();
