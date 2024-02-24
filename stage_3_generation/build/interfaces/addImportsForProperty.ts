import {
  type TypeStructures,
  forEachAugmentedStructureChild,
  TypeStructureKind
} from "#stage_two/snapshot/source/exports.js";

import {
  getStructureNameFromModified
} from "#utilities/source/StructureNameTransforms.js";

import InterfaceModule from "../../moduleClasses/InterfaceModule.js";

export default function addImportsForProperty(
  module: InterfaceModule,
  typeStructure: TypeStructures,
): void
{
  if (typeStructure.kind === TypeStructureKind.Literal) {
    const rawName = getStructureNameFromModified(typeStructure.stringValue);
    switch (rawName) {
      case "Scope":
      case "StructureKind":
      case "TypeParameterVariance":
      case "VariableDeclarationKind":
      case "WriterFunction":
        module.addImports("ts-morph", [], [rawName]);
        return;

      case "stringOrWriterFunction":
        module.addImports("public", [], [typeStructure.stringValue]);
        return;
    }

    if (rawName !== typeStructure.stringValue)
      module.addImports("public", [], [typeStructure.stringValue]);
    return;
  }

  forEachAugmentedStructureChild(
    typeStructure,
    childType => addImportsForProperty(module, childType as TypeStructures)
  );
}
