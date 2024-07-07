/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";

import {
  DirectoryJSON,
  NestedDirectoryJSON,
  Volume
} from "memfs";

import { IWriteFileOptions } from "memfs/lib/node/types/options.js";
import { TFileId, TData, TCallback } from "memfs/lib/volume.js";

import type {
  HashTree
} from "./createDirectoryHashes.js"
import { hashContents } from "../hash-all-files.js";

export default
class HashingVolume extends Volume
{
  readonly #dirs = new Set<string>;

  readonly hashTree: HashTree = {
    dirs: [],
    fileHashes: {}
  };

  fromJSON(json: DirectoryJSON, cwd: string = process.cwd()): void {
    super.fromJSON(json, cwd);
  }

  static fromJSON(json: DirectoryJSON, cwd?: string): HashingVolume {
    const vol = new HashingVolume();
    vol.fromJSON(json, cwd);
    return vol;
  }

  fromNestedJSON(json: NestedDirectoryJSON, cwd?: string): void {
    super.fromNestedJSON(json, cwd);
  }

  static fromNestedJSON(json: NestedDirectoryJSON, cwd?: string): HashingVolume {
    const vol = new HashingVolume();
    vol.fromNestedJSON(json, cwd);
    return vol;
  }

  writeFile(id: TFileId, data: TData, callback: TCallback<void>): any;
  writeFile(id: TFileId, data: TData, options: IWriteFileOptions | string, callback: TCallback<void>): any;
  writeFile(id: TFileId, data: TData, options: unknown, callback?: unknown): any {
    const newCallback: TCallback<void> = (error, callbackData) => {
      if (!error)
        this.#writeFileHash(id, data);
      (callback as TCallback<void>)(error, callbackData);
    }

    let rv: any;
    if (!callback) {
      callback = options as TCallback<void>;
      rv = super.writeFile(id, data, newCallback);
    } else {
      rv = super.writeFile(id, data, options as IWriteFileOptions | string, newCallback);
    }
    return rv;
  }

  writeFileSync(id: TFileId, data: TData, options?: IWriteFileOptions): void {
    super.writeFileSync(id, data, options);
    this.#writeFileHash(id, data);
  }

  #writeFileHash(id: TFileId, data: TData): void {
    if ((typeof id !== "string") || (typeof data !== "string"))
      return;

    if (id === "/directoryHashes.json")
      return;

    const localFile = id.substring(1);
    this.hashTree.fileHashes[localFile] = hashContents(data);

    this.#ensureDir(path.dirname(id));
    this.hashTree.dirs = Array.from(this.#dirs);
    this.hashTree.dirs.sort();

    this.hashTree.fileHashes = Object.fromEntries(
      Object.entries(this.hashTree.fileHashes).sort((a, b) => a[0].localeCompare(b[0]))
    );
  }

  #ensureDir(dir: string): void {
    const localDir = dir.substring(1);
    if (this.#dirs.has(localDir))
      return;

    if (dir !== path.sep) {
      this.#ensureDir(path.dirname(dir));
      this.#dirs.add(localDir);
    }
  }
}
