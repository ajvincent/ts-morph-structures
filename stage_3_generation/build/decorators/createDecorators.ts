import assert from "node:assert/strict";

import {
  Scope,
  StructureKind,
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type ClassMemberImpl,
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

import DebuggingFilter from "../fieldStatements/Debugging.js";

void(ClassFieldStatementsMap);
void(DebuggingFilter);

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

  const replacedProperties = modifyTypeMembersForTypeStructures(name, interfaceMembers);

  const router = new StatementsRouter(module);

  const typeToClass = new MemberedTypeToClass([], router);
  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  // stage two sorts the type members... we don't.
  const copyFieldsMethod = module.createCopyFieldsMethod(false);
  typeToClass.addTypeMember(true, copyFieldsMethod);
  replacedProperties.forEach(prop => {
    typeToClass.insertMemberKey(false, prop, true, copyFieldsMethod);
  });
  {
    const properties = interfaceMembers.arrayOfKind(StructureKind.PropertySignature);
    if (properties.some(prop => /^#.*Manager$/.test(prop.name))) {
      typeToClass.addTypeMember(false, module.createStructureIteratorMethod());
    }
  }
  typeToClass.addTypeMember(false, module.createToJSONMethod());

  if (name.startsWith("StatementedNode")) {
    const cloneStatementFilter = new CloneStatement_Statements(module);
    router.filters.unshift(cloneStatementFilter);
    typeToClass.addTypeMember(true, cloneStatementFilter.getMethodSignature());
  }

  typeToClass.defineStatementsByPurpose("body", false);

  typeToClass.isGeneratorCallback = {
    isGenerator: function(isStatic: boolean, kind: StructureKind.Method, memberName: string): boolean {
      return isStatic === false && memberName === "[STRUCTURE_AND_TYPES_CHILDREN]";
    }
  };
  typeToClass.scopeCallback = {
    getScope: function(
      isStatic: boolean,
      kind: ClassMemberImpl["kind"],
      memberName: string
    ): Scope | undefined
    {
      void(isStatic);
      void(kind);
      switch (memberName) {
        case "[COPY_FIELDS]":
        case "toJSON":
        case "[STRUCTURE_AND_TYPES_CHILDREN]":
        return Scope.Public;
      }
      return undefined;
    }
  };

  module.classMembersMap = typeToClass.buildClassMembersMap();

  // eslint complains when we say isAsync: boolean = false;
  module.classMembersMap.arrayOfKind(StructureKind.Property).forEach(
    prop => {
      if ((prop.typeStructure === booleanType) && prop.initializer) {
        prop.typeStructure = undefined;
      }
      if ((prop.typeStructure === stringType) && prop.initializer && !prop.hasQuestionToken) {
        prop.typeStructure = undefined;
      }
    }
  );

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
