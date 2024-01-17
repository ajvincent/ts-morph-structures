// This file is generated.  Do not edit.
export {
  type KindedTypeStructure,
  TypeStructureKind,
} from "./base/TypeStructureKind.js";
export {
  default as getTypeAugmentedStructure,
  type TypeNodeToTypeStructureConsole,
} from "./bootstrap/getTypeAugmentedStructure.js";
export { default as CallSignatureDeclarationImpl } from "./structures/standard/CallSignatureDeclarationImpl.js";
export { default as ClassDeclarationImpl } from "./structures/standard/ClassDeclarationImpl.js";
export { default as ClassStaticBlockDeclarationImpl } from "./structures/standard/ClassStaticBlockDeclarationImpl.js";
export { default as ConstructorDeclarationImpl } from "./structures/standard/ConstructorDeclarationImpl.js";
export { default as ConstructorDeclarationOverloadImpl } from "./structures/standard/ConstructorDeclarationOverloadImpl.js";
export { default as ConstructSignatureDeclarationImpl } from "./structures/standard/ConstructSignatureDeclarationImpl.js";
export { default as DecoratorImpl } from "./structures/standard/DecoratorImpl.js";
export { default as EnumDeclarationImpl } from "./structures/standard/EnumDeclarationImpl.js";
export { default as EnumMemberImpl } from "./structures/standard/EnumMemberImpl.js";
export { default as ExportAssignmentImpl } from "./structures/standard/ExportAssignmentImpl.js";
export { default as ExportDeclarationImpl } from "./structures/standard/ExportDeclarationImpl.js";
export { default as ExportSpecifierImpl } from "./structures/standard/ExportSpecifierImpl.js";
export { default as FunctionDeclarationImpl } from "./structures/standard/FunctionDeclarationImpl.js";
export { default as FunctionDeclarationOverloadImpl } from "./structures/standard/FunctionDeclarationOverloadImpl.js";
export { default as GetAccessorDeclarationImpl } from "./structures/standard/GetAccessorDeclarationImpl.js";
export { default as ImportAttributeImpl } from "./structures/standard/ImportAttributeImpl.js";
export { default as ImportDeclarationImpl } from "./structures/standard/ImportDeclarationImpl.js";
export { default as ImportSpecifierImpl } from "./structures/standard/ImportSpecifierImpl.js";
export { default as IndexSignatureDeclarationImpl } from "./structures/standard/IndexSignatureDeclarationImpl.js";
export { default as InterfaceDeclarationImpl } from "./structures/standard/InterfaceDeclarationImpl.js";
export { default as JSDocImpl } from "./structures/standard/JSDocImpl.js";
export { default as JSDocTagImpl } from "./structures/standard/JSDocTagImpl.js";
export { default as JsxAttributeImpl } from "./structures/standard/JsxAttributeImpl.js";
export { default as JsxElementImpl } from "./structures/standard/JsxElementImpl.js";
export { default as JsxSelfClosingElementImpl } from "./structures/standard/JsxSelfClosingElementImpl.js";
export { default as JsxSpreadAttributeImpl } from "./structures/standard/JsxSpreadAttributeImpl.js";
export { default as MethodDeclarationImpl } from "./structures/standard/MethodDeclarationImpl.js";
export { default as MethodDeclarationOverloadImpl } from "./structures/standard/MethodDeclarationOverloadImpl.js";
export { default as MethodSignatureImpl } from "./structures/standard/MethodSignatureImpl.js";
export { default as ModuleDeclarationImpl } from "./structures/standard/ModuleDeclarationImpl.js";
export { default as ParameterDeclarationImpl } from "./structures/standard/ParameterDeclarationImpl.js";
export { default as PropertyAssignmentImpl } from "./structures/standard/PropertyAssignmentImpl.js";
export { default as PropertyDeclarationImpl } from "./structures/standard/PropertyDeclarationImpl.js";
export { default as PropertySignatureImpl } from "./structures/standard/PropertySignatureImpl.js";
export { default as SetAccessorDeclarationImpl } from "./structures/standard/SetAccessorDeclarationImpl.js";
export { default as ShorthandPropertyAssignmentImpl } from "./structures/standard/ShorthandPropertyAssignmentImpl.js";
export { default as SourceFileImpl } from "./structures/standard/SourceFileImpl.js";
export { default as SpreadAssignmentImpl } from "./structures/standard/SpreadAssignmentImpl.js";
export { default as TypeAliasDeclarationImpl } from "./structures/standard/TypeAliasDeclarationImpl.js";
export { default as TypeParameterDeclarationImpl } from "./structures/standard/TypeParameterDeclarationImpl.js";
export { default as VariableDeclarationImpl } from "./structures/standard/VariableDeclarationImpl.js";
export { default as VariableStatementImpl } from "./structures/standard/VariableStatementImpl.js";
export {
  type ClassFieldStatement,
  default as ClassFieldStatementsMap,
} from "./toolbox/ClassFieldStatementsMap.js";
export {
  type ClassMemberImpl,
  default as ClassMembersMap,
} from "./toolbox/ClassMembersMap.js";
export { default as ExportManager } from "./toolbox/ExportManager.js";
export { default as ImportManager } from "./toolbox/ImportManager.js";
export {
  default as TypeMembersMap,
  type NamedTypeMemberImpl,
  type TypeMemberImpl,
} from "./toolbox/TypeMembersMap.js";
export type { stringOrWriterFunction } from "./types/stringOrWriterFunction.js";
export type * from "./types/StructureImplUnions.js";
export type * from "./types/TypeAndTypeStructureInterfaces.js";
export { default as ArrayTypeStructureImpl } from "./typeStructures/ArrayTypeStructureImpl.js";
export {
  type ConditionalTypeStructureParts,
  default as ConditionalTypeStructureImpl,
} from "./typeStructures/ConditionalTypeStructureImpl.js";
export {
  default as FunctionTypeStructureImpl,
  type FunctionTypeContext,
  FunctionWriterStyle,
} from "./typeStructures/FunctionTypeStructureImpl.js";
export { default as IndexedAccessTypeStructureImpl } from "./typeStructures/IndexedAccessTypeStructureImpl.js";
export { default as InferTypeStructureImpl } from "./typeStructures/InferTypeStructureImpl.js";
export { default as IntersectionTypeStructureImpl } from "./typeStructures/IntersectionTypeStructureImpl.js";
export { default as LiteralTypeStructureImpl } from "./typeStructures/LiteralTypeStructureImpl.js";
export { default as MappedTypeStructureImpl } from "./typeStructures/MappedTypeStructureImpl.js";
export { default as MemberedObjectTypeStructureImpl } from "./typeStructures/MemberedObjectTypeStructureImpl.js";
export { default as ParameterTypeStructureImpl } from "./typeStructures/ParameterTypeStructureImpl.js";
export { default as ParenthesesTypeStructureImpl } from "./typeStructures/ParenthesesTypeStructureImpl.js";
export {
  default as PrefixOperatorsTypeStructureImpl,
  type PrefixUnaryOperator,
} from "./typeStructures/PrefixOperatorsTypeStructureImpl.js";
export { default as QualifiedNameTypeStructureImpl } from "./typeStructures/QualifiedNameTypeStructureImpl.js";
export { default as StringTypeStructureImpl } from "./typeStructures/StringTypeStructureImpl.js";
export { default as TemplateLiteralTypeStructureImpl } from "./typeStructures/TemplateLiteralTypeStructureImpl.js";
export { default as TupleTypeStructureImpl } from "./typeStructures/TupleTypeStructureImpl.js";
export { default as TypeArgumentedTypeStructureImpl } from "./typeStructures/TypeArgumentedTypeStructureImpl.js";
export type {
  stringTypeStructuresOrNull,
  TypeStructures,
} from "./typeStructures/TypeStructures.js";
export { default as UnionTypeStructureImpl } from "./typeStructures/UnionTypeStructureImpl.js";
export { default as WriterTypeStructureImpl } from "./typeStructures/WriterTypeStructureImpl.js";
