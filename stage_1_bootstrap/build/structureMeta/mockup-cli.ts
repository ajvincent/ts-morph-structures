/**
 * @remarks
 *
 * This code is not meant to be used in production.  It's a mockup of how I would write code to actually extract structure data.
 */

import {
  type InterfaceDeclaration,
  type TypeElementTypes,
  Node,
  SyntaxKind,
  TypeNode,
  ExpressionWithTypeArguments,
  UnionTypeNode,
} from "ts-morph";

import TS_MORPH_D from "../ts-morph-d-file.js";

import {
  PropertyValue,
  DecoratorImplMeta,
  StructureImplMeta,
  StructureUnionMeta,
} from "./DataClasses.js";

// AmbientableNodeStructure
/*
export interface AmbientableNodeStructure {
  hasDeclareKeyword?: boolean;
}
*/
{
  const ambientableNode: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow("AmbientableNodeStructure");
  const meta = new DecoratorImplMeta("AmbientableNodeStructure");

  if (ambientableNode.getMethods().length > 0) {
    throw new Error("unexpected, structure interfaces from ts-morph don't have methods");
  }

  for (const prop of ambientableNode.getProperties()) {
    const propertyName = prop.getName();
    const isBoolean = Node.isBooleanKeyword(prop.getTypeNodeOrThrow());
    if (isBoolean) {
      meta.booleanKeys.add(propertyName);
    }
    else {
      throw new Error("unexpected, we thought we had a boolean here");
    }
  }

  //console.log(meta.booleanKeys);
}

// JSDocableNodeStructure
/*
DecoratorImplMeta: no extends attribute

export interface JSDocableNodeStructure {
  docs?: (OptionalKind<JSDocStructure> | string)[];
}
*/
{
  const jsDocable: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow("JSDocableNodeStructure");
  let member: TypeElementTypes;
  const meta = new DecoratorImplMeta("JSDocableNodeStructure");

  for (member of jsDocable.getMembers()) {
    const prop = member.asKindOrThrow(SyntaxKind.PropertySignature);
    const propertyName = prop.getName();
    const isBoolean = Node.isBooleanKeyword(prop.getTypeNodeOrThrow());
    if (isBoolean) {
      throw new Error("unexpected, we shouldn't have a boolean here");
    }
    else {
      const propertyValue = new PropertyValue;

      propertyValue.mayBeUndefined = prop.hasQuestionToken();

      let typeNode: TypeNode = prop.getTypeNodeOrThrow();
      let isArray = false;
      if (Node.isArrayTypeNode(typeNode)) {
        isArray = true;
        typeNode = typeNode.getElementTypeNode();
      }
      if (Node.isParenthesizedTypeNode(typeNode)) {
        typeNode = typeNode.getTypeNode();
      }
      let types: TypeNode[] = [typeNode];
      if (Node.isUnionTypeNode(typeNode)) {
        types = typeNode.getTypeNodes();
      }

      const stringIndex = types.findIndex(type => Node.isStringKeyword(type));
      if (stringIndex > -1) {
        propertyValue.mayBeString = true;
        types.splice(stringIndex, 1);
      }

      const writerIndex = types.findIndex(type => {
        if (!Node.isTypeReference(type))
          return false;
        const args = type.getTypeArguments();
        if (args.length > 0)
          return false;
        return type.getFullText() === "WriterFunction";
      });
      if (writerIndex > -1) {
        propertyValue.mayBeWriter = true;
        types.splice(writerIndex, 1);
      }

      if (types.length > 1) {
        throw new Error("unexpected: we resolved string and WriterFunction, we should be down to only one type");
      }

      if (types.length === 1) {
        typeNode = types[0];
        if (Node.isTypeReference(typeNode) && typeNode.getTypeName().getFullText() === "OptionalKind") {
          propertyValue.isOptionalKind = true;
          typeNode = typeNode.getTypeArguments()[0];
        }

        const fullText = typeNode.getFullText();
        if (fullText.includes("Structure"))
          propertyValue.structureName = fullText;
        else
          propertyValue.tsmorph_Types.add(fullText);
      }

      meta.addField(propertyName, isArray, propertyValue);
    }
  }

  //console.log(meta.toJSON());
}

// InterfaceDeclarationStructure
/*
// StructureImplMeta: extends several interfaces

export interface InterfaceDeclarationStructure extends
  Structure,
  NamedNodeStructure,
  InterfaceDeclarationSpecificStructure,
  ExtendsClauseableNodeStructure,
  TypeParameteredNodeStructure,
  JSDocableNodeStructure,
  AmbientableNodeStructure,
  ExportableNodeStructure,
  TypeElementMemberedNodeStructure
{
}
*/
{
  const decl: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow("InterfaceDeclarationStructure");
  const _extendsArray: ExpressionWithTypeArguments[] = decl.getExtends();
  if (_extendsArray.length === 0) {
    throw new Error("unexpected: we have an actual structure interface");
  }
  else {
    const meta = new StructureImplMeta("InterfaceDeclarationStructure");
    _extendsArray.forEach(_extends => {
      // Handle KindedStructure<StructureKind.Foo>
      const expression = _extends.getExpression().asKindOrThrow(SyntaxKind.Identifier);
      const idText = expression.getText();
      if (idText === "KindedStructure") {
        const qualifiedName = _extends.getTypeArguments()[0].asKindOrThrow(SyntaxKind.TypeReference).getTypeName().asKindOrThrow(SyntaxKind.QualifiedName);
        meta.structureKindName = qualifiedName.getRight().getText();
        return;
      }

      if (idText.endsWith("SpecificStructure")) {
        const specificInterface = TS_MORPH_D.getInterfaceOrThrow(idText);
        const specificMembers = specificInterface.getMembers();
        // need to merge specificMembers into meta
        void(specificMembers);
        return;
      }

      meta.decoratorKeys.add(_extends.getFullText())
    });
  }
}

// StatementStructures
/*
// StructureUnion: type alias of several other identifiers.

export type StatementStructures =
  ClassDeclarationStructure |
  EnumDeclarationStructure |
  FunctionDeclarationStructure |
  InterfaceDeclarationStructure |
  ModuleDeclarationStructure |
  TypeAliasDeclarationStructure |
  ImportDeclarationStructure |
  ExportDeclarationStructure |
  ExportAssignmentStructure |
  VariableStatementStructure;
*/
{
  const statementStructures = TS_MORPH_D.getTypeAliasOrThrow("StatementStructures");
  const typeNode: UnionTypeNode = statementStructures.getTypeNodeOrThrow().asKindOrThrow(SyntaxKind.UnionType);
  const identifiers: string[] = typeNode.getTypeNodes().map(node => {
    const refNode = node.asKindOrThrow(SyntaxKind.TypeReference);
    if (refNode.getTypeArguments().length > 0)
      throw new Error("type argument?");
    return refNode.getTypeName().getText();
  });

  const data = new StructureUnionMeta;
  identifiers.forEach(id => {
    const idSet = id.endsWith("Structures") ? data.unionKeys : data.structureNames;
    idSet.add(id);
  });
}