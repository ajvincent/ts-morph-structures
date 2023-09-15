import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(() => {
    console.log("starting stage_1_bootstrap:test");
    return Promise.resolve();
  });

  target.addTask(async () => await runModule(
    "../node_modules/jasmine/bin/jasmine.js",
    [
      //"--parallel=auto",
      "--config=./spec-snapshot/support/jasmine.json",
    ]
  ));
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
    console.log("starting stage_1_bootstrap:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("eslint");
  BPSet.main.addSubtarget("build");
}
await BPSet.main.run();
export default Promise.resolve();
