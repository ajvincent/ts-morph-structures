import path from "path";

import {
  VoidTypeNodeToTypeStructureConsole,
  getTypeAugmentedStructure,
} from "#stage_two/snapshot/dist/exports.js";

import getTS_SourceFile from "#utilities/source/getTS_SourceFile.js";

import {
  hashAllFiles
} from "#utilities/source/hash-all-files.js";

import {
  PathToAbsoluteDirectory,
  projectDir
} from "#utilities/source/AsyncSpecModules.js";

import readDirsDeep from "#utilities/source/readDirsDeep.js";

const stage_two_snapshot   = path.join(projectDir, "stage_2_snapshot/snapshot");
const stage_three_snapshot = path.join(projectDir, "stage_3_snapshot/snapshot");

/* This is a brute-force attempt to compare the snapshots we generate.  There are three levels of checks:
 * 1. Do we have the same file names?
 * 2. Do the files have the same source file structure?
 * 3. Do the files hash to exactly the same value?
 *
 * The second one is a strong dogfood test: it uses `getTypeAugmentedStructure` to build the structure,
 * then serializes it for comparison
 */

describe("File hashes match for the", () => {
  it("array utilities", async () => {
    await compareSnapshots("source/array-utilities");
  });

  it("base files", async () => {
    await compareSnapshots("source/base");
  });

  // disabled for the structureToSyntax.ts file, which is generated
  xit("bootstrap files", async () => {
    await compareSnapshots("source/bootstrap");
  });

  it("type structures", async () => {
    await compareSnapshots("source/structures/type");
  });

  it("toolbox", async () => {
    await compareSnapshots("source/toolbox");
  });
});

async function compareSnapshots(
  localPath: string
): Promise<void>
{
  const stage_two_dir = path.join(stage_two_snapshot, localPath);
  const stage_three_dir = path.join(stage_three_snapshot, localPath);

  const { files: stage_two_files }   = await readDirsDeep(stage_two_dir);
  const { files: stage_three_files } = await readDirsDeep(stage_three_dir);

  const diffFileNames = diffFileLists(
    stage_two_dir, stage_three_dir, stage_two_files, stage_three_files
  );
  expect(diffFileNames).withContext("file differences").toEqual([]);

  if (diffFileNames.length > 0)
    return;

  // eslint-disable-next-line no-constant-condition
  if (false) {
    const structureComparisons = compareFileStructures(
      {
        isAbsolutePath: true,
        pathToDirectory: stage_two_dir
      },
      {
        isAbsolutePath: true,
        pathToDirectory: stage_three_dir
      },
      stage_two_files,
      stage_three_files
    );

    let exactMatch = true;
    structureComparisons.forEach(([fileName, stage_two_structure, stage_three_structure]) => {
      expect(stage_three_structure).withContext(fileName + " structure").toEqual(stage_two_structure);
      if (JSON.stringify(stage_three_structure) !== JSON.stringify(stage_two_structure))
        exactMatch = false;
    });

    if (exactMatch as boolean === false)
      return;
  }

  const [
    stage_two_hashes,
    stage_three_hashes
  ] = await hashDirectories(stage_two_dir, stage_three_dir);
  const diffFileHashes = getArrayDiff(stage_two_hashes, stage_three_hashes);
  expect(diffFileHashes).withContext("file hashes").toEqual([]);
}

function diffFileLists(
  stage_two_dir: string,
  stage_three_dir: string,
  stage_two_files: readonly string[],
  stage_three_files: readonly string[]
): string[]
{
  stage_two_files = stage_two_files.map(f => path.relative(stage_two_dir, f));
  stage_three_files = stage_three_files.map(f => path.relative(stage_three_dir, f));

  return getArrayDiff(stage_two_files, stage_three_files);
}

async function hashDirectories(
  stage_two_dir: string,
  stage_three_dir: string,
): Promise<[readonly string[], readonly string[]]>
{
  const [stage_two_hash, stage_three_hash] = await Promise.all([
    hashAllFiles(stage_two_dir, true),
    hashAllFiles(stage_three_dir, true)
  ]);
  return [stage_two_hash.split("\n"), stage_three_hash.split("\n")];
}

function getArrayDiff(
  stage_two_list: readonly string[],
  stage_three_list: readonly string[],
): string[]
{
  const remainingInTwo = new Set<string>(stage_two_list);
  const remainingInThree = new Set<string>(stage_three_list);
  stage_three_list.forEach(f => remainingInTwo.delete(f));
  stage_two_list.forEach(f => remainingInThree.delete(f));

  const result: string[] = [
    ...Array.from(remainingInTwo).map(f => "-" + f),
    ...Array.from(remainingInThree).map(f => "+" + f)
  ];
  result.sort((a, b) => a.substring(1).localeCompare(b.substring(1)));
  return result;
}

function compareFileStructures(
  stage_two_dir: PathToAbsoluteDirectory,
  stage_three_dir: PathToAbsoluteDirectory,
  stage_two_files: readonly string[],
  stage_three_files: readonly string[]
): [string, object, object][]
{
  stage_two_files = stage_two_files.map(f => path.relative(stage_two_dir.pathToDirectory, f));
  stage_three_files = stage_three_files.map(f => path.relative(stage_three_dir.pathToDirectory, f));

  const stage_two_map = new Map(stage_two_files.map(
    f => getStructureEntryForFile(stage_two_dir, f))
  );
  const stage_three_map = new Map(stage_three_files.map(
    f => getStructureEntryForFile(stage_three_dir, f))
  );

  const fileStructureEntries: [string, object, object][] = [];
  stage_two_map.forEach((serialized_stage_two, fileName) => {
    const serialized_stage_three = stage_three_map.get(fileName)!;
    fileStructureEntries.push([
      fileName,
      serialized_stage_two,
      serialized_stage_three
    ]);
  });

  return fileStructureEntries;
}

function getStructureEntryForFile(
  startDir: PathToAbsoluteDirectory,
  pathToSourceFile: string
): [string, object]
{
  const sourceFile = getTS_SourceFile(
    startDir, pathToSourceFile
  );
  try {
    const structure = getTypeAugmentedStructure(
      sourceFile, VoidTypeNodeToTypeStructureConsole, true
    ).rootStructure;

    return [
      pathToSourceFile,
      JSON.parse(JSON.stringify(structure, null, 2)) as object
    ];
  }
  catch (ex) {
    const err = ex as Error;
    err.message = sourceFile.getFilePath() + ": " + err.message;
    throw err;
  }
}
