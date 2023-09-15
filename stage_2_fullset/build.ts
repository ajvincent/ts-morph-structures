import { BuildPromiseSet } from "#utilities/source/BuildPromise.js";
import { runModule } from "#utilities/source/runModule.js";

const BPSet = new BuildPromiseSet;

{ // test
  const target = BPSet.get("test");

  target.addTask(() => {
    console.log("starting stage2_fullset:jasmine");
    return Promise.resolve();
  });

  target.addTask(async () => await runModule(
    "../node_modules/jasmine/bin/jasmine.js",
    [
      //"--parallel=auto",
      "--config=./spec/support/jasmine.json",
    ]
  ));
}

BPSet.markReady();
{
  BPSet.main.addSubtarget("test");
}
await BPSet.main.run();
export default Promise.resolve();
