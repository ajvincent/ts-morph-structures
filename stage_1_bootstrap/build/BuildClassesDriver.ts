import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

// #endregion hooks

export default
async function BuildClassesDriver(): Promise<void>
{
  const dictionary = new StructureDictionaries;
  await fillDictionaries(dictionary);

  // #region boolean decorators
  // create class, including implements
  // apply type structure changes
  // apply decorator-specific changes
  // wrap in exported subclass decorator
  // add to internal exports
  // create source file
  // #endregion boolean decorators

  // #region other decorators
  // create class, including implements
  // apply type structure changes
  // apply decorator-specific changes
  // wrap in exported subclass decorator
  // add to internal imports
  // create source file
  // #endregion other decorators

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

  await dictionary.build();
}
