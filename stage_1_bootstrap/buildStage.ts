import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(() => {
    console.log("starting stage_1_bootstrap:jasmine");
    return Promise.resolve();
  });

  target.addTask(async () => await runModule(
    "../node_modules/jasmine/bin/jasmine.js",
    [
      //"--parallel=auto",
      "--config=./spec/support/jasmine.json",
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
  args.push("spec/**/*.ts");

  target.addTask(() => {
    console.log("starting build:eslint");
    return Promise.resolve();
  });

  target.addTask(
    async () => {
      await runModule("../node_modules/eslint/bin/eslint.js", args);
    }
  );
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
