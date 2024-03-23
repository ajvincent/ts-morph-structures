import assert from "node:assert/strict";
import path from "path";

import {
  type InterfaceDeclaration,
  type SourceFile,
  StructureKind,
} from "ts-morph";

import {
  LiteralTypeStructureImpl,
  type MethodSignatureImpl,
  PropertySignatureImpl,
  TypeMembersMap,
  TypeStructureKind,
  getTypeAugmentedStructure,
  VoidTypeNodeToTypeStructureConsole,
  TupleTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  distDir,
  project,
  removeDistFile,
  //getExistingSourceFile,
} from "./utilities/sharedProject.js";

import getTypeScriptNodes from "./utilities/typescript-builtins.js";

export default async function buildStringStringMap(): Promise<void>
{
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

  {
    const methods: readonly MethodSignatureImpl[] = typeMembers.arrayOfKind(StructureKind.MethodSignature);
    for (const method of methods) {
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
      }
    }
  }

  await moduleFile.save();
  return Promise.resolve();
}
