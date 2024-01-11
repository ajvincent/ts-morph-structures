import {
  ConditionalTypeNode,
  ConstructorTypeNode,
  EntityName,
  FunctionTypeNode,
  Node,
  ParameterDeclaration,
  StructureKind,
  SyntaxKind,
  TypeNode,
  TypeParameterDeclaration,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ConditionalTypeStructureImpl,
  FunctionTypeContext,
  FunctionTypeStructureImpl,
  FunctionWriterStyle,
  IntersectionTypeStructureImpl,
  ParameterTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  QualifiedNameTypeStructureImpl,
  StringTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  TypeParameterDeclarationImpl,
  TypeStructures,
  UnionTypeStructureImpl,
  type stringTypeStructuresOrNull,
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
): stringTypeStructuresOrNull
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

  if (Node.isArrayTypeNode(typeNode)) {
    const childStructure = convertTypeNode(
      typeNode.getElementTypeNode(),
      consoleTrap,
      subStructureResolver,
    );
    if (!childStructure)
      return null;
    return new ArrayTypeStructureImpl(childStructure);
  }

  if (Node.isConditionalTypeNode(typeNode)) {
    return convertConditionalTypeNode(typeNode, consoleTrap, subStructureResolver);
  }

  if (Node.isFunctionTypeNode(typeNode) || Node.isConstructorTypeNode(typeNode)) {
    return convertFunctionTypeNode(typeNode, consoleTrap, subStructureResolver);
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
      );

  if (Node.isUnionTypeNode(typeNode)) {
    parentStructure = new UnionTypeStructureImpl;
    childTypeNodes = typeNode.getTypeNodes();
  }
  else if (Node.isIntersectionTypeNode(typeNode)) {
    parentStructure = new IntersectionTypeStructureImpl;
    childTypeNodes = typeNode.getTypeNodes();
  }
  else if (Node.isTupleTypeNode(typeNode)) {
    parentStructure = new TupleTypeStructureImpl;
    childTypeNodes = typeNode.getElements();
  }

  // identifiers, type-argumented type nodes
  else if (Node.isTypeReference(typeNode)) {
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

function convertConditionalTypeNode(
  condition: ConditionalTypeNode,
  conversionFailCallback: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver,
): ConditionalTypeStructureImpl | null
{
  const checkType: stringTypeStructuresOrNull = convertTypeNode(
    condition.getCheckType(), conversionFailCallback, subStructureResolver,
  );
  if (!checkType)
    return null;

  const extendsType: stringTypeStructuresOrNull = convertTypeNode(
    condition.getExtendsType(), conversionFailCallback, subStructureResolver
  );
  if (!extendsType)
    return null;

  const trueType: stringTypeStructuresOrNull = convertTypeNode(
    condition.getTrueType(), conversionFailCallback, subStructureResolver
  );
  if (!trueType)
    return null;

  const falseType: stringTypeStructuresOrNull = convertTypeNode(
    condition.getFalseType(), conversionFailCallback, subStructureResolver
  );
  if (!falseType)
    return null;

  return new ConditionalTypeStructureImpl({
    checkType,
    extendsType,
    trueType,
    falseType
  });
}

function convertFunctionTypeNode(
  typeNode: FunctionTypeNode | ConstructorTypeNode,
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver,
): FunctionTypeStructureImpl | null
{
  let typeParameterNodes: readonly TypeParameterDeclaration[] = [];
  try {
    // https://github.com/dsherret/ts-morph/issues/1434
    typeParameterNodes = (typeNode as Pick<FunctionTypeNode, "getTypeParameters">).getTypeParameters();
  }
  catch (ex) {
    typeParameterNodes = typeNode.getChildrenOfKind(SyntaxKind.TypeParameter);
  }

  const typeParameterStructures: TypeParameterDeclarationImpl[] = [];
  for (const declaration of typeParameterNodes.values()) {
    const subStructure = convertTypeParameterNode(declaration, subStructureResolver);
    if (!subStructure)
      return null;
    typeParameterStructures.push(subStructure);
  }

  let restParameter: ParameterTypeStructureImpl | undefined = undefined;

  const parameterNodes: ParameterDeclaration[] = typeNode.getParameters().slice();
  if (parameterNodes.length) {
    const lastParameter = parameterNodes[parameterNodes.length - 1];
    if (lastParameter.isRestParameter()) {
      parameterNodes.pop();
      restParameter = convertParameterNodeTypeNode(
        lastParameter, consoleTrap, subStructureResolver
      );
    }
  }

  const parameterStructures: ParameterTypeStructureImpl[] = parameterNodes.map(
    parameterNode => convertParameterNodeTypeNode(parameterNode, consoleTrap, subStructureResolver)
  );

  const returnTypeNode = typeNode.getReturnTypeNode();
  let returnTypeStructure: string | TypeStructures | undefined = undefined;
  if (returnTypeNode) {
    returnTypeStructure = convertTypeNode(returnTypeNode, consoleTrap, subStructureResolver) ?? undefined;
  }

  const functionContext: FunctionTypeContext = {
    name: undefined,
    isConstructor: typeNode instanceof ConstructorTypeNode,
    typeParameters: typeParameterStructures,
    parameters: parameterStructures,
    restParameter,
    returnType: returnTypeStructure,
    writerStyle: FunctionWriterStyle.Arrow,
  }

  return new FunctionTypeStructureImpl(functionContext);
}

function convertTypeParameterNode(
  declaration: TypeParameterDeclaration,
  subStructureResolver: SubstructureResolver,
): TypeParameterDeclarationImpl | null
{
  const subStructure = subStructureResolver(declaration);
  if (subStructure.kind !== StructureKind.TypeParameter)
    return null;

  if (subStructure instanceof TypeParameterDeclarationImpl)
    return subStructure;

  return TypeParameterDeclarationImpl.clone(subStructure);
}

function convertParameterNodeTypeNode(
  node: ParameterDeclaration,
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver,
): ParameterTypeStructureImpl
{
  const paramTypeNode = node.getTypeNode();
  let paramTypeStructure: stringTypeStructuresOrNull = null;
  if (paramTypeNode) {
    paramTypeStructure = convertTypeNode(
      paramTypeNode, consoleTrap, subStructureResolver
    );
  }
  return new ParameterTypeStructureImpl(node.getName(), paramTypeStructure ?? undefined);
}

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
