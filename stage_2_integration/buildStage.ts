import path from "node:path";

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

import {
  BuildPromiseSet,
} from "#utilities/source/BuildPromise.js";

import runESLint from "#utilities/source/runEslint.js";

import copySnapshot from "./build/copySnapshot.js";
import structureToSyntax from "./build/structureToSyntax.js";
import compileTypeDeclarations from "./build/docs/typeDeclarations.js";
import doBundles from "./build/rollup/bundle.js";
import runAPIExtractor from "./build/docs/runAPIExtractor.js";
import applyDecoratorsForDocModel from "./build/docs/decoratorsInDocModel.js";
import runAPIDocumenter from "./build/docs/runAPIDocumenter.js";

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");
  target.addTask(async () => {
    console.log("starting stage_2_integration:eslint");
    await runESLint(path.join(projectDir, "stage_2_integration"), [
      "buildStage.ts",
      "build/**/*.ts",
    ]);
  });
}

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_2_integration:copySnapshot");
    await copySnapshot();
  });
}

{ // structureToSyntax
  const target = BPSet.get("structureToSyntax");
  target.addTask(async () => {
    console.log("starting stage_2_integration:structureToSyntax");
    await structureToSyntax();
  });
}

{ // bundle
  const target = BPSet.get("bundle");
  target.addTask(async () => {
    console.log("starting stage_2_integration:bundle");
    await doBundles();
  });
}

{ // docs
  const target = BPSet.get("docs");
  target.addTask(async () => {
    console.log("starting stage_2_integration:docs");
    await compileTypeDeclarations();
    await applyDecoratorsForDocModel();
    console.log("Running API Extractor...");
    await runAPIExtractor();
    await runAPIDocumenter();
    console.log("cwd: " + process.cwd());
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("structureToSyntax");
  BPSet.main.addSubtarget("bundle");
  BPSet.main.addSubtarget("docs");
  // at the end to allow for debugging before this
  BPSet.main.addSubtarget("eslint");
}
await BPSet.main.run();
export default Promise.resolve();
