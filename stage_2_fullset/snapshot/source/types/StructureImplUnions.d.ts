import type {
  AssertEntryImpl,
  CallSignatureDeclarationImpl,
  ClassDeclarationImpl,
  ClassStaticBlockDeclarationImpl,
  ConstructorDeclarationImpl,
  ConstructorDeclarationOverloadImpl,
  ConstructSignatureDeclarationImpl,
  DecoratorImpl,
  EnumDeclarationImpl,
  EnumMemberImpl,
  ExportAssignmentImpl,
  ExportDeclarationImpl,
  ExportSpecifierImpl,
  FunctionDeclarationImpl,
  FunctionDeclarationOverloadImpl,
  GetAccessorDeclarationImpl,
  GetAccessorDeclarationImpl,
  ImportDeclarationImpl,
  ImportSpecifierImpl,
  IndexSignatureDeclarationImpl,
  InterfaceDeclarationImpl,
  JSDocImpl,
  JSDocTagImpl,
  JsxAttributeImpl,
  JsxElementImpl,
  JsxSelfClosingElementImpl,
  JsxSpreadAttributeImpl,
  MethodDeclarationImpl,
  MethodDeclarationImpl,
  MethodDeclarationOverloadImpl,
  MethodSignatureImpl,
  ModuleDeclarationImpl,
  ParameterDeclarationImpl,
  PropertyAssignmentImpl,
  PropertyDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
  SetAccessorDeclarationImpl,
  ShorthandPropertyAssignmentImpl,
  SourceFileImpl,
  SpreadAssignmentImpl,
  TypeAliasDeclarationImpl,
  TypeParameterDeclarationImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
} from "../exports.js";
export type ClassMemberStructureImpls =
  | ClassStaticBlockDeclarationImpl
  | ConstructorDeclarationImpl
  | GetAccessorDeclarationImpl
  | MethodDeclarationImpl
  | PropertyDeclarationImpl
  | SetAccessorDeclarationImpl;
export type TypeElementMemberStructureImpls =
  | CallSignatureDeclarationImpl
  | ConstructSignatureDeclarationImpl
  | IndexSignatureDeclarationImpl
  | MethodSignatureImpl
  | PropertySignatureImpl;
export type InterfaceMemberStructureImpls = TypeElementMemberStructureImpls;
export type JsxStructureImpls =
  | JsxAttributeImpl
  | JsxElementImpl
  | JsxSelfClosingElementImpl
  | JsxSpreadAttributeImpl;
export type ObjectLiteralExpressionPropertyStructureImpls =
  | GetAccessorDeclarationImpl
  | MethodDeclarationImpl
  | PropertyAssignmentImpl
  | SetAccessorDeclarationImpl
  | ShorthandPropertyAssignmentImpl
  | SpreadAssignmentImpl;
export type StatementStructureImpls =
  | ClassDeclarationImpl
  | EnumDeclarationImpl
  | ExportAssignmentImpl
  | ExportDeclarationImpl
  | FunctionDeclarationImpl
  | ImportDeclarationImpl
  | InterfaceDeclarationImpl
  | ModuleDeclarationImpl
  | TypeAliasDeclarationImpl
  | VariableStatementImpl;
export type StructureImpls =
  | AssertEntryImpl
  | ConstructorDeclarationOverloadImpl
  | DecoratorImpl
  | EnumMemberImpl
  | ExportSpecifierImpl
  | FunctionDeclarationOverloadImpl
  | ImportSpecifierImpl
  | JSDocImpl
  | JSDocTagImpl
  | MethodDeclarationOverloadImpl
  | ParameterDeclarationImpl
  | SourceFileImpl
  | TypeParameterDeclarationImpl
  | VariableDeclarationImpl
  | ClassMemberStructureImpls
  | InterfaceMemberStructureImpls
  | JsxStructureImpls
  | ObjectLiteralExpressionPropertyStructureImpls
  | StatementStructureImpls;
