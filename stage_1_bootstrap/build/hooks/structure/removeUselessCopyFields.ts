import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import type {
  MethodDeclarationImpl
} from "#stage_one/prototype-snapshot/exports.js";

const COPY_FIELDS_NAME = "static [COPY_FIELDS]";

export default function removeUselessCopyFields(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  const copyFields = parts.classMembersMap.get(COPY_FIELDS_NAME)! as MethodDeclarationImpl;

  if (copyFields.statements.length === 1) {
    parts.classMembersMap.delete(COPY_FIELDS_NAME);
  }

  return Promise.resolve();
}
