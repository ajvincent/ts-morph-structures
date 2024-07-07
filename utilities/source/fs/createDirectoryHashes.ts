import fs from "fs";
import path from "path";

import {
  hashContents
} from "#utilities/source/hash-all-files.js";

import readDirsDeepRelative from "./readDirsDeepRelative.js";

import {
  PromiseAllParallel
} from "#utilities/source/PromiseTypes.js";

export interface HashTree {
  dirs: string[];
  fileHashes: Record<string, string>;
}

export default async function createDirectoryHashes(
  fileSystem: typeof fs["promises"],
  rootDirPath: string
): Promise<HashTree>
{
  const pathToDirectoryHashes = path.join(rootDirPath, "directoryHashes.json");
  try {
    const hashRaw: string = await fileSystem.readFile(pathToDirectoryHashes, { encoding: "utf-8" });
    return JSON.parse(hashRaw) as HashTree;
  }
  catch (ex) {
    // do nothing, this is expected;
  }

  const {
    dirs,
    files,
  } = await readDirsDeepRelative(fileSystem, rootDirPath);

  const fileHashArray: [string, string][] = await PromiseAllParallel(files, async (localPath: string) => {
    const contents = await fileSystem.readFile(
      path.join(rootDirPath, localPath),
      { encoding: "utf-8" },
    );
    return [localPath, hashContents(contents)];
  });

  const fileHashes: Record<string, string> = Object.fromEntries(fileHashArray);
  const hashTree: HashTree = { dirs, fileHashes};

  await fileSystem.writeFile(
    path.join(rootDirPath, "directoryHashes.json"),
    JSON.stringify(hashTree, null, 2) + "\n",
    { encoding: "utf-8"}
  );

  return hashTree;
}
