import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import structureToNodeMap, {
  type NodeWithStructures
} from "../source/bootstrap/structureToNodeMap.js";

import {
  type ModuleSourceDirectory,
} from "#utilities/source/AsyncSpecModules.js";

import {
  StructureKind,
} from "ts-morph";

const stageDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../.."
};

export default function driver(pathToFile: string): void {
  const sourceFile = getTS_SourceFile(stageDir, pathToFile);

  const nodesWithRootStructures = new Set<NodeWithStructures>;
  nodesWithRootStructures.add(sourceFile);

  const parsedData = structureToNodeMap(sourceFile, true);
  for (const [structure, node] of parsedData.entries()) {
    console.log(StructureKind[structure.kind], sourceFile.getLineAndColumnAtPos(node.getPos()))
  }
}
