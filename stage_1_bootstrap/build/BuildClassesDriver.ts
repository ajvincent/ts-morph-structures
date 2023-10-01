import path from "path";

import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

import createDecoratorParts from "./hooks/decorator/createParts.js";
import addClassProperties from "./hooks/decorator/classProperties.js";
import saveDecoratorFile from "./hooks/decorator/save.js";

// #endregion hooks

export default
async function BuildClassesDriver(distDir: string): Promise<void>
{
  const dictionary = new StructureDictionaries;
  defineExistingExports(dictionary, distDir);

  fillDictionaries(dictionary);

  dictionary.addDecoratorHook("create decorator parts", createDecoratorParts);
  dictionary.addDecoratorHook("add class properties", addClassProperties);
  dictionary.addDecoratorHook("save decorator file", saveDecoratorFile);

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
  await Promise.all([
    dictionary.publicExports.commit(),
    dictionary.internalExports.commit()
  ]);
}

function defineExistingExports(
  dictionaries: StructureDictionaries,
  distDir: string,
): void
{
  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/PlaceholderExport.ts"),
    exportNames: ["Placeholder"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/generated/structureToSyntax.ts"),
    exportNames: ["StructureKindToSyntaxKindMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/StructureBase.ts"),
    exportNames: ["StructureBase"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/RightExtendsLeft.ts"),
    exportNames: ["RightExtendsLeft"],
    isDefaultExport: false,
    isType: true
  });
}