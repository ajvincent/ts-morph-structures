import fs from "fs/promises";
import path from "path";

import {
  ModuleKind,
  ModuleResolutionKind,
  Node,
  Project,
  ProjectOptions,
  ScriptTarget,
  StructureKind,
  Structures,
  SyntaxKind,
} from "ts-morph";

import {
  ModuleSourceDirectory,
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

import {
  PromiseAllParallel
} from "#utilities/source/PromiseTypes.js";

import {
  StructureKindToSyntaxKindMap,
  structureToNodeMap,
  structureImplToNodeMap,
} from "#stage_two/snapshot/source/internal-exports.js";

async function getSupportedKindSet(): Promise<Set<StructureKind>> {
  const stageDir: ModuleSourceDirectory = {
    pathToDirectory: "#stage_two",
    isAbsolutePath: true
  };

  const pathToStructuresDir = pathToModule(stageDir, "snapshot/source/structures/standard");

  const moduleList = (await fs.readdir(pathToStructuresDir)).filter(
    fileName => fileName.endsWith("Impl.ts")
  );

  const StructureKindRE = /StructureKind\.([A-Za-z]+)/g;

  const KindList: StructureKind[] = await PromiseAllParallel(moduleList, async leafName => {
    const fileToRead = path.join(pathToStructuresDir, leafName);
    const contents = await fs.readFile(fileToRead, { encoding: "utf-8" });
    const match = contents.match(StructureKindRE)!
    return StructureKind[match[0].replace("StructureKind.", "") as keyof typeof StructureKind];
  });

  return new Set(KindList);
}
const remainingKeysBase = await getSupportedKindSet();

// no syntax kind for this, so unsupported
remainingKeysBase.delete(StructureKind.JSDocTag);

const TSC_CONFIG: ProjectOptions = {
  "compilerOptions": {
    "lib": ["es2022"],
    "module": ModuleKind.ESNext,
    "target": ScriptTarget.ESNext,
    "moduleResolution": ModuleResolutionKind.NodeNext,
    "sourceMap": false,
    "declaration": false,
  },
  skipAddingFilesFromTsConfig: true,
};

const project = new Project(TSC_CONFIG);

const fixturesDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../../../../fixtures"
};

it("structureToNodeMap returns an accurate Map<Structure, Node>", () => {
  const remainingKeys = new Set(remainingKeysBase);
  function checkMap(
    relativePathToModuleFile: string,
    hashNeedle?: string
  ): void
  {
    const pathToModuleFile = pathToModule(fixturesDir, relativePathToModuleFile);
    project.addSourceFileAtPath(pathToModuleFile);
    const sourceFile = project.getSourceFileOrThrow(pathToModuleFile);

    let map: ReadonlyMap<Structures, Node>;
    try {
      map = structureToNodeMap(sourceFile, false, hashNeedle);
    }
    catch (ex) {
      console.log(pathToModuleFile);
      throw ex;
    }
    map.forEach((node, structure) => {
      expect(Node.hasStructure(node)).withContext(relativePathToModuleFile).toBe(true);
      if (Node.hasStructure(node)) {
        expect<Structures>(node.getStructure()).withContext(
          `at ${pathToModuleFile}#${sourceFile.getLineAndColumnAtPos(node.getPos()).line}`
        ).toEqual(structure);
      }
      remainingKeys.delete(structure.kind);
    });

    const mapWithTypes = structureImplToNodeMap(sourceFile);
    expect(mapWithTypes.size).withContext(relativePathToModuleFile).toBe(map.size);
  }

  checkMap("ecma_references/classDecorators.ts");
  checkMap("ecma_references/NumberStringClass.ts");
  checkMap("stage_utilities/assert.ts");
  checkMap("stage_utilities/DefaultMap.ts");
  checkMap("stage_utilities/PromiseTypes.ts");
  checkMap("stage_utilities/PropertyKeySorter.ts");
  checkMap("stage_utilities/WeakRefSet.ts");
  checkMap("exportPromise.ts");
  checkMap("grab-bag.ts");

  // Unreachable structure kinds via sourceFile.getStructure(), as of ts-morph 22.0.0
  {
    expect(remainingKeys.has(StructureKind.PropertyAssignment)).toBe(true);
    remainingKeys.delete(StructureKind.PropertyAssignment);

    expect(remainingKeys.has(StructureKind.SpreadAssignment)).toBe(true);
    remainingKeys.delete(StructureKind.SpreadAssignment);

    expect(remainingKeys.has(StructureKind.ShorthandPropertyAssignment)).toBe(true);
    remainingKeys.delete(StructureKind.ShorthandPropertyAssignment);
  }

  /* ImportAttribute shows up as AssertEntry in the StructureKind enum due to a conflict
     and is still experimental, per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
     For that reason, I'm not going to support it right now (2024-01-12).
  */
  expect(remainingKeys.has(StructureKind.ImportAttribute)).withContext("ImportAttibute").toBe(true);
  remainingKeys.delete(StructureKind.ImportAttribute);

  let remainingKinds = Array.from(remainingKeys.keys()).map(
    (kind) => StructureKind[kind] + ": " + SyntaxKind[StructureKindToSyntaxKindMap.get(kind)!]
  );
  remainingKinds = remainingKinds.filter(kind => !kind.startsWith("Jsx"));
  remainingKinds.sort();

  expect(remainingKinds).withContext("we didn't find examples of these kinds in the fixtures").toEqual([]);
});
