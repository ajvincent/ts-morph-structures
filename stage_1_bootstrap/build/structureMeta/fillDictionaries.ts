import {
  ArrayTypeNode,
  ExpressionWithTypeArguments,
  InterfaceDeclaration,
  Node,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeElementMemberedNode,
  TypeElementTypes,
  TypeNode,
} from "ts-morph";

import TS_MORPH_D from "../ts-morph-d-file.js";

import {
  DecoratorImplMeta,
  MetaType,
  PropertyName,
  PropertyValue,
  PropertyValueInUnion,
  StructureImplMeta,
  StructureMetaDictionaries,
  StructureUnionMeta,
} from "./DataClasses.js";

export default
function fillDictionaries(
  dictionary: StructureMetaDictionaries
): void
{
  const structureNames = new Set<string>(addStructureUnion(dictionary, "Structures").sort());
  const decoratorNameEntries: string[] = [];
  structureNames.forEach(name => {
    decoratorNameEntries.push(...addStructure(dictionary, name, name));
  });

  const decoratorNames = new Set<string>(decoratorNameEntries);
  decoratorNames.forEach(name => addDecorator(dictionary, name));

  resolveDecoratorKeys(dictionary);
  countDecoratorUsage(dictionary);
}

function addStructureUnion(
  dictionary: StructureMetaDictionaries,
  name: string,
): string[]
{
  const typeAlias: TypeAliasDeclaration = TS_MORPH_D.getTypeAliasOrThrow(name);
  const typeNode: TypeNode = typeAlias.getTypeNodeOrThrow();

  let identifiers: string[];
  if (typeNode.isKind(SyntaxKind.TypeReference)) {
    identifiers = [getIdentifierFromTypeReference(typeNode)];
  }
  else {
    identifiers = typeNode.asKindOrThrow(SyntaxKind.UnionType).getTypeNodes().map(getIdentifierFromTypeReference);
    identifiers.sort();
  }

  const data = new StructureUnionMeta(name);

  identifiers.forEach(id => {
    let idSet: Set<string>;
    if (id.endsWith("Structures")) {
      idSet = data.unionKeys;
    }
    else {
      idSet = data.structureNames;
    }
    idSet.add(id);
  });

  const structureNames = Array.from(data.structureNames);
  data.unionKeys.forEach(key => structureNames.push(...addStructureUnion(dictionary, key)));

  dictionary.addDefinition(data);
  return structureNames;
}

function getIdentifierFromTypeReference(
  node: TypeNode
): string
{
  const refNode = node.asKindOrThrow(SyntaxKind.TypeReference);
  if (refNode.getTypeArguments().length > 0)
    throw new Error("type argument?");
  return refNode.getTypeName().getText();
}

function addStructure(
  dictionary: StructureMetaDictionaries,
  interfaceName: string,
  targetInterfaceName: string,
): string[]
{
  const decl: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow(interfaceName);

  const structureMeta = dictionary.structures.getDefault(targetInterfaceName, () => {
    return new StructureImplMeta(targetInterfaceName);
  });

  addExtendsToStructureMeta(targetInterfaceName, decl, structureMeta, dictionary);
  addMembersToStructureMeta(interfaceName, targetInterfaceName, decl, structureMeta);

  return Array.from(structureMeta.decoratorKeys);
}

function addDecorator(
  dictionary: StructureMetaDictionaries,
  interfaceName: string,
): void
{
  if (dictionary.decorators.has(interfaceName))
    return;

  const decl: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow(interfaceName);

  const decoratorMeta = new DecoratorImplMeta(interfaceName);
  dictionary.decorators.set(interfaceName, decoratorMeta);

  addExtendsToStructureMeta(interfaceName, decl, decoratorMeta, dictionary);
  addMembersToStructureMeta(interfaceName, interfaceName, decl, decoratorMeta);

  decoratorMeta.decoratorKeys.forEach(
    subDecoratorName => addDecorator(dictionary, subDecoratorName)
  );
}

function addExtendsToStructureMeta(
  targetInterfaceName: string,
  decl: InterfaceDeclaration,
  structureMeta: StructureImplMeta | DecoratorImplMeta,
  dictionary: StructureMetaDictionaries
): void
{
  const _extendsArray: ExpressionWithTypeArguments[] = decl.getExtends();
  for (const _extends of _extendsArray) {
    // Handle KindedStructure<StructureKind.Foo>
    const expression = _extends.getExpression().asKindOrThrow(SyntaxKind.Identifier);
    const idText = expression.getText();
    if (idText === "KindedStructure") {
      if (structureMeta.metaType === MetaType.Decorator)
        throw new Error("shouldn't be reachable");
      const qualifiedName = _extends.getTypeArguments()[0].asKindOrThrow(SyntaxKind.TypeReference).getTypeName().asKindOrThrow(SyntaxKind.QualifiedName);
      structureMeta.structureKindName = qualifiedName.getRight().getText();
      continue;
    }

    if (idText.endsWith("SpecificStructure") || idText.endsWith("BaseStructure")) {
      if (structureMeta.metaType === MetaType.Decorator)
        throw new Error("shouldn't be reachable");
      addStructure(dictionary, idText, targetInterfaceName);
      continue;
    }

    structureMeta.decoratorKeys.add(idText);
  }
}

function addMembersToStructureMeta(
  interfaceName: string,
  targetInterfaceName: string,
  memberedNode: TypeElementMemberedNode,
  structureMeta: StructureImplMeta | DecoratorImplMeta
): void
{
  let member: TypeElementTypes;
  for (member of memberedNode.getMembers()) {
    const prop = member.asKindOrThrow(SyntaxKind.PropertySignature);
    const propertyName: PropertyName = prop.getName();
    const isBoolean = Node.isBooleanKeyword(prop.getTypeNodeOrThrow());
    if (isBoolean) {
      structureMeta.booleanKeys.add(propertyName);
      continue;
    }

    const propertyValue = new PropertyValue;
    if (interfaceName !== targetInterfaceName)
      propertyValue.fromTypeName = interfaceName;
    propertyValue.hasQuestionToken = prop.hasQuestionToken();

    const typeNode: TypeNode = prop.getTypeNodeOrThrow();
    const isArray = fillPropertyValueWithTypeNodes(interfaceName, propertyName, propertyValue, typeNode);

    structureMeta.addField(propertyName, isArray, propertyValue);
  }
}

function fillPropertyValueWithTypeNodes(
  interfaceName: string,
  propertyName: PropertyName,
  propertyValue: PropertyValue,
  typeNode: TypeNode,
  depth = 0
): boolean
{
  let isArray = false;
  if (Node.isArrayTypeNode(typeNode)) {
    isArray = true;
    typeNode = typeNode.getElementTypeNode();
  }
  if (Node.isParenthesizedTypeNode(typeNode)) {
    typeNode = typeNode.getTypeNode();
  }

  let typeNodeArray: TypeNode[] = [typeNode];
  if (Node.isUnionTypeNode(typeNode)) {
    typeNodeArray = typeNode.getTypeNodes();

    let innerArray: ArrayTypeNode | undefined;
    for (const innerNode of typeNodeArray) {
      if (!Node.isArrayTypeNode(innerNode))
        continue;

      if (depth) {
        throw new Error(`we're already one level into the recursion?  ${interfaceName}.${propertyName}`);
      }

      if (innerArray) {
        throw new Error(`More than one inner array?  ${interfaceName}.${propertyName}`);
      }
      innerArray = innerNode;
    }

    if (innerArray) {
      return fillPropertyValueWithTypeNodes(
        interfaceName, propertyName, propertyValue, innerArray, depth + 1
      );
    }
  }

  const stringIndex = typeNodeArray.findIndex(type => Node.isStringKeyword(type));
  if (stringIndex > -1) {
    propertyValue.mayBeString = true;
    typeNodeArray.splice(stringIndex, 1);
  }

  const undefinedIndex = typeNodeArray.findIndex(type => Node.isUndefinedKeyword(type));
  if (undefinedIndex > -1) {
    propertyValue.mayBeUndefined = true;
    typeNodeArray.splice(undefinedIndex, 1);
  }

  const writerIndex = typeNodeArray.findIndex(type => {
    if (!Node.isTypeReference(type))
      return false;
    const args = type.getTypeArguments();
    if (args.length > 0)
      return false;
    return type.getText() === "WriterFunction";
  });
  if (writerIndex > -1) {
    propertyValue.mayBeWriter = true;
    typeNodeArray.splice(writerIndex, 1);
  }

  typeNodeArray.forEach(typeNode => {
    const value = new PropertyValueInUnion;
    if (Node.isTypeReference(typeNode) && typeNode.getTypeName().getText() === "OptionalKind") {
      value.isOptionalKind = true;
      typeNode = typeNode.getTypeArguments()[0];
    }

    const fullText = typeNode.getText();
    if (fullText.endsWith("Structures"))
      value.unionName = fullText;
    else if (fullText.endsWith("Structure"))
      value.structureName = fullText;
    else
      value.tsmorph_Type = fullText;

    propertyValue.otherTypes.push(value);
  });

  return isArray;
}

function resolveDecoratorKeys(
  dictionary: StructureMetaDictionaries
): void
{
  const resolvables = new Map<string, string[]>;
  for (const dec of dictionary.decorators.values()) {
    if (dec.decoratorKeys.size === 0)
      continue;
    resolvables.set(dec.structureName, Array.from(dec.decoratorKeys));
  }

  let found: boolean;
  do {
    found = false;
    for (const str of dictionary.structures.values()) {
      for (const [name, subnames] of resolvables) {
        if (str.decoratorKeys.has(name)) {
          subnames.forEach(subname => str.decoratorKeys.add(subname));
          str.decoratorKeys.delete(name);
          found = true;
        }
      }
    }
  } while (found);

  for (const name of resolvables.keys()) {
    dictionary.decorators.delete(name);
  }
}

function countDecoratorUsage(
  dictionary: StructureMetaDictionaries
): void
{
  for (const str of dictionary.structures.values()) {
    for (const decName of str.decoratorKeys) {
      const dec = dictionary.decorators.get(decName)!;
      if (!dec)
        throw new Error(str.structureName + ": " + decName);
      dec.incrementCount();
    }
  }
}
