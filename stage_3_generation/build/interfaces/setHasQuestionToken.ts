import {
  type PropertySignatureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  getStructureNameFromModified
} from "#utilities/source/StructureNameTransforms.js"

import InterfaceModule from "../../moduleClasses/InterfaceModule.js";

const OptionalHashes: ReadonlySet<string> = new Set([
  "ClassDeclarationStructure:extends",
  "EnumMemberStructure:value",
  "ExportDeclarationStructure:attributes",
  "ExportDeclarationStructure:moduleSpecifier",
  "ExportDeclarationStructure:namespaceExport",
  "ExportSpecifierStructure:alias",
  "ImportDeclarationStructure:attributes",
  "ImportDeclarationStructure:defaultImport",
  "ImportDeclarationStructure:namespaceImport",
  "ImportSpecifierStructure:alias",
  "IndexSignatureDeclarationStructure:keyName",
  "IndexSignatureDeclarationStructure:keyType",
  "InitializerExpressionableNodeStructure:initializer",
  "JSDocStructure:description",
  "JSDocTagStructure:text",
  "JsxAttributeStructure:initializer",
  "JsxElementStructure:bodyText",
  "ModuleDeclarationStructure:declarationKind",
  "NameableNodeStructure:name",
  /* this showed up in stage two but shouldn't have
  "ParameterDeclarationStructure:scope",
  */
  "ReturnTypedNodeStructure:returnType",
  "ScopedNodeStructure:scope",
  "TypedNodeStructure:type",
  "TypeParameterDeclarationStructure:constraint",
  "TypeParameterDeclarationStructure:default",
  "TypeParameterDeclarationStructure:variance",
  "VariableDeclarationStructure:declarationKind",
]);

export default function setHasQuestionToken(
  module: InterfaceModule,
  property: PropertySignatureImpl
): void
{
  const hash = getStructureNameFromModified(module.defaultExportName) + ":" + property.name;
  property.hasQuestionToken = OptionalHashes.has(hash);
}
