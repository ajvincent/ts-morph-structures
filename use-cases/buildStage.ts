import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

import buildStringStringMap from "./build/StringStringMap.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("build/**/*.ts");

  target.addTask(async () => {
    console.log("starting use cases:eslint");
    await runModule("../node_modules/eslint/bin/eslint.js", args);
  });
}

{ // use cases
  const target = BPSet.get("use cases");
  target.addTask(async () => {
    /* Do not use Promise.all() here or PromiseAllParallel, PromiseAllSequence.
    The intent of these modules is demonstration of ts-morph-structures, not efficiency or speed.
    */
    await buildStringStringMap();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("use cases");
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();

export default Promise.resolve();
