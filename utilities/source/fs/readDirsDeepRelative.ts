import fs from "fs";
import path from "path";

export type DirsAndFiles = {
  dirs: string[];
  files: string[];
}

/**
 * Search recursively for directories and files, optionally filtering the directories.
 *
 * @param root   - The root directory to walk.
 * @param filter - A callback for subdirectories:  returns false if we should not walk its contents.
 * @returns The results of the search.
 */
export default
async function readDirsDeepRelative(
  fileSystem: typeof fs["promises"],
  root: string
) : Promise<DirsAndFiles>
{
  const dirs = [""], files: string[] = [];

  for (const localDir of dirs) {
    const currentDir = localDir ? path.resolve(root, localDir) : root;
    const entries = await fileSystem.readdir(currentDir, { encoding: "utf-8", withFileTypes: true});

    entries.forEach(entry => {
      if (entry.isFile()) {
        files.push(path.join(localDir, entry.name));
      }
      else if (entry.isDirectory()) {
        const fullPath = path.join(localDir, entry.name);
        dirs.push(fullPath);
      }
    });
  }

  dirs.sort();
  files.sort();
  dirs.shift(); // get rid of the leading ""
  return {dirs, files};
}
