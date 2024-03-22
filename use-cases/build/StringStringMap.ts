import path from "path";

import {
  type InterfaceDeclaration,
  type SourceFile,
  StructureKind,
} from "ts-morph";

import {
  PropertySignatureImpl,
  TypeMembersMap,
  getTypeAugmentedStructure,
  VoidTypeNodeToTypeStructureConsole,
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

  await moduleFile.save();
  return Promise.resolve();
}
