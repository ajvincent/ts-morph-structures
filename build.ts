import { env } from "process";

import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import recursiveBuild from "#utilities/source/recursiveBuild.js";

const BPSet = new BuildPromiseSet;

// #region utilities
{ // utilities
  const target = BPSet.get("utilities");
  target.addTask(async () => {
    await recursiveBuild("utilities", "checkUtilities.ts");
  });
}

// #endregion build

{ // stage 0 references
  const target = BPSet.get("stage_0_references");

  target.addTask(async () => {
    console.log("starting stage_0_references");
    await recursiveBuild("stage_0_references", "buildStage.ts");
    console.log("completed stage_0_references");
  });
}

{ // stage 1 snapshot
  const target = BPSet.get("stage_1_snapshot");

  target.addTask(async () => {
    console.log("starting stage_1_snapshot");
    await recursiveBuild("stage_1_snapshot", "buildStage.ts");
    console.log("completed stage_1_snapshot");
  });
}

// #region stage 2
{
  const target = BPSet.get("stage 2");
  target.addSubtarget("stage_2_generation");
  target.addSubtarget("stage_2_integration");
  target.addSubtarget("stage_2_snapshot");
}

{
  const target = BPSet.get("stage_2_generation");
  target.addTask(async () => {
    console.log("starting stage_2_generation");
    await recursiveBuild("stage_2_generation", "buildStage.ts");
    console.log("completed stage_2_generation");
  });
}

{
  const target = BPSet.get("stage_2_integration");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_integration");
    await recursiveBuild("stage_2_integration", "buildStage.ts");
    console.log("completed stage_2_integration");
  });
}

{ // stage 2 snapshot
  const target = BPSet.get("stage_2_snapshot");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_snapshot");
    await recursiveBuild("stage_2_snapshot", "buildStage.ts");
    console.log("completed stage_2_snapshot");
  });
}
// #endregion stage 2

// #region stage 3
{
  const target = BPSet.get("stage 3");
  target.addSubtarget("stage_3_generation");
  target.addSubtarget("stage_3_integration");
  target.addSubtarget("stage_3_snapshot");
}

{
  const target = BPSet.get("stage_3_generation");
  target.addTask(async () => {
    console.log("starting stage_3_generation");
    await recursiveBuild("stage_3_generation", "buildStage.ts");
    console.log("completed stage_3_generation");
  });
}

{
  const target = BPSet.get("stage_3_integration");
  target.addTask(async (): Promise<void> => {
    console.log("starting stage_3_integration");
    await recursiveBuild("stage_3_integration", "buildStage.ts");
    console.log("completed stage_3_integration");
  });
}

{
  const target = BPSet.get("stage_3_snapshot");
  target.addTask(async (): Promise<void> => {
    console.log("starting stage_3_snapshot");
    await recursiveBuild("stage_3_snapshot", "buildStage.ts");
    console.log("completed stage_3_snapshot");
  });
}
// #endregion stage 3

// use cases
{
  const target = BPSet.get("use-cases");
  target.addTask(async (): Promise<void> => {
    console.log("starting use cases");
    await recursiveBuild("use-cases", "buildStage.ts");
    console.log("completed use cases");
  });
}

BPSet.markReady();
{
  if ((env.TSMS_STAGE === undefined) || (env.TSMS_STAGE === "one")) {
    BPSet.main.addSubtarget("utilities");
    BPSet.main.addSubtarget("stage_0_references");
    BPSet.main.addSubtarget("stage_1_snapshot");
  }
  if ((env.TSMS_STAGE === undefined) || (env.TSMS_STAGE === "two")) {
    BPSet.main.addSubtarget("stage 2");
  }
  if ((env.TSMS_STAGE === undefined) || (env.TSMS_STAGE === "three")) {
    BPSet.main.addSubtarget("stage 3");
  }
  if ((env.TSMS_STAGE === undefined) || (env.TSMS_STAGE === "use-cases")) {
    BPSet.main.addSubtarget("use-cases");
  }
}
await BPSet.main.run();
