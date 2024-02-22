import { performance } from "perf_hooks";

import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("build/**/*.ts");
  args.push("moduleClasses/**/*.ts");

  target.addTask(() => {
    console.log("starting stage_3_generation:eslint");
    return Promise.resolve();
  });

  target.addTask(
    async () => {
      await runModule("../node_modules/eslint/bin/eslint.js", args);
    }
  );
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_3_generation:build:test");
    await runJasmine("./build/spec/support/jasmine.json", "stage_one_build");
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
