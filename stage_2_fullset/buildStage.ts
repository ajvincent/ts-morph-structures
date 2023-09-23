import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
//import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";

import copySnapshot from "./build/copySnapshot.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage2_fullset:copySnapshot");
    await copySnapshot();
  });
}

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage2_fullset:jasmine");
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_two_test");
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_1_bootstrap:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("test");
}
await BPSet.main.run();
export default Promise.resolve();
