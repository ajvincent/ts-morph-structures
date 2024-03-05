import {
  type TypeStructures,
  forEachAugmentedStructureChild,
  StructureImpls,
  TypeStructureKind
} from "#stage_two/snapshot/source/exports.js";

import {
  getStructureNameFromModified
} from "#utilities/source/StructureNameTransforms.js";

import BaseModule from "./BaseModule.js";
import DecoratorModule from "./DecoratorModule.js";

export default function addImportsToModule(
  module: BaseModule,
  structure: StructureImpls | TypeStructures,
): void
{
  if (structure.kind === TypeStructureKind.Literal) {

    if ((module instanceof DecoratorModule) && (module.decoratorName === structure.stringValue))
      return;

    const rawName = getStructureNameFromModified(structure.stringValue);
    switch (rawName) {
      case "JsxNamespacedNameStructure":
      case "Scope":
      case "StructureKind":
      case "TypeParameterVariance":
      case "ModuleDeclarationKind":
      case "VariableDeclarationKind":
      case "WriterFunction":
        module.addImports("ts-morph", [], [rawName]);
        return;

      case "stringOrWriterFunction":
        module.addImports("public", [], [structure.stringValue]);
        return;
    }

    if (rawName !== structure.stringValue)
      module.addImports("public", [], [structure.stringValue]);
    return;
  }

  forEachAugmentedStructureChild(
    structure,
    childType => addImportsToModule(module, childType)
  );
}