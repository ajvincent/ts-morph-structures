import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_1_bootstrap:test");
    await runModule(
      "../node_modules/jasmine/bin/jasmine.js",
      [
        //"--parallel=auto",
        "--config=./spec-snapshot/support/jasmine.json",
      ]
    );
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
    console.log("starting stage_1_bootstrap:build:test");
    await runModule(
      "../node_modules/jasmine/bin/jasmine.js",
      [
        //"--parallel=auto",
        "--config=./build/spec/support/jasmine.json",
      ],
      /*
      [
        "--inspect-brk",
      ]
      */
    )
  });

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_1_bootstrap:build");
    const support = (await import("./build/support.js")).default;
    await support();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("build");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
