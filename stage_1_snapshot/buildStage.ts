import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";
import runJasmine from "#utilities/source/runJasmine.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(async () => {
    console.log("starting stage_1_snapshot:test");
    await runJasmine("./spec-snapshot/support/jasmine.json", "stage_one_test");
  });
}

{ // eslint
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("fixtures/**/*.ts");
  args.push("prototype-snapshot/**/*.ts");
  args.push("spec-snapshot/**/*.ts");

  target.addTask(() => {
    console.log("starting stage_1_snapshot:eslint");
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
