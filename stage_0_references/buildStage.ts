import {
  BuildPromiseSet
} from "#utilities/source/BuildPromise.js";

import buildStructuresReference from "./structures/driver.js";

const BPSet = new BuildPromiseSet;

{
  const target = BPSet.get("structures");
  target.addTask(async () => {
    await buildStructuresReference();
  });
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("structures");
}

await BPSet.main.run();
export default Promise.resolve();
