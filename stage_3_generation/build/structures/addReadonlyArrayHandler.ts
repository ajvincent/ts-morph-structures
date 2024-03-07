import {
  StructureKind
} from "ts-morph";

import {
  MemberedTypeToClass,
  PropertySignatureImpl,
  type TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js";

import {
  StructureModule,
} from "../../moduleClasses/exports.js";

import PropertyHashesWithTypes from "../classTools/PropertyHashesWithTypes.js";

export default function addReadonlyArrayHandlers(
  module: StructureModule,
  interfaceMembers: TypeMembersMap,
  typeToClass: MemberedTypeToClass
): void
{
  const properties = interfaceMembers.arrayOfKind(StructureKind.PropertySignature);
  const { baseName } = module;
  properties.forEach(property => {
    const hash = baseName + ":" + property.name;
    if (PropertyHashesWithTypes.has(hash)) {
      const handler = new PropertySignatureImpl(`#${property.name}ArrayReadonlyHandler`);
      handler.isReadonly = true;
      typeToClass.addTypeMember(true, handler);
    }
  });
}
