import {
  StructureKind
} from "ts-morph";

import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

const COPY_FIELDS_NAME = ClassMembersMap.keyFromName(
  StructureKind.Method,
  true,
  "[COPY_FIELDS]"
);

export default function removeUselessCopyFields(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  const copyFields = parts.classFieldsStatements.groupStatementsMap(COPY_FIELDS_NAME);

  if (copyFields!.size === 1) {
    parts.classMembersMap.delete(COPY_FIELDS_NAME);
  }

  return Promise.resolve();
}
