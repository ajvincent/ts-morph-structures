import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";


export default function removeUselessCopyFields(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  const index = parts.classDecl.methods.findIndex(m => m.name === "[COPY_FIELDS]");
  const copyFields = parts.classDecl.methods[index]!;

  if (copyFields.statements.length === 1) {
    parts.classDecl.methods.splice(index, 1);
  }

  return Promise.resolve();
}
