import {
  StructureKind
} from "ts-morph";

import {
  getTypeAugmentedStructure,
  /*
  LiteralTypeStructureImpl,
  TypeStructureKind,
  */
  TypeMembersMap,
  VoidTypeNodeToTypeStructureConsole,
} from "#stage_two/snapshot/source/exports.js";

import {
  getClassInterfaceName,
} from "#utilities/source/StructureNameTransforms.js";

import TS_MORPH_D from "#utilities/source/ts-morph-d-file.js";

import AwaitedMap from "#utilities/source/AwaitedMap.js";

import InterfaceModule from "../moduleClasses/InterfaceModule.js";

export default async function createInterfaces(
  names: readonly string[]
): Promise<void>
{
  /* Here's what we have to do.
  (1) Create the structure interfaces.
  (2) Determine which decorator interfaces we need.
  (3) Create the decorator interfaces.
  (4) Consolidate decorator interfaces into structures as necessary.
  (5) Convert structure members' types to the desired format.
  */

  const decoratorPromiseMap = new AwaitedMap<string, InterfaceModule>;
  for (const name of names) {
    createStructureInterface(name, decoratorPromiseMap);
  }

  const decoratorMap = await decoratorPromiseMap.allResolved();
  void(decoratorMap);
}

function createStructureInterface(
  name: string,
  decoratorPromiseMap: AwaitedMap<string, InterfaceModule>
): void
{
  const structureInterface = getTypeAugmentedStructure(
    TS_MORPH_D.getInterfaceOrThrow(name),
    VoidTypeNodeToTypeStructureConsole,
    true,
    StructureKind.Interface
  ).rootStructure;

  const interfaceModule = new InterfaceModule(
    getClassInterfaceName(name),
    TypeMembersMap.fromMemberedObject(structureInterface),
    structureInterface.extendsSet
  );
  InterfaceModule.structuresMap.set(
    interfaceModule.defaultExportName, interfaceModule
  );

  void(decoratorPromiseMap);
}
