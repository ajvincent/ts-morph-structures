import assert from "node:assert/strict";

import {
  type ClassFieldStatement,
  type ClassStatementsGetter,
  type MemberedStatementsKey,
  MemberedTypeToClass,
  type TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js";

import {
  PromiseAllParallel,
} from "#utilities/source/PromiseTypes.js";

import {
  getClassInterfaceName,
  getStructureNameFromModified,
} from "#utilities/source/StructureNameTransforms.js";

import DecoratorModule from "../../moduleClasses/DecoratorModule.js";
import InterfaceModule from "../../moduleClasses/InterfaceModule.js";

export default
async function createDecorators(): Promise<void>
{
  const names: string[] = Array.from(
    InterfaceModule.decoratorsMap.keys()
  ).map(getStructureNameFromModified);

  await PromiseAllParallel(names, buildDecorator);
}

async function buildDecorator(
  name: string
): Promise<void>
{
  const module = new DecoratorModule(name);
  const interfaceMembers: TypeMembersMap = InterfaceModule.decoratorsMap.get(
    getClassInterfaceName(name)
  )!.typeMembers;
  assert(interfaceMembers.size > 0, "Empty interface?  Or was it just consumed?  " + name);

  const typeToClass = new MemberedTypeToClass(
    [],
    StatementsRouter
  );
  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  typeToClass.defineStatementsByPurpose("body", false);
  module.classMembersMap = typeToClass.buildClassMembersMap();

  await module.saveFile();
}

const StatementsRouter: ClassStatementsGetter = {
  getStatements(
    key: MemberedStatementsKey
  ): ClassFieldStatement[]
  {
    void(key);
    return [];
  }
}
