import TS_MORPH_D from "../ts-morph-d-file.js";

import {
  StructureMetaDictionaries,
} from "./DataClasses.js";

export default
async function fillDictionaries(
  dictionary: StructureMetaDictionaries
): Promise<void>
{
  void(TS_MORPH_D);
  void(dictionary);
  await Promise.resolve();
}
