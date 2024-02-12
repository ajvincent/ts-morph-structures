import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import type {
  TypeMemberImpl
} from "#stage_one/build/utilities/public/TypeMembersMap.js";

export default function sortInterfaceFields(
  name: string,
  meta: DecoratorImplMeta | StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{

  let parts: DecoratorParts | StructureParts;
  if (meta instanceof DecoratorImplMeta) {
    parts = dictionaries.decoratorParts.get(meta)!;
  } else {
    parts = dictionaries.structureParts.get(meta)!;
  }

  parts.classImplementsMap.sortEntries(entryComparator);
  return Promise.resolve();
}

function entryComparator(
  a: [string, TypeMemberImpl],
  b: [string, TypeMemberImpl]
): number
{
  if (a[0] === "kind")
    return -1;
  if (b[0] === "kind")
    return +1;

  return a[0].localeCompare(b[0]);
}
