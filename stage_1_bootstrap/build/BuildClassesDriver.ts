import path from "path";

import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

import BooleanDecoratorHook from "./hooks/BooleanDecorator.js";

// #endregion hooks

export default
async function BuildClassesDriver(distDir: string): Promise<void>
{
  const dictionary = new StructureDictionaries;
  defineExistingExports(dictionary, distDir);

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

  await dictionary.build();
}

function defineExistingExports(
  dictionary: StructureDictionaries,
  distDir: string,
): void
{
  dictionary.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/generated/structureToSyntax.ts"),
    exportNames: ["StructureKindToSyntaxKindMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionary.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/StructureBase.ts"),
    exportNames: ["StructureBase"],
    isDefaultExport: true,
    isType: false
  });

  dictionary.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/RightExtendsLeft.ts"),
    exportNames: ["RightExtendsLeft"],
    isDefaultExport: false,
    isType: true
  });
}