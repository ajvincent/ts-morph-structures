import {
  /*
  type ClassMemberImpl,
  LiteralTypeStructureImpl,
  */
  type MemberedStatementsKey,
  MemberedTypeToClass,
  type TypeMembersMap,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import {
  PromiseAllParallel,
} from "#utilities/source/PromiseTypes.js";

import {
  getClassInterfaceName,
  getStructureNameFromModified,
} from "#utilities/source/StructureNameTransforms.js";

import {
  /*
  addImportsToModule,
  */
  InterfaceModule,
  StructureModule,
  publicExports,
} from "../../moduleClasses/exports.js";

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

  const typeToClass = new MemberedTypeToClass([], {
    getStatements(
      key: MemberedStatementsKey
    ): readonly stringWriterOrStatementImpl[]
    {
      void(key);
      return [];
    }
  });
  typeToClass.importFromTypeMembersMap(false, interfaceMembers);

  module.classMembersMap = typeToClass.buildClassMembersMap();

  publicExports.addExports({
    pathToExportedModule: module.importManager.absolutePathToModule,
    isDefaultExport: true,
    isType: false,
    exportNames: [module.structureName]
  });

  await module.saveFile();
}
