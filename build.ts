import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import recursiveBuild from "#utilities/source/recursiveBuild.js";

const BPSet = new BuildPromiseSet;
{
  const target = BPSet.get("build:jasmine");

  target.addTask(() => {
    console.log("starting build:jasmine");
    return Promise.resolve();
  });

  target.addTask(async () => await runModule(
    "./node_modules/jasmine/bin/jasmine.js",
    [
      //"--parallel=auto",
      "--config=spec/support/jasmine.json",
    ]
  ));
}

{ // eslint
  const target = BPSet.get("build:eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("utilities/**/*.ts");
  args.push("build.ts");

  target.addTask(() => {
    console.log("starting build:eslint");
    return Promise.resolve();
  });

  target.addTask(
    async () => {
      await runModule("./node_modules/eslint/bin/eslint.js", args);
    }
  );
}

{ // stage 2
  const target = BPSet.get("stage_1_bootstrap");

  target.addTask(async () => {
    console.log("starting stage_1_bootstrap");
    await recursiveBuild("stage_1_bootstrap", "buildStage.ts");
    console.log("completed stage_1_bootstrap");
  });
}

{ // stage 2
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
  BPSet.main.addSubtarget("stage_2_fullset");
}
await BPSet.main.run();
