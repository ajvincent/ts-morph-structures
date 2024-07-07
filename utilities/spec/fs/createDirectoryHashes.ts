import fs from "fs";
import path from "path";

import { Volume } from "memfs";

// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword
import tempDirWithCleanup from "#utilities/source/tempDirWithCleanup.js";
import {
  projectDir
} from "#utilities/source/AsyncSpecModules.js";

import createDirectoryHashes from "#utilities/source/fs/createDirectoryHashes.js";
import HashingVolume from "#utilities/source/fs/HashingVolume.js";

describe("createDirectoryHashes", () => {
  const fixturesDir = path.join(projectDir, "utilities/fixtures");

  it("works with the built-in file system", async () => {
    const { tempDir, resolve, promise } = await tempDirWithCleanup();

    try {
      await fs.promises.cp(fixturesDir, tempDir, { recursive: true });

      const firstHashTree = await createDirectoryHashes(fs.promises, tempDir);
      expect(firstHashTree).not.toBeNull();
      const secondHashTree = await createDirectoryHashes(fs.promises, tempDir);
      expect(secondHashTree).toEqual(firstHashTree);
    }
    finally {
      resolve(null);
      await promise;
    }
  });

  it("works with memfs volumes", async () => {
    const vol = Volume.fromJSON({
      "/fs/one/two.ts": `const two = 2;\nexport default two;\n`,
      "/fs/three/four.ts": `export default 4;\n`,
    }).promises as unknown as typeof fs["promises"];

    const firstHashTree = await createDirectoryHashes(vol, "/");
    expect(firstHashTree.dirs).toEqual([
      'fs',
      'fs/one',
      'fs/three',
    ]);
    expect(typeof firstHashTree.fileHashes["fs/one/two.ts"]).toBe("string");
    expect(typeof firstHashTree.fileHashes["fs/three/four.ts"]).toBe("string");
    expect(firstHashTree.fileHashes).toHaveSize(2);

    const secondHashTree = await createDirectoryHashes(vol, "/");
    expect(secondHashTree).toEqual(firstHashTree);
  });

  it("is unnecessary in the HashingVolume subclass of memfs::Volume", async () => {
    const vol = HashingVolume.fromJSON({
      "/fs/one/two.ts": `const two = 2;\nexport default two;\n`,
      "/fs/three/four.ts": `export default 4;\n`,
    });

    const firstHashTree = await createDirectoryHashes(
      vol.promises as unknown as typeof fs["promises"], "/"
    );
    expect(firstHashTree).toEqual(vol.hashTree);
  });
});
