export {
  default as getTypeAugmentedStructure,
  type RootStructureWithConvertFailures,
  type TypeNodeToTypeStructureConsole,
} from "./prototype-snapshot/bootstrap/getTypeAugmentedStructure.js";

// #region Structure implementations

export { default as AssertEntryImpl } from "./prototype-snapshot/structures/AssertEntryImpl.js";
export { default as CallSignatureDeclarationImpl } from "./prototype-snapshot/structures/CallSignatureDeclarationImpl.js";
export { default as ClassDeclarationImpl } from "./prototype-snapshot/structures/ClassDeclarationImpl.js";
export { default as ConstructorDeclarationImpl }  from "./prototype-snapshot/structures/ConstructorDeclarationImpl.js";
export { default as ConstructorDeclarationOverloadImpl } from "./prototype-snapshot/structures/ConstructorDeclarationOverloadImpl.js";
export { default as ConstructSignatureDeclarationImpl } from "./prototype-snapshot/structures/ConstructSignatureDeclarationImpl.js";
export { default as DecoratorImpl }  from "./prototype-snapshot/structures/DecoratorImpl.js";
export { default as EnumDeclarationImpl } from "./prototype-snapshot/structures/EnumDeclarationImpl.js";
export { default as EnumMemberImpl } from "./prototype-snapshot/structures/EnumMemberImpl.js";
export { default as ExportAssignmentImpl } from "./prototype-snapshot/structures/ExportAssignmentImpl.js";
export { default as ExportDeclarationImpl } from "./prototype-snapshot/structures/ExportDeclarationImpl.js";
export { default as ExportSpecifierImpl } from "./prototype-snapshot/structures/ExportSpecifierImpl.js";
export { default as FunctionDeclarationImpl } from "./prototype-snapshot/structures/FunctionDeclarationImpl.js";
export { default as FunctionDeclarationOverloadImpl } from "./prototype-snapshot/structures/FunctionDeclarationOverloadImpl.js";
export { default as GetAccessorDeclarationImpl } from "./prototype-snapshot/structures/GetAccessorDeclarationImpl.js";
export { default as ImportDeclarationImpl } from "./prototype-snapshot/structures/ImportDeclarationImpl.js";
export { default as ImportSpecifierImpl } from "./prototype-snapshot/structures/ImportSpecifierImpl.js";
export { default as IndexSignatureDeclarationImpl } from "./prototype-snapshot/structures/IndexSignatureDeclarationImpl.js";
export { default as InterfaceDeclarationImpl } from "./prototype-snapshot/structures/InterfaceDeclarationImpl.js";
export { default as JSDocImpl } from "./prototype-snapshot/structures/JSDocImpl.js";
export { default as JSDocTagImpl } from "./prototype-snapshot/structures/JSDocTagImpl.js";
export { default as MethodDeclarationImpl } from "./prototype-snapshot/structures/MethodDeclarationImpl.js";
export { default as MethodDeclarationOverloadImpl } from "./prototype-snapshot/structures/MethodDeclarationOverloadImpl.js";
export { default as MethodSignatureImpl } from "./prototype-snapshot/structures/MethodSignatureImpl.js";
export { default as ModuleDeclarationImpl } from "./prototype-snapshot/structures/ModuleDeclarationImpl.js";
export { default as ParameterDeclarationImpl } from "./prototype-snapshot/structures/ParameterDeclarationImpl.js";
export { default as PropertyDeclarationImpl } from "./prototype-snapshot/structures/PropertyDeclarationImpl.js";
export { default as PropertySignatureImpl } from "./prototype-snapshot/structures/PropertySignatureImpl.js";
export { default as SetAccessorDeclarationImpl } from "./prototype-snapshot/structures/SetAccessorDeclarationImpl.js";
export { default as SourceFileImpl } from "./prototype-snapshot/structures/SourceFileImpl.js";
export { default as TypeAliasDeclarationImpl } from "./prototype-snapshot/structures/TypeAliasDeclarationImpl.js";
export { default as TypeParameterDeclarationImpl } from "./prototype-snapshot/structures/TypeParameterDeclarationImpl.js";
export { default as VariableDeclarationImpl } from "./prototype-snapshot/structures/VariableDeclarationImpl.js";
export { default as VariableStatementImpl } from "./prototype-snapshot/structures/VariableStatementImpl.js";

export { default as StructuresClassesMap } from "./prototype-snapshot/base/StructuresClassesMap.js";

export {
  TypeParameterConstraintMode
} from "./prototype-snapshot/structures/TypeParameterDeclarationImpl.js";

export {
  TypeElementMemberedOwner
} from "./prototype-snapshot/decorators/TypeElementMemberedNode.js";

export type {
  MethodDeclarationAppendContext,
  MethodDeclarationEnableFlags,
} from "./prototype-snapshot/structures/MethodDeclarationImpl.js";

// #endregion Structure implementations

// #region TypeStructure implementations

export * from "./prototype-snapshot/typeStructures/TypeStructures.js";

export type {
  ClassDeclarationWithImplementsTypeStructures,
  InterfaceDeclarationWithExtendsTypeStructures,
  ReturnTypedNodeTypeStructure,
  TypedNodeTypeStructure,
  TypeParameterWithTypeStructures,
} from "./prototype-snapshot/typeStructures/TypeAndTypeStructureInterfaces.js";

export {
  TypeStructureKind,
  type KindedTypeStructure,
} from "./prototype-snapshot/base/TypeStructureKind.js";

export { default as ArrayTypedStructureImpl } from "./prototype-snapshot/typeStructures/ArrayTypedStructureImpl.js";
export { default as ConditionalTypedStructureImpl } from "./prototype-snapshot/typeStructures/ConditionalTypedStructureImpl.js";
export { default as FunctionTypedStructureImpl } from "./prototype-snapshot/typeStructures/FunctionTypedStructureImpl.js";
export { default as IndexedAccessTypedStructureImpl } from "./prototype-snapshot/typeStructures/IndexedAccessTypedStructureImpl.js";
export { default as InferTypedStructureImpl } from "./prototype-snapshot/typeStructures/InferTypedStructureImpl.js";
export { default as IntersectionTypedStructureImpl } from "./prototype-snapshot/typeStructures/IntersectionTypedStructureImpl.js"
export { default as LiteralTypedStructureImpl } from "./prototype-snapshot/typeStructures/LiteralTypedStructureImpl.js";
export { default as MappedTypeTypedStructureImpl } from "./prototype-snapshot/typeStructures/MappedTypeTypedStructureImpl.js";
export { default as ObjectLiteralTypedStructureImpl } from "./prototype-snapshot/typeStructures/ObjectLiteralTypedStructureImpl.js";
export { default as ParameterTypedStructureImpl } from "./prototype-snapshot/typeStructures/ParameterTypedStructureImpl.js";
export { default as ParenthesesTypedStructureImpl } from "./prototype-snapshot/typeStructures/ParenthesesTypedStructureImpl.js";
export { default as PrefixOperatorsTypedStructureImpl } from "./prototype-snapshot/typeStructures/PrefixOperatorsTypedStructureImpl.js";
export { default as StringTypedStructureImpl } from "./prototype-snapshot/typeStructures/StringTypedStructureImpl.js";
export { default as SymbolKeyTypedStructureImpl } from "./prototype-snapshot/typeStructures/SymbolKeyTypedStructureImpl.js";
export { default as TemplateLiteralTypedStructureImpl } from "./prototype-snapshot/typeStructures/TemplateLiteralTypedStructureImpl.js";
export { default as TupleTypedStructureImpl } from "./prototype-snapshot/typeStructures/TupleTypedStructureImpl.js";
export { default as TypeArgumentedTypedStructureImpl } from "./prototype-snapshot/typeStructures/TypeArgumentedTypedStructureImpl.js";
export { default as UnionTypedStructureImpl } from "./prototype-snapshot/typeStructures/UnionTypedStructureImpl.js";
export { default as WriterTypedStructureImpl } from "./prototype-snapshot/typeStructures/WriterTypedStructureImpl.js";

export { default as TypeStructureClassesMap } from "./prototype-snapshot/base/TypeStructureClassesMap.js";

export {
  TypePrinterSettingsBase,
  type TypePrinterSettings,
  type TypePrinterSettingsInternal,
} from "./prototype-snapshot/base/TypePrinter.js";

// #endregion TypeStructure implementations

export {
  createCodeBlockWriter,
  pairedWrite,
} from "./prototype-snapshot/base/utilities.js";
