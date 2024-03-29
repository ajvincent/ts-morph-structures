import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import runJasmine from "#utilities/source/runJasmine.js";
import { runModule } from "#utilities/source/runModule.js";

import copySnapshot from "./build/copySnapshot.js";

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

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("build/**/*.ts");
  //args.push("fixtures/**/*.ts");
  //args.push("snapshot/**/*.ts");
  args.push("spec-snapshot/**/*.ts");

  target.addTask(
    async () => {
      console.log("starting stage_3_snapshot:eslint");
      await runModule("../node_modules/eslint/bin/eslint.js", args);
    }
  );
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
