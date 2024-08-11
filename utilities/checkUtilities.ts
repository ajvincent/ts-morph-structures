import path from "node:path";

import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import runJasmine from "#utilities/source/runJasmine.js";
import runESLint from "./source/runEslint.js";

import {
  projectDir,
} from "./source/AsyncSpecModules.js";

const BPSet = new BuildPromiseSet;

// #region utilities
{ // utilities:jasmine
  const target = BPSet.get("utilities:jasmine");

  target.addTask(async () => {
    console.log("starting utilities:jasmine");
    await runJasmine("./spec/support/jasmine.json", "build");
  });
}

{ // utilities:eslint
  const target = BPSet.get("utilities:eslint");
  target.addTask(async () => {
    console.log("starting utilities:eslint");
    await runESLint(path.join(projectDir, "utilities"), [
      "**/*.ts",
      //"../build.ts",
    ]);
  });
}

BPSet.markReady();
BPSet.main.addSubtarget("utilities:jasmine");
BPSet.main.addSubtarget("utilities:eslint");

await BPSet.main.run();
