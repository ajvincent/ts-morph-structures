import { performance } from "perf_hooks";

import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_1_bootstrap:test");
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_one_test");
  });
}

{ // eslint
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("build/**/*.ts");
  args.push("fixtures/**/*.ts");
  args.push("prototype-snapshot/**/*.ts");
  args.push("spec-snapshot/**/*.ts");

  target.addTask(() => {
    console.log("starting stage_1_bootstrap:eslint");
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
    console.log("starting stage_1_bootstrap:build:test");
    await runJasmine("./build/spec/support/jasmine.json", "stage_one_build");
  });

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_1_bootstrap:build");

    const start = performance.now();
    const support = (await import("./build/support.js")).default;
    await support();
    const end = performance.now();
    console.log(`actual build time: ${end - start}ms`);
  });
}

{
  // done
  const target = BPSet.get("done");
  target.addTask((): Promise<void> => {
    console.log("done with stage 1!");
    return Promise.resolve();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("build");
  BPSet.main.addSubtarget("eslint");
  BPSet.main.addSubtarget("done");
}
await BPSet.main.run();

//process.exit(0);

export default Promise.resolve();
