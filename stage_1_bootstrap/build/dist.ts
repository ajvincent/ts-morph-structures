// #region preamble
import fs from "fs/promises";
import path from "path";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import runPrettify from "#utilities/source/runPrettify.js";

import {
  stageDir,
} from "./constants.js";

import BuildClassesDriver from "./BuildClassesDriver.js";
import TSDocMap from "./structureMeta/TSDocMap.js";
import reportTSDocsCoverage from "#stage_one/coverage/tsdocs.js";
import { PromiseAllParallel } from "#utilities/source/PromiseTypes.js";

const sourceUtilitiesDir = pathToModule(stageDir, "build/utilities/public");

const distDir = pathToModule(stageDir, "dist");
const distToolboxDir = path.join(distDir, "source", "toolbox");

// #endregion preamble

async function cleanDist(): Promise<void>
{
  let found = false;
  try {
    await fs.access(distDir);
    found = true;
  }
  catch {
    // do nothing
  }
  if (found)
    await fs.rm(distDir, { recursive: true });
}

export default async function buildDist(): Promise<void>
{
  await cleanDist();

  await fs.mkdir(distDir, { recursive: true });
  await fs.cp(
    pathToModule(stageDir, "source"),
    path.join(distDir, "source"),
    { recursive: true }
  );

  await Promise.all([
    fixPrototypeExportsAndTypeStructureImpl(distDir, "base/TypeAccessors.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "base/TypeStructureSet.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "typeStructures/MemberedObjectTypeStructureImpl.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "typeStructures/InferTypeStructureImpl.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "typeStructures/MappedTypeStructureImpl.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "typeStructures/TypeStructuresWithTypeParameters.ts"),
    fixPrototypeExportsAndTypeStructureImpl(distDir, "types/TypeAndTypeStructureInterfaces.d.ts"),
  ]);

  await fs.mkdir(distToolboxDir, { recursive: true });
  const files = (await fs.readdir(sourceUtilitiesDir)).filter(value => value.endsWith(".ts")).map(
    file => path.join(sourceUtilitiesDir, file)
  );
  await PromiseAllParallel(files, exportPublicUtility);

  await BuildClassesDriver(distDir);
  {
    const results = TSDocMap.toJSON();
    await fs.mkdir(path.join(distDir, "coverage"));
    await fs.writeFile(path.join(distDir, "coverage/tsdocs.json"), JSON.stringify(results, null, 2), { encoding: "utf-8" });
    reportTSDocsCoverage(true, results);
  }

  await runPrettify(distDir);
}

async function fixPrototypeExportsAndTypeStructureImpl(
  distDir: string,
  pathUnderSource: string,
): Promise<void>
{
  const modulePath = path.join(distDir, "source", pathUnderSource);
  let contents: string = await fs.readFile(modulePath, { encoding: "utf-8" });
  contents = contents.replace(/#stage_one\/prototype-snapshot\//g, "../");
  contents = contents.replace(/TypedStructureImpl/g, "TypeStructureImpl");
  await fs.writeFile(modulePath, contents, { encoding: "utf-8" });
}

async function exportPublicUtility(
  pathToSourceFile: string,
): Promise<void>
{
  let contents = await fs.readFile(pathToSourceFile, { encoding: "utf-8" });
  contents = contents.replace(
    "#stage_one/prototype-snapshot/",
    "../"
  );
  const pathToDestFile = pathToSourceFile.replace(sourceUtilitiesDir, distToolboxDir);
  await fs.writeFile(pathToDestFile, contents, { encoding: "utf-8" });
}
