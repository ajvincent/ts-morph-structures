import fs from "fs/promises";
import path from "path";

import {
  type SourceFile
} from "ts-morph";

import {
  NodeWithStructures,
  project,
  projectDir,
} from "./sharedProject.js";

const TYPESCRIPT_LIBS = path.join(projectDir, "node_modules/typescript/lib");
const fileNames = (await fs.readdir(TYPESCRIPT_LIBS)).filter(f => /^lib\..*\.d.ts$/.test(f)).map(f => path.join(TYPESCRIPT_LIBS, f));
const sourceFiles: readonly SourceFile[] = project.addSourceFilesAtPaths(fileNames);

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
