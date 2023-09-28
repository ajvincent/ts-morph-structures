import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

import BooleanDecoratorHook from "./hooks/BooleanDecorator.js";

// #endregion hooks

export default
async function BuildClassesDriver(): Promise<void>
{
  const dictionary = new StructureDictionaries;
  fillDictionaries(dictionary);

  dictionary.addDecoratorHook("boolean decorators", BooleanDecoratorHook);

  // #region structure classes
  // add decorator imports
  // create class, including implements, export default
  // apply type structure changes
  // create source file
  // add to public exports
  // #endregion structure classes

  // #region write to filesystem
  // write files
  // prettify source

  // #endregion write to filesystem

  //await dictionary.build();
  await Promise.resolve();
}
