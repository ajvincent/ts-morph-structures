import fs from "fs/promises";
import path from "path";
import {
  SourceFile
} from "ts-morph";

import {
  performance
} from "perf_hooks";

import type {
  NodeWithStructures
} from "./_types/NodeWithStructures.js";

import {
  type ModuleSourceDirectory,
  projectDir
} from "./AsyncSpecModules.js";

import getTS_SourceFile from "./getTS_SourceFile.js";

const TYPESCRIPT_LIBS: ModuleSourceDirectory = {
  isAbsolutePath: true,
  pathToDirectory: path.join(projectDir, "node_modules/typescript/lib")
};

const start = performance.now();
const files = (await fs.readdir(TYPESCRIPT_LIBS.pathToDirectory)).filter(f => /^lib\..*\.d.ts$/.test(f));
const sourceFiles: SourceFile[] = files.map(
  file => getTS_SourceFile(TYPESCRIPT_LIBS, file)
);
const end = performance.now();
console.log("time to load TypeScript lib files: " + (end - start) + "ms");

export default function getTypeScriptNodes<
  NodeKind extends NodeWithStructures
>
(
  callback: (sourceFile: SourceFile) => NodeKind[]
): [string, NodeKind][]
{
  return sourceFiles.map(
    sourceFile => processSourceFile(sourceFile, callback)
  ).flat();
}

function processSourceFile<
  NodeKind extends NodeWithStructures
>
(
  sourceFile: SourceFile,
  callback: (sourceFile: SourceFile) => NodeKind[]
): [string, NodeKind][]
{
  const nodes = callback(sourceFile);
  const pathToSourceFile = sourceFile.getFilePath();
  return nodes.map(node => [pathToSourceFile, node]);
}
