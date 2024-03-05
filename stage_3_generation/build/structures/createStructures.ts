import {
  Scope,
  StructureKind
} from "ts-morph";

import {
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

import {
  addImportsToModule,
  InterfaceModule,
  StructureModule,
  publicExports,
} from "../../moduleClasses/exports.js";

import modifyTypeMembersForTypeStructures from "../classTools/modifyTypeMembersForTypeStructures.js";

import StatementsRouter from "../fieldStatements/StatementsRouter.js";
import KindPropertyInitializer from "./KindProperty.js";
import CloneStructureStatements from "./CloneStructureStatements.js";

export default
async function createStructures(): Promise<void>
{
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
  router.filters.push(new KindPropertyInitializer(module));
  router.filters.push(new CloneStructureStatements(module));

  const typeToClass = new MemberedTypeToClass([], router);
  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  // stage two sorts the type members... we don't.
  typeToClass.addTypeMember(true, module.createCopyFieldsMethod());
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
      if ((prop.typeStructure === stringType) && prop.initializer && !prop.hasQuestionToken) {
        prop.typeStructure = undefined;
      }
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


const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");
