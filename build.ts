import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

const BPSet = new BuildPromiseSet;
{ // test
  const target = BPSet.get("test");

  target.addTask(() => {
    console.log("starting jasmine");
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
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("utilities/**/*.ts");
  args.push("build.ts");

  target.addTask(() => {
    console.log("starting eslint");
    return Promise.resolve();
  });

  target.addTask(
    async () => {
      await runModule("./node_modules/eslint/bin/eslint.js", args);
    }
  );
}

{ // stage 2
  const target = BPSet.get("stage_2_fullset");

  target.addTask(() => {
    console.log("starting stage_2_fullset");
    return Promise.resolve();
  });

  target.addTask(
    async () => {
      await import("./stage_2_fullset/build.js");
    }
  );
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
  BPSet.main.addSubtarget("eslint");
  BPSet.main.addSubtarget("stage_2_fullset");
}
await BPSet.main.run();
