import {
  StructureKind
} from "ts-morph";

import {
  type TypeMembersMap,
  TypeStructureKind,
  PropertySignatureImpl,
} from "#stage_two/snapshot/source/exports.js";

import PropertyHashesWithTypes from "./PropertyHashesWithTypes.js";

export default function modifyTypeMembersForTypeStructures(
  baseName: string,
  map: TypeMembersMap
): void
{
  map.arrayOfKind(StructureKind.PropertySignature).forEach(
    prop => convertTypeToAccessors(baseName, prop, map)
  );
}

function convertTypeToAccessors(
  baseName: string,
  property: PropertySignatureImpl,
  map: TypeMembersMap
): void
{
  const hash = baseName + ":" + property.name;
  if (!PropertyHashesWithTypes.has(hash))
    return;

  if (property.typeStructure!.kind === TypeStructureKind.Array)
    return;

  map.convertPropertyToAccessors(property.name, true, true);
  map.convertPropertyToAccessors(property.name + "Structure", true, true);

  const manager = new PropertySignatureImpl(`#${property.name}Manager`);
  manager.isReadonly = true;
  map.addMembers([manager]);
}
