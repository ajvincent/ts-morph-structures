import assert from "node:assert/strict";
import path from "path";

import {
  type SourceFile,
  StructureKind,
  InterfaceDeclaration,
} from "ts-morph";

import {
  InterfaceDeclarationImpl,
  LiteralTypeStructureImpl,
  type MethodSignatureImpl,
  ParameterDeclarationImpl,
  ParameterTypeStructureImpl,
  PropertySignatureImpl,
  TupleTypeStructureImpl,
  TypeMembersMap,
  TypeStructureKind,
  VoidTypeNodeToTypeStructureConsole,
  getTypeAugmentedStructure,
} from "#stage_two/snapshot/source/exports.js";

import {
  distDir,
  project,
  removeDistFile,
} from "./utilities/sharedProject.js";

import getTypeScriptNodes from "./utilities/typescript-builtins.js";

export default async function buildStringStringMap(): Promise<void>
{
  const moduleFile = await buildInitialModuleFile();
  const typeMembers = buildTypeMembersMap();

  // checkpoint
  {
    const interfaceTemp = new InterfaceDeclarationImpl("StringStringMapInterface");
    typeMembers.clone().moveMembersToType(interfaceTemp);
    const interfaceNode: InterfaceDeclaration = moduleFile.addInterface(interfaceTemp);
    console.log(interfaceNode.print());
    interfaceNode.remove();
  }

  await moduleFile.save();
  return Promise.resolve();
}

async function buildInitialModuleFile(): Promise<SourceFile> {
  await removeDistFile("StringStringMap.ts");

  /* This is a starting point, based on our needs:
  - hashing two keys into one
  - retrieving two keys from one
  - storing the hashed keys and values in a private map
  */
  const moduleFile: SourceFile = project.createSourceFile(
    path.join(distDir, "StringStringMap.ts"),
    `
interface StringStringKey {
  readonly firstKey: string,
  readonly secondKey: string
}

export default class StringStringMap<V> {
  static #hashKeys(firstKey: string, secondKey: string): string {
    return JSON.stringify({firstKey, secondKey});
  }

  static #parseKeys(hashedKey: string): [string, string]
  {
    const { firstKey, secondKey } = JSON.parse(hashedKey) as StringStringKey;
    return [firstKey, secondKey];
  }

  /*
  readonly #hashMap = new Map<string, V>;
  */
}
    `.trim()
  );

  return moduleFile;
}

function buildTypeMembersMap(): TypeMembersMap {
  /* What are we dealing with? */
  const MapInterfaceNodes = getTypeScriptNodes<InterfaceDeclaration>(
    sourceFile => sourceFile.getInterfaces().filter(ifc => ifc.getName() === "Map")
  ).map(entry => entry[1]);
  for (const node of MapInterfaceNodes) {
    console.log(node.print());
  }

  // Create the initial type members map
  const typeMembers = new TypeMembersMap();
  MapInterfaceNodes.forEach(node => {
    const structure = getTypeAugmentedStructure(node, VoidTypeNodeToTypeStructureConsole, true, StructureKind.Interface).rootStructure;
    typeMembers.addMembers([
      // no getters or setters to worry about
      ...structure.properties,
      ...structure.methods
    ]);
  });
  {
    const hashMap = new PropertySignatureImpl("#hashMap");
    hashMap.isReadonly = true;
    typeMembers.addMembers([hashMap]);
  }
  typeMembers.convertPropertyToAccessors("size", true, false);
  typeMembers.arrayOfKind(StructureKind.MethodSignature).forEach(modifyMethodSignature);

  return typeMembers;
}

function modifyMethodSignature(method: MethodSignatureImpl): void {
  if (method.name === "keys") {
    const { returnTypeStructure } = method;
    assert.equal(returnTypeStructure?.kind, TypeStructureKind.TypeArgumented, "Expected a type-argumented type.");
    assert.equal(returnTypeStructure.objectType, LiteralTypeStructureImpl.get("IterableIterator"), "Expected an IterableIterator");
    assert.equal(returnTypeStructure.childTypes.length, 1);
    assert.equal(returnTypeStructure.childTypes[0], LiteralTypeStructureImpl.get("K"));

    returnTypeStructure.childTypes[0] = new TupleTypeStructureImpl([
      LiteralTypeStructureImpl.get("string"),
      LiteralTypeStructureImpl.get("string"),
    ]);
    return;
  }

  if ((method.name === "entries") || (method.name === "[Symbol.iterator]")) {
    const { returnTypeStructure } = method;
    assert.equal(returnTypeStructure?.kind, TypeStructureKind.TypeArgumented, "Expected a type-argumented type.");
    assert.equal(returnTypeStructure.objectType, LiteralTypeStructureImpl.get("IterableIterator"), "Expected an IterableIterator");
    assert.equal(returnTypeStructure.childTypes.length, 1);

    assert.equal(returnTypeStructure.childTypes[0].kind, TypeStructureKind.Tuple);
    returnTypeStructure.childTypes[0].childTypes.splice(
      0, 1, LiteralTypeStructureImpl.get("string"), LiteralTypeStructureImpl.get("string")
    );
    return;
  }

  if (method.name === "forEach") {
    // forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    const callbackFn: ParameterDeclarationImpl = method.parameters[0];

    const { typeStructure } = callbackFn;
    assert.equal(typeStructure?.kind, TypeStructureKind.Function, "the callback should be a function");

    const firstKeyParam = new ParameterTypeStructureImpl("firstKey", LiteralTypeStructureImpl.get("string"));
    const secondKeyParam = new ParameterTypeStructureImpl("secondKey", LiteralTypeStructureImpl.get("string"));

    typeStructure.parameters.splice(1, 1, firstKeyParam, secondKeyParam);
    typeStructure.parameters[3].typeStructure = LiteralTypeStructureImpl.get("StringStringMap");
    return;
  }

  const { parameters } = method;
  const keyIndex = parameters.findIndex(param => param.name === "key");
  if (keyIndex > -1) {
    const firstParam = new ParameterDeclarationImpl("firstKey");
    firstParam.typeStructure = LiteralTypeStructureImpl.get("string");

    const secondParam = new ParameterDeclarationImpl("secondKey");
    secondParam.typeStructure = LiteralTypeStructureImpl.get("string");

    parameters.splice(keyIndex, 1, firstParam, secondParam);
  }
}
