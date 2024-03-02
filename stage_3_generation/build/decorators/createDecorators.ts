import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  LiteralTypeStructureImpl,
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

import modifyTypeMembersForTypeStructures from "../classTools/modifyTypeMembersForTypeStructures.js";

import StatementsRouter from "../fieldStatements/StatementsRouter.js";
import CloneStatement_Statements from "./CloneStatement.js";

import {
  addImportsToModule,
  DecoratorModule,
  InterfaceModule,
  internalExports,
} from "../../moduleClasses/exports.js";

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
  )!.typeMembers.clone();
  assert(interfaceMembers.size > 0, "Empty interface?  Or was it just consumed?  " + name);

  modifyTypeMembersForTypeStructures(name, interfaceMembers);

  const router = new StatementsRouter(module);

  // mixins can't have constructors, so they can't have arguments for constructors either.
  const typeToClass = new MemberedTypeToClass([], router);
  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  typeToClass.addTypeMember(true, module.createCopyFieldsMethod())

  if (name.startsWith("StatementedNode")) {
    const cloneStatementFilter = new CloneStatement_Statements(module);
    router.filters.unshift(cloneStatementFilter);
    typeToClass.addTypeMember(true, cloneStatementFilter.getMethodSignature());
  }


  typeToClass.defineStatementsByPurpose("body", false);
  module.classMembersMap = typeToClass.buildClassMembersMap();

  // eslint complains when we say isAsync: boolean = false;
  module.classMembersMap.arrayOfKind(StructureKind.Property).forEach(
    prop => {
      if ((prop.typeStructure === booleanType) && prop.initializer) {
        prop.typeStructure = undefined;
      }
      if ((prop.typeStructure === stringType) && prop.initializer) {
        prop.typeStructure = undefined;
      }
    }
  )

  module.classMembersMap.forEach(
    classMember => addImportsToModule(module, classMember)
  );

  internalExports.addExports({
    pathToExportedModule: module.importManager.absolutePathToModule,
    isDefaultExport: true,
    isType: false,
    exportNames: [module.defaultExportName]
  });

  internalExports.addExports({
    pathToExportedModule: module.importManager.absolutePathToModule,
    isDefaultExport: false,
    isType: true,
    exportNames: [module.fieldsName]
  });

  await module.saveFile();
}

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");
