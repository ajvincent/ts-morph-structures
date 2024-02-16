import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import runJasmine from "#utilities/source/runJasmine.js";
import { runModule } from "#utilities/source/runModule.js";

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
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_two_test");
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
  //args.push("fixtures/**/*.ts");
  args.push("snapshot/**/*.ts");
  args.push("spec-snapshot/**/*.ts");

  target.addTask(() => {
    console.log("starting stage_2_snapshot:eslint");
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
    console.log("starting stage_2_bootstrap:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
