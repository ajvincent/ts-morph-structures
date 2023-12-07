import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";
import recursiveBuild from "#utilities/source/recursiveBuild.js";

const BPSet = new BuildPromiseSet;
{
  const target = BPSet.get("build:jasmine");

  target.addTask(async () => {
    console.log("starting build:jasmine");
    await runJasmine("./spec/support/jasmine.json", "build");
  });
}

{ // eslint
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

{ // stage 1
  const target = BPSet.get("stage_1_bootstrap");

  target.addTask(async () => {
    console.log("starting stage_1_bootstrap");
    await recursiveBuild("stage_1_bootstrap", "buildStage.ts");
    console.log("completed stage_1_bootstrap");
  });
}

{ // stage 1 integration
  const target = BPSet.get("stage_1_integration");

  target.addTask(async () => {
    console.log("starting stage_1_integration");
    await recursiveBuild("stage_1_integration", "buildStage.ts");
    console.log("completed stage_1_integration");
  });
}


{ // stage 2 full set
  const target = BPSet.get("stage_2_fullset");

  target.addTask(async () => {
    console.log("starting stage_2_fullset");
    await recursiveBuild("stage_2_fullset", "buildStage.ts");
    console.log("completed stage_2_fullset");
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("build:jasmine");
  BPSet.main.addSubtarget("build:eslint");
  BPSet.main.addSubtarget("stage_1_bootstrap");
  BPSet.main.addSubtarget("stage_1_integration");
  BPSet.main.addSubtarget("stage_2_fullset");
}
await BPSet.main.run();
