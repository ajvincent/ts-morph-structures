import {
  ConditionalTypeNode,
  ConstructorTypeNode,
  EntityName,
  FunctionTypeNode,
  MappedTypeNode,
  Node,
  ParameterDeclaration,
  StructureKind,
  SyntaxKind,
  TemplateLiteralTypeNode,
  TypeNode,
  TypeParameterDeclaration,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ConditionalTypeStructureImpl,
  FunctionTypeContext,
  FunctionTypeStructureImpl,
  FunctionWriterStyle,
  IndexedAccessTypeStructureImpl,
  IntersectionTypeStructureImpl,
  MappedTypeStructureImpl,
  ParameterTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  QualifiedNameTypeStructureImpl,
  StringTypeStructureImpl,
  TemplateLiteralTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  TypeParameterDeclarationImpl,
  TypeStructures,
  UnionTypeStructureImpl,
  type stringTypeStructuresOrNull,
} from "../exports.js";

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

  if (Node.isIndexedAccessTypeNode(typeNode)) {
    const objectType = convertTypeNode(
      typeNode.getObjectTypeNode(),
      consoleTrap,
      subStructureResolver,
    );
    if (!objectType)
      return null;

    const indexType = convertTypeNode(
      typeNode.getIndexTypeNode(),
      consoleTrap,
      subStructureResolver,
    );
    if (!indexType)
      return null;

    return new IndexedAccessTypeStructureImpl(objectType, indexType);
  }

  if (Node.isMappedTypeNode(typeNode)) {
    return convertMappedTypeNode(typeNode, consoleTrap, subStructureResolver);
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

  if (Node.isTemplateLiteralTypeNode(typeNode)) {
    return convertTemplateLiteralTypeNode(typeNode, consoleTrap, subStructureResolver);
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

function convertMappedTypeNode(
  mappedTypeNode: MappedTypeNode,
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver,
): MappedTypeStructureImpl | null
{
  let parameterStructure: TypeParameterDeclarationImpl;
  {
    const typeParameterNode = mappedTypeNode.getTypeParameter();
    const structure = convertTypeParameterNode(typeParameterNode, subStructureResolver);
    if (!structure) {
      return reportConversionFailure(
        "unsupported type parameter node",
        typeParameterNode, mappedTypeNode, consoleTrap
      );
    }
    parameterStructure = structure;
  }

  const mappedStructure = new MappedTypeStructureImpl(parameterStructure);

  {
    let nameStructure: string | TypeStructures | undefined = undefined;
    const nameTypeNode = mappedTypeNode.getNameTypeNode();
    if (nameTypeNode) {
      nameStructure = convertTypeNode(nameTypeNode, consoleTrap, subStructureResolver) ?? undefined;
    }

    if (nameStructure)
      mappedStructure.asName = nameStructure;
  }

  {
    let typeStructure: string | TypeStructures | undefined = undefined;
    const typeNode = mappedTypeNode.getTypeNode();
    if (typeNode) {
      typeStructure = convertTypeNode(typeNode, consoleTrap, subStructureResolver) ?? undefined;
    }
    if (typeStructure)
      mappedStructure.type = typeStructure;
  }

  switch (mappedTypeNode.getReadonlyToken()?.getKind()) {
    case SyntaxKind.ReadonlyKeyword:
      mappedStructure.readonlyToken = "readonly";
      break;
    case SyntaxKind.PlusToken:
      mappedStructure.readonlyToken = "+readonly";
      break;
    case SyntaxKind.MinusToken:
      mappedStructure.readonlyToken = "-readonly";
      break;
  }

  switch (mappedTypeNode.getQuestionToken()?.getKind()) {
    case SyntaxKind.QuestionToken:
      mappedStructure.questionToken = "?";
      break;
    case SyntaxKind.PlusToken:
      mappedStructure.questionToken = "+?";
      break;
    case SyntaxKind.MinusToken:
      mappedStructure.questionToken = "-?";
      break;
  }

  return mappedStructure;
}

function convertTemplateLiteralTypeNode(
  templateNode: TemplateLiteralTypeNode,
  consoleTrap: TypeNodeToTypeStructureConsole,
  subStructureResolver: SubstructureResolver,
): TemplateLiteralTypeStructureImpl | null
{
  const headText = templateNode.getHead().getLiteralText();
  const spans: [string | TypeStructures, string][] = [];

  for (const childTypeNode of templateNode.getTemplateSpans()) {
    if (
      (childTypeNode.getKind() !== SyntaxKind.TemplateLiteralTypeSpan) ||
      (childTypeNode.getChildCount() !== 2)
    ) {
      return reportConversionFailure(
        "unsupported template span", childTypeNode, childTypeNode, consoleTrap
      );
    }

    const [grandchildTypeNode, middleOrTailNode] = childTypeNode.getChildren();
    if (!Node.isLiteralLike(middleOrTailNode)) {
      return reportConversionFailure(
        "unsupported template middle or tail literal node",
        middleOrTailNode, childTypeNode, consoleTrap
      );
    }

    let grandchildStructure: string | TypeStructures | null;
    if (Node.isTypeNode(grandchildTypeNode)) {
      grandchildStructure = convertTypeNode(grandchildTypeNode, consoleTrap, subStructureResolver);
    }
    else {
      const kind: SyntaxKind = grandchildTypeNode.getKind();

      const keyword = LiteralKeywords.get(kind);
      if (keyword) {
        grandchildStructure = keyword;
      }
      else {
        return reportConversionFailure(
          "unsupported template middle or tail type node",
          grandchildTypeNode, childTypeNode, consoleTrap
        );
      }
    }

    if (!grandchildStructure)
      return null;

    const literalText = middleOrTailNode.getLiteralText();
    spans.push([grandchildStructure, literalText]);
  }

  return new TemplateLiteralTypeStructureImpl(headText, spans);
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
