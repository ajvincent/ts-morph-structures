import {
  getClassInterfaceName
} from "#utilities/source/StructureNameTransforms.js";

import InterfaceModule from "../moduleClasses/InterfaceModule.js";

export default function createStructureInterfaces(
  names: readonly string[]
): void
{
  names.forEach(createInterface)
}

function createInterface(name: string): void {

  const interfaceModule = new InterfaceModule(getClassInterfaceName(name));
  InterfaceModule.structuresMap.set(
    interfaceModule.defaultExportName, interfaceModule
  );
}
