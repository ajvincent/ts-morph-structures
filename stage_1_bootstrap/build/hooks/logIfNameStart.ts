/*
import {
  CodeBlockWriter,
  Scope,
  StructureKind,
} from "ts-morph";
*/

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
  DecoratorHook,
  StructureHook,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

export default function logIfNameStart(
  prefix: string,
): DecoratorHook & StructureHook
{
  return function(
    name: string,
    meta: DecoratorImplMeta | StructureImplMeta,
    dictionaries: StructureDictionaries
  ): Promise<void>
  {
    if (!name.startsWith(prefix))
      return Promise.resolve();

    let parts: DecoratorParts | StructureParts;
    if (meta instanceof DecoratorImplMeta) {
      parts = dictionaries.decoratorParts.get(meta)!;
    } else {
      parts = dictionaries.structureParts.get(meta)!;
    }

    const {
      booleanKeys,
      structureFields,
      structureFieldArrays,
    } = meta;

    const {
      classDecl,
      classFieldsStatements,
      classMembersMap,
    } = parts;

    console.log(JSON.stringify({
      booleanKeys: Object.fromEntries(booleanKeys.entries()),
      structureFields: Object.fromEntries(structureFields.entries()),
      structureFieldArrays: Object.fromEntries(structureFieldArrays.entries()),
      members: Object.fromEntries(classMembersMap.entries()),
      fields: Array.from(classFieldsStatements.entries()),
      classDecl,
    }, null, 2));

    return Promise.resolve();
  }
}
