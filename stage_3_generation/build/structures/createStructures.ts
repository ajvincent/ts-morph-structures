import assert from "node:assert/strict";

import {
  Scope,
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type ClassMemberImpl,
  LiteralTypeStructureImpl,
  MemberedTypeToClass,
  ParameterDeclarationImpl,
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

import {
  addImportsToModule,
  InterfaceModule,
  StructureModule,
  publicExports,
} from "../../moduleClasses/exports.js";

import FlatInterfaceMap from "../../vanilla/FlatInterfaceMap.js";
import initializeTypes from "../../vanilla/initializer.js";

import addReadonlyArrayHandlers from "./addReadonlyArrayHandler.js";

import StatementsRouter from "../fieldStatements/StatementsRouter.js";
import ArrayReadonlyHandler from "../fieldStatements/TypeStructures/ArrayReadonlyHandler.js";
import KindPropertyInitializer from "./KindProperty.js";
import CloneStructureStatements from "./CloneStructureStatements.js";
import ConstructorStatements from "./ConstructorStatements.js";
import ProxyArrayStatements from "../fieldStatements/TypeStructures/ProxyArray.js";
import ShadowArrayStatements from "../fieldStatements/TypeStructures/ShadowArray.js";
import TypeStructureSetStatements from "../fieldStatements/TypeStructures/TypeStructureSet.js";
import TypeArrayStatements from "../fieldStatements/TypeStructures/ArrayGetter.js";

import DebuggingFilter from "../fieldStatements/Debugging.js";

void(ClassFieldStatementsMap);
void(DebuggingFilter);

export default
async function createStructures(): Promise<void>
{
  initializeTypes();
  const names: readonly string[] = Array.from(
    InterfaceModule.structuresMap.keys()
  ).map(getStructureNameFromModified);

  await PromiseAllParallel(names, buildStructure);
}

async function buildStructure(
  name: string
): Promise<void>
{
  const interfaceModule = InterfaceModule.structuresMap.get(
    getClassInterfaceName(name)
  )!;

  const module = new StructureModule(name, interfaceModule);
  const interfaceMembers: TypeMembersMap = interfaceModule.typeMembers.clone();

  modifyTypeMembersForTypeStructures(name, interfaceMembers);

  const router = new StatementsRouter(module);
  const typeToClass = new MemberedTypeToClass(getConstructorParameters(interfaceMembers), router);
  addReadonlyArrayHandlers(module, interfaceModule.typeMembers, typeToClass);

  router.filters.unshift(
    new ArrayReadonlyHandler(module),
    new KindPropertyInitializer(module),
    new CloneStructureStatements(module, typeToClass.constructorParameters),
    new ConstructorStatements(module, typeToClass.constructorParameters),
    new ShadowArrayStatements(module),
    new ProxyArrayStatements(module),
    new TypeStructureSetStatements(module),
    new TypeArrayStatements(module),
  );

  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  const copyFieldsSignature = module.createCopyFieldsMethod();
  typeToClass.addTypeMember(true, copyFieldsSignature);
  typeToClass.addTypeMember(true, module.createStaticCloneMethod());
  {
    const properties = interfaceMembers.arrayOfKind(StructureKind.PropertySignature);
    if (properties.some(prop => /^#.*Manager$/.test(prop.name))) {
      typeToClass.addTypeMember(false, module.createStructureIteratorMethod());
    }
  }
  typeToClass.addTypeMember(false, module.createToJSONMethod());

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
        case "clone":
        case "toJSON":
        case "[STRUCTURE_AND_TYPES_CHILDREN]":
        return Scope.Public;
      }
      return undefined;
    }
  };

  const flattened = FlatInterfaceMap.get(name);
  assert(flattened);
  for (const property of flattened.properties) {
    if (property.hasQuestionToken === false)
      typeToClass.insertMemberKey(false, property, false, "constructor");
  }

  try {
    module.classMembersMap = typeToClass.buildClassMembersMap();
  }
  catch (ex) {
    console.error("failed on module " + module.exportName);
    throw ex;
  }

  // eslint complains when we say isAsync: boolean = false;
  module.classMembersMap.arrayOfKind(StructureKind.Property).forEach(
    prop => {
      if ((prop.typeStructure === booleanType) && prop.initializer) {
        prop.typeStructure = undefined;
      }
      else if ((prop.typeStructure === stringType) && prop.initializer && !prop.hasQuestionToken) {
        prop.typeStructure = undefined;
      }

      else if (prop.typeStructure === TypeStructureSetLiteral)
        prop.typeStructure = undefined;
    }
  );

  module.classMembersMap.forEach(
    classMember => addImportsToModule(module, classMember)
  );

  publicExports.addExports({
    pathToExportedModule: module.importManager.absolutePathToModule,
    isDefaultExport: true,
    isType: false,
    exportNames: [module.exportName]
  });

  await module.saveFile();
}

function getConstructorParameters(
  interfaceMembers: TypeMembersMap
): ParameterDeclarationImpl[]
{
  void(interfaceMembers);
  return [];
}

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");
const TypeStructureSetLiteral = LiteralTypeStructureImpl.get("TypeStructureSet");
