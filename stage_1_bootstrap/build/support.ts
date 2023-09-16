import {
  PromiseAllParallel
} from "#utilities/source/PromiseTypes.js";

import generatedDirs from "./generatedDirs.js";

export default async function support(): Promise<void>
{
  await PromiseAllParallel(Object.values(generatedDirs.clean), cleanCallback => cleanCallback());
  await PromiseAllParallel(Object.values(generatedDirs.build), buildCallback => buildCallback());

  const dist = (await import("./dist.js")).default;
  await dist();
}
