import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import copySnapshot from "./build/copySnapshot.js";
import structureToSyntax from "./build/structureToSyntax.js";
import doBundles from "./build/bundle.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_2_integration:copySnapshot");
    await copySnapshot();
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_integration:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

{ // structureToSyntax
  const target = BPSet.get("structureToSyntax");
  target.addTask(async () => {
    console.log("starting stage_2_integration:structureToSyntax");
    await structureToSyntax();
  });
}

{ // bundle
  const target = BPSet.get("bundle");
  target.addTask(async () => {
    console.log("starting stage_2_integration:bundle");
    await doBundles();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("build");
  BPSet.main.addSubtarget("structureToSyntax");
  BPSet.main.addSubtarget("bundle");
}
await BPSet.main.run();
export default Promise.resolve();
