import {
  EntityName,
  Node,
  SyntaxKind,
  TypeNode,
} from "ts-morph";

import {
  IntersectionTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  QualifiedNameTypeStructureImpl,
  StringTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  TypeStructures,
  UnionTypeStructureImpl,
} from "../snapshot/source/exports.js";

import type {
  SubstructureResolver,
  TypeNodeToTypeStructure,
  TypeNodeToTypeStructureConsole
} from "./types/conversions.js";

const LiteralKeywords: ReadonlyMap<SyntaxKind, string> = new Map([
  [SyntaxKind.AnyKeyword, "any"],
  [SyntaxKind.BooleanKeyword, "boolean"],
  [SyntaxKind.FalseKeyword, "false"],
  [SyntaxKind.NeverKeyword, "never"],
  [SyntaxKind.NumberKeyword, "number"],
  [SyntaxKind.NullKeyword, "null"],
  [SyntaxKind.ObjectKeyword, "object"],
  [SyntaxKind.StringKeyword, "string"],
  [SyntaxKind.SymbolKeyword, "symbol"],
  [SyntaxKind.TrueKeyword, "true"],
  [SyntaxKind.UndefinedKeyword, "undefined"],
  [SyntaxKind.UnknownKeyword, "unknown"],
  [SyntaxKind.VoidKeyword, "void"],
]);

export default function convertTypeNode(
  typeNode: TypeNode,
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver
): string | TypeStructures | null
{
  if (Node.isLiteralTypeNode(typeNode)) {
    typeNode = typeNode.getFirstChildOrThrow();
  }
  const kind: SyntaxKind = typeNode.getKind();

  const keyword = LiteralKeywords.get(kind);
  if (keyword) {
    return keyword;
  }

  if (Node.isNumericLiteral(typeNode)) {
    return typeNode.getLiteralText();
  }

  if (Node.isStringLiteral(typeNode)) {
    return new StringTypeStructureImpl(typeNode.getLiteralText());
  }

  if (Node.isParenthesizedTypeNode(typeNode)) {
    const childStructure = convertTypeNode(
      typeNode.getTypeNode(),
      consoleTrap,
      subStructureResolver
    );
    if (!childStructure)
      return null;
    return new ParenthesesTypeStructureImpl(childStructure);
  }

  // Type nodes with generic type node children, based on a type.
  let childTypeNodes: TypeNode[] = [],
      parentStructure: (
        UnionTypeStructureImpl |
        IntersectionTypeStructureImpl |
        TupleTypeStructureImpl |
        TypeArgumentedTypeStructureImpl |
        undefined
      ) = undefined;

  // identifiers, type-argumented type nodes
  if (Node.isTypeReference(typeNode)) {
    const objectType = buildStructureForEntityName(typeNode.getTypeName());

    childTypeNodes = typeNode.getTypeArguments();
    if (childTypeNodes.length === 0) {
      return objectType;
    }

    childTypeNodes = typeNode.getTypeArguments();
    parentStructure = new TypeArgumentedTypeStructureImpl(objectType);
  }

  if (parentStructure) {
    const success = convertAndAppendChildTypes(
      childTypeNodes,
      parentStructure.childTypes,
      consoleTrap,
      subStructureResolver
    );
    if (success)
      return parentStructure;
  }

  reportConversionFailure(
    "unsupported type node", typeNode, typeNode, consoleTrap
  );
  void(subStructureResolver);
  return null;
}
convertTypeNode satisfies TypeNodeToTypeStructure;

function buildStructureForEntityName(
  entity: EntityName
): string | QualifiedNameTypeStructureImpl {
  if (Node.isQualifiedName(entity)) {
    const leftStructure = buildStructureForEntityName(entity.getLeft());
    const rightTypeAsString = entity.getRight().getText();

    if (leftStructure instanceof QualifiedNameTypeStructureImpl) {
      leftStructure.childTypes.push(rightTypeAsString);
      return leftStructure;
    }

    return new QualifiedNameTypeStructureImpl([leftStructure, rightTypeAsString]);
  }

  return entity.getText();
}

function convertAndAppendChildTypes(
  childTypeNodes: readonly TypeNode[],
  elements: (string | TypeStructures)[],
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver
): boolean
{
  return childTypeNodes.every(typeNode => {
    const childStructure = convertTypeNode(typeNode, consoleTrap, subStructureResolver);
    if (childStructure) {
      elements.push(childStructure);
      return true;
    }

    return false;
  });
}

function reportConversionFailure(
  prefixMessage: string,
  failingNode: Node,
  failingTypeNode: TypeNode,
  conversionFailCallback: TypeNodeToTypeStructureConsole,
): null
{
  const pos = failingNode.getPos();
  const { line, column } = failingNode.getSourceFile().getLineAndColumnAtPos(pos);

  conversionFailCallback(
    `${prefixMessage}: "${failingNode.getKindName()}" at line ${line}, column ${column}`,
    failingTypeNode
  );
  return null;
}
