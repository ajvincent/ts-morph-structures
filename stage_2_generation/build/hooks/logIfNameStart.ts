import {
  CodeBlockWriter,
} from "ts-morph";

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
  DecoratorHook,
  StructureHook,
} from "#stage_two/generation/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_two/generation/build/structureMeta/DataClasses.js";

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
      classImplementsMap,
      importsManager,
    } = parts;

    const fields = Array.from(classFieldsStatements.entries()).map(entry => [
      entry[0], entry[1], entry[2].map(stmt => replaceWriterWithString(stmt))
    ]);

    console.log(JSON.stringify({
      imports: importsManager.getDeclarations().map(decl => decl.toJSON()),
      booleanKeys: Object.fromEntries(booleanKeys.entries()),
      structureFields: Object.fromEntries(structureFields.entries()),
      structureFieldArrays: Object.fromEntries(structureFieldArrays.entries()),
      interfaceMembers: Object.fromEntries(classImplementsMap.entries()),
      members: Object.fromEntries(classMembersMap.entries()),
      fields,
      classDecl,
    }, null, 2));

    return Promise.resolve();
  }
}

export function replaceWriterWithString
(
  value: unknown,
): unknown
{
  if (typeof value === "function") {
    const writer = new CodeBlockWriter();
    value(writer);
    return writer.toString();
  }

  return value;
}
