import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";
import recursiveBuild from "#utilities/source/recursiveBuild.js";

const BPSet = new BuildPromiseSet;

// #region build
{ // build
  const target = BPSet.get("build");
  target.addSubtarget("build:jasmine");
  target.addSubtarget("build:eslint");
}

{ // build:jasmine
  const target = BPSet.get("build:jasmine");

  target.addTask(async () => {
    console.log("starting build:jasmine");
    await runJasmine("./spec/support/jasmine.json", "build");
  });
}

{ // build:eslint
  const target = BPSet.get("build:eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("utilities/**/*.ts");
  args.push("build.ts");

  target.addTask(async () => {
    console.log("starting build:eslint");
    await runModule("./node_modules/eslint/bin/eslint.js", args);
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

BPSet.markReady();
{
  BPSet.main.addSubtarget("build");
  BPSet.main.addSubtarget("stage_0_references");
  BPSet.main.addSubtarget("stage_1_snapshot");
  BPSet.main.addSubtarget("stage 2");
  BPSet.main.addSubtarget("stage 3");
}
await BPSet.main.run();
