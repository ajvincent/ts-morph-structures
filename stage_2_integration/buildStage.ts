import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import copySnapshot from "./build/copySnapshot.js";
import structureToSyntax from "./build/structureToSyntax.js";
import compileTypeDefinitions from "./build/typedefs.js";
import doBundles from "./build/bundle.js";
import runAPIExtractor from "./build/runAPIExtractor.js";
import applyDecoratorsForDocModel from "./build/decoratorsInDocModel.js";
import runAPIDocumenter from "./build/runAPIDocumenter.js";

const BPSet = new BuildPromiseSet;

{  // copySnapshot
  const target = BPSet.get("copySnapshot");
  target.addTask(async () => {
    console.log("starting stage_2_integration:copySnapshot");
    await copySnapshot();
  });
}

{ // build
  const target = BPSet.get("build");

  target.addTask(async (): Promise<void> => {
    console.log("starting stage_2_integration:build");
    const support = (await import("./build/support.js")).default;
    await support();
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
    await compileTypeDefinitions();
    await applyDecoratorsForDocModel();
    console.log("Running API Extractor...");
    await runAPIExtractor();
    await runAPIDocumenter();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("copySnapshot");
  BPSet.main.addSubtarget("build");
  BPSet.main.addSubtarget("structureToSyntax");
  BPSet.main.addSubtarget("bundle");
  BPSet.main.addSubtarget("docs");
}
await BPSet.main.run();
export default Promise.resolve();
