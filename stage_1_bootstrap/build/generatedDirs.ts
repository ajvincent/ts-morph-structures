import fs from "fs/promises";

import {
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";
import {
  SingletonPromise,
} from "#utilities/source/PromiseTypes.js";

import {
  stageDir,
} from "./constants.js";

import structureToSyntax from "./structureToSyntax.js";

class GeneratedDirs {
  static #getGeneratedDir(subdir: string): string {
    return pathToModule(stageDir, subdir + "/generated");
  }

  clean: Record<string, () => Promise<void>> = {};
  build: Record<string, () => Promise<void>> = {};

  #dirNames: ReadonlyMap<string, (pathToDirectory: string) => Promise<void>>;

  constructor(dirEntries: readonly [string, (pathToDirectory: string) => Promise<void>][]) {
    this.#dirNames = new Map(dirEntries);
    for (const dirName of this.#dirNames.keys()) {
      const pathToDirectory = GeneratedDirs.#getGeneratedDir(dirName);
      const cleanSingleton = new SingletonPromise(() => this.#cleanDir(pathToDirectory));
      const cleanCallback = cleanSingleton.run.bind(cleanSingleton);
      this.clean[dirName] = cleanCallback;

      const buildSingleton = new SingletonPromise(() => this.#buildDir(dirName, pathToDirectory));
      const buildCallback = buildSingleton.run.bind(buildSingleton);
      this.build[dirName] = buildCallback;
    }
  }

  async #cleanDir(pathToDirectory: string): Promise<void> {
    let found = false;

    try {
      await fs.access(pathToDirectory);
      found = true;
    }
    catch {
      // do nothing
    }
    if (found)
      await fs.rm(pathToDirectory, { recursive: true });
  }

  async #buildDir(dirName: string, pathToDirectory: string): Promise<void> {
    await this.clean[dirName]();

    await this.#dirNames.get(dirName)!(pathToDirectory);
  }
}

export default new GeneratedDirs([
  ["source/base", structureToSyntax],
]);
