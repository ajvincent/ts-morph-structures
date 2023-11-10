import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import copySnapshot from "./build/copySnapshot.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_2_fullset:copySnapshot");
    await copySnapshot();
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_docs:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("build");
}
await BPSet.main.run();
export default Promise.resolve();
