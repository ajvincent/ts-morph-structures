import {
  BuildPromiseSet
} from "#utilities/source/BuildPromise.js";

import {
  runModule
} from "#utilities/source/runModule.js";

import copySnapshot from "./build/copySnapshot.js";
import structureToSyntax from "./build/structureToSyntax.js";
/*
import compileTypeDefinitions from "./build/typedefs.js";
import doBundles from "./build/bundle.js";
import runAPIExtractor from "./build/runAPIExtractor.js";
import applyDecoratorsForDocModel from "./build/decoratorsInDocModel.js";
import runAPIDocumenter from "./build/runAPIDocumenter.js";
*/

const BPSet = new BuildPromiseSet;

{ // eslint
  const target = BPSet.get("eslint");

  const args = [
    "-c", "./.eslintrc.json",
    "--max-warnings=0",
  ];

  args.push("buildStage.ts");
  args.push("build/**/*.ts");

  target.addTask(
    async () => {
      console.log("starting stage_3_integration:eslint");
      await runModule("../node_modules/eslint/bin/eslint.js", args);
    }
  );
}

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_3_integration:copySnapshot");
    await copySnapshot();
  });
}

{ // structureToSyntax
  const target = BPSet.get("structureToSyntax");
  target.addTask(async () => {
    console.log("starting stage_3_integration:structureToSyntax");
    await structureToSyntax();
  });
}

/*
{ // bundle
  const target = BPSet.get("bundle");
  target.addTask(async () => {
    console.log("starting stage_3_integration:bundle");
    await doBundles();
  });
}

{ // docs
  const target = BPSet.get("docs");
  target.addTask(async () => {
    console.log("starting stage_3_integration:docs");
    await compileTypeDefinitions();
    await applyDecoratorsForDocModel();
    console.log("Running API Extractor...");
    await runAPIExtractor();
    await runAPIDocumenter();
  });
}
*/

BPSet.markReady();
{
  BPSet.main.addSubtarget("eslint");
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("structureToSyntax");
  /*
  BPSet.main.addSubtarget("bundle");
  BPSet.main.addSubtarget("docs");
  */
}
await BPSet.main.run();
export default Promise.resolve();
